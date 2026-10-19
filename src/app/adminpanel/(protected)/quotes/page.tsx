import { requireAdmin } from "@/lib/adminAuth";
import { prisma } from "@/lib/db";
import { logAction } from "@/lib/adminAudit";
import ConfirmButton from "@/components/admin/ConfirmButton";
import SubmitButton from "@/components/admin/SubmitButton";
import { Download, Mail, Search, Trash2 } from "lucide-react";
import { revalidatePath } from "next/cache";
import Link from "next/link";

const input =
  "w-full min-h-[48px] rounded-xl border border-border bg-white px-4 py-3 text-[16px] text-dark outline-none transition placeholder:text-lighter focus:border-primary focus:ring-2 focus:ring-primary/15 sm:text-sm";

const statuses = ["NEW", "IN_REVIEW", "RESPONDED", "CLOSED"] as const;

export const dynamic = "force-dynamic";

export default async function AdminQuotesPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; q?: string }>;
}) {
  await requireAdmin();
  const { status: statusParam, q: qParam } = await searchParams;
  const status = statuses.find((s) => s === statusParam);
  const q = (qParam ?? "").trim();

  const [quotes, grouped] = await Promise.all([
    prisma.quoteRequest.findMany({
      where: {
        ...(status ? { status } : {}),
        ...(q
          ? {
              OR: [
                { name: { contains: q, mode: "insensitive" } },
                { email: { contains: q, mode: "insensitive" } },
                { company: { contains: q, mode: "insensitive" } },
                { reference: { contains: q, mode: "insensitive" } },
              ],
            }
          : {}),
      },
      include: { items: true },
      orderBy: { createdAt: "desc" },
      take: 200,
    }),
    prisma.quoteRequest.groupBy({ by: ["status"], _count: true }),
  ]);
  const counts = Object.fromEntries(grouped.map((g) => [g.status, g._count])) as Record<string, number>;
  const allCount = grouped.reduce((n, g) => n + g._count, 0);

  async function updateStatus(formData: FormData) {
    "use server";
    const admin = await requireAdmin();
    const id = String(formData.get("id") ?? "");
    const next = statuses.find((s) => s === String(formData.get("status"))) ?? "NEW";
    if (!id) return;
    await prisma.quoteRequest.update({ where: { id }, data: { status: next } });
    await logAction(admin.id, "Quote status → " + next, "QuoteRequest", id);
    revalidatePath("/adminpanel", "layout");
  }

  async function deleteQuote(formData: FormData) {
    "use server";
    const admin = await requireAdmin();
    const id = String(formData.get("id") ?? "");
    if (!id) return;
    await prisma.quoteRequest.delete({ where: { id } });
    await logAction(admin.id, "Quote deleted", "QuoteRequest", id);
    revalidatePath("/adminpanel", "layout");
  }

  return (
    <div className="space-y-6">
      <div className="rounded-[28px] border border-border bg-white p-6 shadow-sm md:p-8">
        <p className="section-label text-primary">Leads</p>
        <h2 className="mt-4 font-heading text-3xl text-dark">Quote requests</h2>
        <p className="mt-2 text-sm text-text">{allCount} total requests</p>

        <div className="mt-5 flex flex-wrap items-center gap-2">
          {[{ key: "", label: "All", n: allCount }, ...statuses.map((s) => ({ key: s, label: s.replace("_", " "), n: counts[s] ?? 0 }))].map(
            (t) => (
              <Link
                key={t.key}
                href={`/adminpanel/quotes${t.key ? `?status=${t.key}` : ""}${q ? `${t.key ? "&" : "?"}q=${encodeURIComponent(q)}` : ""}`}
                className={`rounded-full px-4 py-2 text-[12px] font-bold uppercase tracking-wide transition ${
                  (status ?? "") === t.key ? "bg-primary text-white" : "bg-background-field text-text hover:text-primary"
                }`}
              >
                {t.label} <span className="opacity-70">{t.n}</span>
              </Link>
            ),
          )}
          <a
            href="/api/admin/quotes"
            className="ml-auto inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-[12px] font-bold text-dark transition hover:border-primary hover:text-primary"
          >
            <Download className="h-4 w-4" /> Export CSV
          </a>
        </div>

        <form className="relative mt-4" action="/adminpanel/quotes">
          {status && <input type="hidden" name="status" value={status} />}
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-lighter" />
          <input name="q" defaultValue={q} placeholder="Search name, email, company or reference…" className={`${input} pl-11`} />
        </form>
      </div>

      <div className="space-y-4">
        {quotes.map((quote) => {
          const details = (quote.details ?? null) as Record<string, string | null> | null;
          const files = (Array.isArray(quote.attachments) ? quote.attachments : []) as {
            name: string;
            storedName: string;
            size: number;
          }[];
          return (
          <div key={quote.id} className="rounded-[28px] border border-border bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <Link href={`/adminpanel/quotes/${quote.id}`} className="font-heading text-xl text-dark transition hover:text-primary">{quote.name}</Link>
                <p className="mt-1 text-sm text-lighter">
                  {quote.reference} · {quote.email}
                  {quote.phone ? ` · ${quote.phone}` : ""}
                </p>
                {quote.company && <p className="mt-1 text-sm text-text">{quote.company}</p>}
                {quote.notes && <p className="mt-3 text-sm leading-relaxed text-text">{quote.notes}</p>}
                {quote.items.length > 0 && (
                  <ul className="mt-3 space-y-1 text-sm text-text">
                    {quote.items.map((item) => {
                      const d = (item.dimensions ?? {}) as Record<string, number | null>;
                      const size =
                        d.length && d.width && d.height ? ` · ${d.length}×${d.width}×${d.height} in` : "";
                      return (
                        <li key={item.id}>
                          {item.productName ?? item.productSlug ?? "Custom item"}
                          {item.quantity ? ` · qty ${item.quantity.toLocaleString()}` : ""}
                          {size}
                          {item.finishId ? ` · ${item.finishId}` : ""}
                        </li>
                      );
                    })}
                  </ul>
                )}
                {details && (
                  <dl className="mt-3 grid gap-x-6 gap-y-1 text-sm sm:grid-cols-2">
                    {[
                      ["Text on box", details.textOnBox],
                      ["Box type", details.boxType],
                      ["Material", details.material],
                      ["Needed by", details.neededBy],
                      ["Ship to", details.shipTo],
                      ["Type", details.requestType],
                    ]
                      .filter(([, v]) => v)
                      .map(([k, v]) => (
                        <div key={String(k)} className="flex gap-2">
                          <dt className="text-lighter">{k}:</dt>
                          <dd className="font-semibold text-dark">{String(v)}</dd>
                        </div>
                      ))}
                  </dl>
                )}
                {files.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {files.map((f) => (
                      <a
                        key={f.storedName}
                        href={`/api/admin/files/${f.storedName}`}
                        className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background-field px-3 py-1.5 text-[12px] font-semibold text-primary transition hover:border-primary"
                      >
                        ⬇ {f.name} ({Math.max(1, Math.round(f.size / 1024))} KB)
                      </a>
                    ))}
                  </div>
                )}
                <p className="mt-3 text-xs text-lighter">{quote.createdAt.toLocaleString()}</p>
              </div>
              <div className="flex flex-col gap-2">
                <form action={updateStatus} className="flex items-center gap-2">
                  <input type="hidden" name="id" value={quote.id} />
                  <select name="status" defaultValue={quote.status} className={input}>
                    {statuses.map((s) => (
                      <option key={s} value={s}>
                        {s.replace("_", " ")}
                      </option>
                    ))}
                  </select>
                  <SubmitButton pendingText="…" className="btn-slip rounded-xl bg-primary px-4 py-3 text-xs font-bold uppercase tracking-[0.08em] text-white">
                    Update
                  </SubmitButton>
                </form>
                <Link
                  href={`/adminpanel/quotes/${quote.id}`}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-primary/30 bg-primary/5 px-4 py-2.5 text-[12px] font-bold text-primary transition hover:bg-primary hover:text-white"
                >
                  View full details{files.length > 0 ? ` · ${files.length} file${files.length === 1 ? "" : "s"}` : ""}
                </Link>
                <div className="flex items-center gap-2">
                  <a
                    href={`mailto:${quote.email}?subject=${encodeURIComponent(`Your Boxora quote ${quote.reference}`)}`}
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-border px-4 py-2.5 text-[12px] font-bold text-dark transition hover:border-primary hover:text-primary"
                  >
                    <Mail className="h-4 w-4" /> Reply
                  </a>
                  <form action={deleteQuote}>
                    <input type="hidden" name="id" value={quote.id} />
                    <ConfirmButton
                      
                      className="rounded-xl border border-red-200 px-3 py-2.5 text-red-600 transition hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" aria-label="Delete quote" />
                    </ConfirmButton>
                  </form>
                </div>
              </div>
            </div>
          </div>
          );
        })}
        {quotes.length === 0 && (
          <div className="rounded-[28px] border border-dashed border-border bg-white px-4 py-12 text-center text-sm text-lighter">
            No quote requests match.
          </div>
        )}
      </div>
    </div>
  );
}
