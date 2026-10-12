import { requireAdmin } from "@/lib/adminAuth";
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

const input =
  "w-full min-h-[48px] rounded-xl border border-border bg-white px-4 py-3 text-[16px] text-dark outline-none transition placeholder:text-lighter focus:border-primary focus:ring-2 focus:ring-primary/15 sm:text-sm";

const statuses = ["NEW", "IN_REVIEW", "RESPONDED", "CLOSED"] as const;

export default async function AdminQuotesPage() {
  await requireAdmin();
  const quotes = await prisma.quoteRequest.findMany({
    include: { items: true },
    orderBy: { createdAt: "desc" },
  });

  async function updateStatus(formData: FormData) {
    "use server";
    await requireAdmin();
    const id = String(formData.get("id") ?? "");
    const status = String(formData.get("status") ?? "NEW") as (typeof statuses)[number];
    if (!id) return;
    await prisma.quoteRequest.update({ where: { id }, data: { status } });
    revalidatePath("/adminpanel/quotes");
  }

  return (
    <div className="space-y-6">
      <div className="rounded-[28px] border border-border bg-white p-6 shadow-sm md:p-8">
        <p className="section-label text-primary">Leads</p>
        <h2 className="mt-4 font-heading text-3xl text-dark">Quote requests</h2>
        <p className="mt-2 text-sm text-text">{quotes.length} total requests</p>
      </div>

      <div className="space-y-4">
        {quotes.map((quote) => (
          <div key={quote.id} className="rounded-[28px] border border-border bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <p className="font-heading text-xl text-dark">{quote.name}</p>
                <p className="mt-1 text-sm text-lighter">
                  {quote.reference} · {quote.email}
                  {quote.phone ? ` · ${quote.phone}` : ""}
                </p>
                {quote.company && <p className="mt-1 text-sm text-text">{quote.company}</p>}
                {quote.notes && <p className="mt-3 text-sm leading-relaxed text-text">{quote.notes}</p>}
                {quote.items.length > 0 && (
                  <ul className="mt-3 space-y-1 text-sm text-text">
                    {quote.items.map((item) => (
                      <li key={item.id}>
                        {item.productName ?? item.productSlug ?? "Custom item"}
                        {item.quantity ? ` · qty ${item.quantity}` : ""}
                      </li>
                    ))}
                  </ul>
                )}
                <p className="mt-3 text-xs text-lighter">{quote.createdAt.toLocaleString()}</p>
              </div>
              <form action={updateStatus} className="flex items-center gap-2">
                <input type="hidden" name="id" value={quote.id} />
                <select name="status" defaultValue={quote.status} className={input}>
                  {statuses.map((s) => (
                    <option key={s} value={s}>
                      {s.replace("_", " ")}
                    </option>
                  ))}
                </select>
                <button type="submit" className="btn-slip rounded-xl bg-primary px-4 py-3 text-xs font-bold uppercase tracking-[0.08em] text-white">
                  Update
                </button>
              </form>
            </div>
          </div>
        ))}
        {quotes.length === 0 && (
          <div className="rounded-[28px] border border-dashed border-border bg-white px-4 py-12 text-center text-sm text-lighter">
            No quote requests yet.
          </div>
        )}
      </div>
    </div>
  );
}
