import { requireAdmin } from "@/lib/adminAuth";
import { prisma } from "@/lib/db";
import {
  ArrowUpRight,
  CheckCircle2,
  CircleAlert,
  FileText,
  ImagePlus,
  Inbox,
  Mail,
  MessageSquare,
  Package,
  PenLine,
  Users,
} from "lucide-react";
import LiveRefresh from "@/components/admin/LiveRefresh";
import Link from "next/link";

export const dynamic = "force-dynamic";

const DAY = 86_400_000;

function Stat({
  title,
  value,
  hint,
  href,
  icon: Icon,
  accent,
}: {
  title: string;
  value: number;
  hint: string;
  href: string;
  icon: typeof Package;
  accent?: boolean;
}) {
  return (
    <Link
      href={href}
      className="group rounded-[16px] border border-border bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md"
    >
      <div className="flex items-start justify-between">
        <span
          className={`flex h-10 w-10 items-center justify-center rounded-2xl ${
            accent ? "bg-primary text-dark" : "bg-background-field text-dark"
          }`}
        >
          <Icon className="h-5 w-5" strokeWidth={2} />
        </span>
        <ArrowUpRight className="h-4 w-4 text-lighter transition group-hover:text-primary" />
      </div>
      <p className="mt-4 font-body text-3xl font-extrabold tabular-nums text-dark">{value.toLocaleString()}</p>
      <p className="mt-1 text-[11px] font-bold uppercase tracking-[0.12em] text-lighter">{title}</p>
      <p className="mt-1 text-xs text-text">{hint}</p>
    </Link>
  );
}

function startOfWindow() {
  const d = new Date(Date.now() - 13 * DAY);
  d.setHours(0, 0, 0, 0);
  return d;
}

export default async function AdminDashboard() {
  await requireAdmin();

  const since = startOfWindow();

  const [products, posts, faqs, subscribers, newQuotes, totalQuotes, unread, quotes14, msgs14, recentQuotes, recentMessages, recentLogs] =
    await Promise.all([
      prisma.product.count(),
      prisma.blogPost.count(),
      prisma.faq.count(),
      prisma.newsletterSubscriber.count(),
      prisma.quoteRequest.count({ where: { status: "NEW" } }),
      prisma.quoteRequest.count(),
      prisma.contactMessage.count({ where: { isRead: false } }),
      prisma.quoteRequest.findMany({ where: { createdAt: { gte: since } }, select: { createdAt: true } }),
      prisma.contactMessage.findMany({ where: { createdAt: { gte: since } }, select: { createdAt: true } }),
      prisma.quoteRequest.findMany({ orderBy: { createdAt: "desc" }, take: 5 }),
      prisma.contactMessage.findMany({ orderBy: { createdAt: "desc" }, take: 5 }),
      prisma.auditLog.findMany({
        orderBy: { createdAt: "desc" },
        take: 6,
        include: { user: { select: { email: true } } },
      }),
    ]);

  // Leads per day for the last 14 days.
  const days = Array.from({ length: 14 }, (_, i) => {
    const d = new Date(since.getTime() + i * DAY);
    return { key: d.toDateString(), label: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }), count: 0 };
  });
  for (const row of [...quotes14, ...msgs14]) {
    const slot = days.find((d) => d.key === row.createdAt.toDateString());
    if (slot) slot.count++;
  }
  const max = Math.max(1, ...days.map((d) => d.count));
  const total14 = days.reduce((s, d) => s + d.count, 0);

  const health = [
    { ok: !!process.env.RESEND_API_KEY, label: "Email notifications", fix: "Set RESEND_API_KEY to get emailed about new leads." },
    { ok: products > 0, label: "Products added", fix: "Add products so the catalog isn't empty." },
    { ok: posts > 0, label: "Blog posts published", fix: "Publish a post to start ranking on search." },
    { ok: faqs > 0, label: "FAQs added", fix: "Add FAQs under FAQs & reviews." },
    {
      ok: !!process.env.NEXT_PUBLIC_SITE_URL && !process.env.NEXT_PUBLIC_SITE_URL.includes("localhost"),
      label: "Public site URL",
      fix: "Set NEXT_PUBLIC_SITE_URL to your real domain.",
    },
  ];

  const actions = [
    { href: "/adminpanel/products", label: "Add product", icon: Package },
    { href: "/adminpanel/blog", label: "Write blog post", icon: PenLine },
    { href: "/adminpanel/media", label: "Upload image", icon: ImagePlus },
    { href: "/adminpanel/quotes", label: "Review quotes", icon: Inbox },
  ];

  return (
    <div className="space-y-6">
      <div className="rounded-[20px] border border-border bg-white p-6 shadow-sm md:p-8">
        <div className="flex items-center justify-between gap-3">
          <p className="section-label text-primary">Overview</p>
          <LiveRefresh seconds={30} />
        </div>
        <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="font-heading text-3xl text-dark md:text-4xl">Website control center</h2>
            <p className="mt-2 max-w-xl text-sm text-text">
              {newQuotes > 0 || unread > 0
                ? `You have ${newQuotes} new quote${newQuotes === 1 ? "" : "s"} and ${unread} unread message${unread === 1 ? "" : "s"}.`
                : "You're all caught up — no new leads waiting."}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {actions.map((a) => (
              <Link
                key={a.href}
                href={a.href}
                className="inline-flex items-center gap-2 rounded-full border border-border bg-white px-4 py-2 text-[13px] font-semibold text-dark transition hover:border-primary hover:text-primary"
              >
                <a.icon className="h-4 w-4" /> {a.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        <Stat title="New quotes" value={newQuotes} hint={`${totalQuotes} total received`} href="/adminpanel/quotes" icon={Inbox} accent />
        <Stat title="Unread messages" value={unread} hint="From the contact form" href="/adminpanel/messages" icon={MessageSquare} accent />
        <Stat title="Subscribers" value={subscribers} hint="Newsletter sign-ups" href="/adminpanel/subscribers" icon={Mail} />
        <Stat title="Products" value={products} hint="In your catalog" href="/adminpanel/products" icon={Package} />
        <Stat title="Blog posts" value={posts} hint="Articles on site" href="/adminpanel/blog" icon={FileText} />
        <Stat title="FAQs" value={faqs} hint="Help content" href="/adminpanel/home" icon={Users} />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        <section className="rounded-[20px] border border-border bg-white p-6 shadow-sm">
          <div className="flex items-baseline justify-between">
            <h3 className="font-heading text-xl text-dark">Leads · last 14 days</h3>
            <span className="text-sm text-text">{total14} total</span>
          </div>
          <div className="mt-6 flex h-40 items-end gap-1.5" role="img" aria-label={`${total14} leads in the last 14 days`}>
            {days.map((d) => (
              <div key={d.key} className="group relative flex h-full flex-1 items-end" title={`${d.label}: ${d.count}`}>
                <div
                  className="w-full rounded-t-md bg-gradient-to-t from-primary to-secondary/80 transition group-hover:opacity-80"
                  style={{ height: `${d.count === 0 ? 3 : Math.max(8, (d.count / max) * 100)}%`, opacity: d.count === 0 ? 0.15 : 1 }}
                />
              </div>
            ))}
          </div>
          <div className="mt-2 flex justify-between text-[11px] text-lighter">
            <span>{days[0].label}</span>
            <span>{days[days.length - 1].label}</span>
          </div>
        </section>

        <section className="rounded-[20px] border border-border bg-white p-6 shadow-sm">
          <h3 className="font-heading text-xl text-dark">Setup checklist</h3>
          <ul className="mt-4 space-y-3">
            {health.map((h) => (
              <li key={h.label} className="flex gap-3 text-sm">
                {h.ok ? (
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                ) : (
                  <CircleAlert className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
                )}
                <div>
                  <p className="font-semibold text-dark">{h.label}</p>
                  {!h.ok && <p className="text-xs text-text">{h.fix}</p>}
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-[20px] border border-border bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="font-heading text-xl text-dark">Recent quotes</h3>
            <Link href="/adminpanel/quotes" className="text-[13px] font-semibold text-primary">View all</Link>
          </div>
          <ul className="mt-4 divide-y divide-border">
            {recentQuotes.length === 0 && <li className="py-4 text-sm text-text">No quote requests yet.</li>}
            {recentQuotes.map((q) => (
              <li key={q.id} className="flex items-center justify-between gap-3 py-3 text-sm">
                <div className="min-w-0">
                  <p className="truncate font-semibold text-dark">{q.name}</p>
                  <p className="truncate text-xs text-text">{q.email}</p>
                </div>
                <div className="shrink-0 text-right">
                  <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-bold text-primary">{q.status}</span>
                  <p className="mt-1 text-[11px] text-lighter">{q.createdAt.toLocaleDateString("en-US", { month: "short", day: "numeric" })}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-[20px] border border-border bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="font-heading text-xl text-dark">Recent messages</h3>
            <Link href="/adminpanel/messages" className="text-[13px] font-semibold text-primary">View all</Link>
          </div>
          <ul className="mt-4 divide-y divide-border">
            {recentMessages.length === 0 && <li className="py-4 text-sm text-text">No messages yet.</li>}
            {recentMessages.map((m) => (
              <li key={m.id} className="flex items-center justify-between gap-3 py-3 text-sm">
                <div className="min-w-0">
                  <p className="truncate font-semibold text-dark">
                    {!m.isRead && <span className="mr-2 inline-block h-2 w-2 rounded-full bg-secondary" />}
                    {m.name}
                  </p>
                  <p className="truncate text-xs text-text">{m.message}</p>
                </div>
                <p className="shrink-0 text-[11px] text-lighter">{m.createdAt.toLocaleDateString("en-US", { month: "short", day: "numeric" })}</p>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <section className="rounded-[20px] border border-border bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <h3 className="font-heading text-xl text-dark">Recent activity</h3>
          <Link href="/adminpanel/activity" className="text-[13px] font-semibold text-primary">Full log</Link>
        </div>
        <ul className="mt-4 divide-y divide-border">
          {recentLogs.length === 0 && <li className="py-4 text-sm text-text">Nothing logged yet.</li>}
          {recentLogs.map((l) => (
            <li key={l.id} className="flex items-center justify-between gap-3 py-3 text-sm">
              <span className="font-semibold text-dark">{l.action}</span>
              <span className="truncate text-xs text-lighter">
                {l.user?.email ?? "system"} · {l.createdAt.toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })}
              </span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
