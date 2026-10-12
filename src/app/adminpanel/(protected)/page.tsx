import { requireAdmin } from "@/lib/adminAuth";
import { prisma } from "@/lib/db";
import { Activity, FileText, Package, Users } from "lucide-react";

function Card({
  title,
  value,
  hint,
  icon: Icon,
}: {
  title: string;
  value: string;
  hint: string;
  icon: typeof Activity;
}) {
  return (
    <div className="rounded-[28px] border border-border bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-lighter">{title}</p>
          <p className="mt-2 font-heading text-3xl text-dark">{value}</p>
          <p className="mt-2 text-sm text-text">{hint}</p>
        </div>
        <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10">
          <Icon className="h-5 w-5 text-primary" strokeWidth={2} />
        </span>
      </div>
    </div>
  );
}

export default async function AdminDashboard() {
  await requireAdmin();

  const [products, posts, faqs, quotes] = await Promise.all([
    prisma.product.count(),
    prisma.blogPost.count(),
    prisma.faq.count(),
    prisma.quoteRequest.count(),
  ]);

  return (
    <div className="space-y-6 md:space-y-8">
      <div className="rounded-[28px] border border-border bg-white p-6 shadow-sm md:p-8">
        <p className="section-label text-primary">Overview</p>
        <h2 className="mt-4 font-heading text-3xl text-dark md:text-4xl">Website control center</h2>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-text md:text-base">
          Manage your site content, products, blog, and quote requests from one place.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card title="Products" value={products.toLocaleString()} hint="Active catalog items" icon={Package} />
        <Card title="Blog posts" value={posts.toLocaleString()} hint="Articles available on site" icon={FileText} />
        <Card title="FAQs" value={faqs.toLocaleString()} hint="Help content items" icon={Users} />
        <Card title="Quote requests" value={quotes.toLocaleString()} hint="Leads captured so far" icon={Activity} />
      </div>
    </div>
  );
}

