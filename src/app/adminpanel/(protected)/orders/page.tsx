import TrackingFields from "@/components/admin/TrackingFields";
import ShareTracking from "@/components/admin/ShareTracking";
import SubmitButton from "@/components/admin/SubmitButton";
import { requireAdmin } from "@/lib/adminAuth";
import { prisma } from "@/lib/db";
import { ORDER_STAGES, stageIndex } from "@/lib/orderTracking";
import { ArrowRight, Check, ExternalLink, Plus, Search, Truck } from "lucide-react";
import Link from "next/link";
import { advanceStage, saveTracking, startTracking } from "./actions";

export const dynamic = "force-dynamic";

const input =
  "w-full min-h-[44px] rounded-xl border border-border bg-white px-4 py-2.5 text-[16px] text-dark outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15 sm:text-sm";
const day = (d: Date) => d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

export default async function AdminOrdersPage({ searchParams }: { searchParams: Promise<{ stage?: string; q?: string }> }) {
  await requireAdmin();
  const sp = await searchParams;
  const stage = ORDER_STAGES.find((s) => s.key === sp.stage)?.key;
  const q = (sp.q ?? "").trim();
  const match = q
    ? { OR: [{ reference: { contains: q, mode: "insensitive" as const } }, { name: { contains: q, mode: "insensitive" as const } }, { email: { contains: q, mode: "insensitive" as const } }] }
    : {};

  const [orders, counts, untracked] = await Promise.all([
    prisma.quoteRequest.findMany({
      where: { ...match, orderStage: stage ?? { not: null } },
      orderBy: { updatedAt: "desc" },
      include: { items: { select: { productName: true, quantity: true } }, updates: { orderBy: { createdAt: "desc" }, take: 1 } },
    }),
    prisma.quoteRequest.groupBy({ by: ["orderStage"], where: { orderStage: { not: null } }, _count: true }),
    prisma.quoteRequest.findMany({ where: { ...match, orderStage: null }, orderBy: { createdAt: "desc" }, take: 12, select: { id: true, reference: true, name: true, email: true, createdAt: true } }),
  ]);
  const count = (k: string) => counts.find((c) => c.orderStage === k)?._count ?? 0;
  const total = counts.reduce((s, c) => s + c._count, 0);
  const tab = (active: boolean) =>
    `rounded-full border px-4 py-2 text-[13px] font-semibold ${active ? "border-primary bg-primary text-dark" : "border-border bg-white text-dark hover:border-primary"}`;

  return (
    <div className="space-y-6">
      <div className="rounded-[20px] border border-border bg-white p-6 shadow-sm md:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="font-heading text-3xl text-dark">Orders &amp; tracking</h2>
            <p className="mt-2 max-w-2xl text-sm text-text">
              Manage every order here: start tracking a quote, move it to the next stage, add the carrier and tracking number, and write notes the customer sees. Customers follow progress at <strong>/track</strong> with their reference and email.
            </p>
          </div>
          <form action="/adminpanel/orders" className="flex items-center gap-2 rounded-full border border-border bg-white px-3 py-2 text-sm text-lighter">
            {stage && <input type="hidden" name="stage" value={stage} />}
            <Search className="h-4 w-4" />
            <input name="q" defaultValue={q} placeholder="Reference, name or email" className="w-44 bg-transparent text-dark outline-none placeholder:text-lighter" />
          </form>
        </div>
        <div className="mt-5 flex flex-wrap gap-2">
          <Link href={q ? `/adminpanel/orders?q=${encodeURIComponent(q)}` : "/adminpanel/orders"} className={tab(!stage)}>All ({total})</Link>
          {ORDER_STAGES.map((s) => (
            <Link key={s.key} href={`/adminpanel/orders?stage=${s.key}${q ? `&q=${encodeURIComponent(q)}` : ""}`} className={tab(stage === s.key)}>
              {s.label} ({count(s.key)})
            </Link>
          ))}
        </div>
      </div>

      <details className="group rounded-[20px] border border-border bg-white shadow-sm" open={orders.length === 0 || !!q}>
        <summary className="flex cursor-pointer items-center justify-between gap-3 p-5 text-sm font-bold text-dark md:px-8">
          <span className="inline-flex items-center gap-2"><Plus className="h-4 w-4" /> Start tracking a quote ({untracked.length}{untracked.length === 12 ? "+" : ""} waiting)</span>
          <span className="text-xs font-normal text-lighter group-open:hidden">Show</span>
        </summary>
        <div className="divide-y divide-border border-t border-border">
          {untracked.length === 0 && <p className="p-6 text-center text-sm text-text">Every quote already has tracking.</p>}
          {untracked.map((u) => (
            <form key={u.id} action={startTracking} className="flex flex-wrap items-center gap-3 px-5 py-3 md:px-8">
              <input type="hidden" name="id" value={u.id} />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-dark">{u.reference} · {u.name}</p>
                <p className="truncate text-xs text-lighter">{u.email} · {day(u.createdAt)}</p>
              </div>
              <SubmitButton pendingText="Starting…" className="inline-flex items-center gap-2 rounded-xl bg-dark px-4 py-2 text-xs font-bold text-white hover:bg-dark/85">
                <Truck className="h-4 w-4" /> Start tracking
              </SubmitButton>
            </form>
          ))}
        </div>
      </details>

      {orders.length === 0 && (
        <p className="rounded-[20px] border border-border bg-white p-8 text-center text-sm text-text">No orders here yet. Start tracking one above.</p>
      )}

      {orders.map((o) => {
        const idx = stageIndex(o.orderStage);
        const next = ORDER_STAGES[idx + 1];
        const last = o.updates[0];
        return (
          <article key={o.id} className="rounded-[20px] border border-border bg-white p-5 shadow-sm md:p-6">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="font-heading text-xl text-dark">{o.reference} · {o.name}</p>
                <p className="truncate text-sm text-text">
                  {o.email}
                  {o.items.length > 0 && ` · ${o.items.map((i) => `${i.productName ?? "Custom"}${i.quantity ? ` × ${i.quantity.toLocaleString()}` : ""}`).join(", ")}`}
                </p>
              </div>
              <Link href={`/adminpanel/quotes/${o.id}`} className="inline-flex items-center gap-1.5 text-xs font-bold text-dark underline">
                Full quote <ExternalLink className="h-3 w-3" />
              </Link>
            </div>

            <ol className="mt-5 grid grid-cols-6 gap-1.5" aria-label="Progress">
              {ORDER_STAGES.map((s, i) => (
                <li key={s.key} className="text-center">
                  <span className={`block h-2 rounded-full ${i <= idx ? "bg-primary" : "bg-border"}`} />
                  <span className={`mt-1.5 block text-[11px] font-semibold leading-tight ${i === idx ? "text-dark" : "text-lighter"}`}>{s.label}</span>
                </li>
              ))}
            </ol>

            <div className="mt-4 flex flex-wrap items-center gap-3">
              {next ? (
                <form action={advanceStage}>
                  <input type="hidden" name="id" value={o.id} />
                  <SubmitButton pendingText="Updating…" className="btn-slip inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs font-bold text-dark">
                    Mark as {next.label} <ArrowRight className="h-4 w-4" />
                  </SubmitButton>
                </form>
              ) : (
                <span className="inline-flex items-center gap-1.5 rounded-xl bg-background-field px-4 py-2.5 text-xs font-bold text-dark"><Check className="h-4 w-4" /> Delivered</span>
              )}
              <span className="text-xs text-text">
                {o.trackingNumber ? `${o.carrier ?? "Carrier"} · ${o.trackingNumber}` : "No tracking number yet"}
                {o.estimatedDelivery && ` · ETA ${day(o.estimatedDelivery)}`}
              </span>
            </div>
            <div className="mt-4 border-t border-border pt-4">
              <p className="mb-2 text-xs font-semibold text-lighter">Share with the customer</p>
              <ShareTracking reference={o.reference} name={o.name} email={o.email} />
            </div>
            {last && <p className="mt-3 text-xs text-lighter">Last update {day(last.createdAt)}: <span className="text-text">{last.message}</span></p>}

            <details className="mt-4 rounded-xl border border-border">
              <summary className="cursor-pointer px-4 py-3 text-sm font-bold text-dark">Edit tracking details &amp; add a note</summary>
              <form action={saveTracking} className="grid gap-3 border-t border-border p-4 md:grid-cols-2">
                <input type="hidden" name="id" value={o.id} />
                <TrackingFields order={o} />
                <SubmitButton pendingText="Saving…" className="btn-slip rounded-xl bg-primary px-5 py-3 text-xs font-bold uppercase tracking-[0.08em] text-dark md:col-span-2">
                  Save changes
                </SubmitButton>
              </form>
            </details>
          </article>
        );
      })}
    </div>
  );
}
