import ConfirmButton from "@/components/admin/ConfirmButton";
import SubmitButton from "@/components/admin/SubmitButton";
import { logAction } from "@/lib/adminAudit";
import { requireAdmin } from "@/lib/adminAuth";
import { prisma } from "@/lib/db";
import { ArrowLeft, Download, FileText, Mail, Phone, Trash2 } from "lucide-react";
import { revalidatePath } from "next/cache";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

export const dynamic = "force-dynamic";

const statuses = ["NEW", "IN_REVIEW", "RESPONDED", "CLOSED"] as const;
const badge: Record<string, string> = {
  NEW: "bg-primary/10 text-primary",
  IN_REVIEW: "bg-amber-100 text-amber-800",
  RESPONDED: "bg-emerald-100 text-emerald-800",
  CLOSED: "bg-slate-100 text-slate-600",
};
const input =
  "w-full min-h-[44px] rounded-xl border border-border bg-white px-4 py-2.5 text-[16px] text-dark outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15 sm:text-sm";

type Attachment = { name: string; storedName: string; size: number; type?: string };

const when = (d: Date) => d.toLocaleString("en-US", { dateStyle: "long", timeStyle: "short" });
const kb = (n: number) => (n >= 1048576 ? `${(n / 1048576).toFixed(1)} MB` : `${Math.max(1, Math.round(n / 1024))} KB`);
const label = (k: string) =>
  k.replace(/([A-Z])/g, " $1").replace(/^./, (c) => c.toUpperCase()).replace(/_/g, " ");

function Row({ k, v }: { k: string; v?: React.ReactNode }) {
  if (v === null || v === undefined || v === "") return null;
  return (
    <div className="grid grid-cols-[140px_1fr] gap-3 border-t border-border py-3 text-sm first:border-t-0 first:pt-0">
      <dt className="text-lighter">{k}</dt>
      <dd className="min-w-0 break-words font-semibold text-dark">{v}</dd>
    </div>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-[24px] border border-border bg-white p-6 shadow-sm">
      <h3 className="font-heading text-xl text-dark">{title}</h3>
      <dl className="mt-4">{children}</dl>
    </section>
  );
}

export default async function QuoteDetailPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { id } = await params;
  const quote = await prisma.quoteRequest.findUnique({ where: { id }, include: { items: true } });
  if (!quote) notFound();

  async function updateStatus(formData: FormData) {
    "use server";
    const admin = await requireAdmin();
    const next = statuses.find((s) => s === String(formData.get("status"))) ?? "NEW";
    await prisma.quoteRequest.update({ where: { id }, data: { status: next } });
    await logAction(admin.id, "Quote status → " + next, "QuoteRequest", id);
    revalidatePath("/adminpanel", "layout");
  }

  async function deleteQuote() {
    "use server";
    const admin = await requireAdmin();
    await prisma.quoteRequest.delete({ where: { id } });
    await logAction(admin.id, "Quote deleted", "QuoteRequest", id);
    revalidatePath("/adminpanel", "layout");
    redirect("/adminpanel/quotes");
  }

  const details = (quote.details ?? {}) as Record<string, string | null>;
  const files = (Array.isArray(quote.attachments) ? quote.attachments : []) as Attachment[];
  const images = files.filter((f) => /\.(png|jpe?g)$/i.test(f.storedName));
  const others = files.filter((f) => !images.includes(f));
  const known = ["textOnBox", "boxType", "material", "color", "finish", "neededBy", "shipTo", "requestType", "moq", "risk"];
  const extra = Object.entries(details).filter(([k, v]) => !known.includes(k) && v);

  return (
    <div className="space-y-6">
      <Link href="/adminpanel/quotes" className="inline-flex items-center gap-2 text-sm font-semibold text-primary">
        <ArrowLeft className="h-4 w-4" /> All quote requests
      </Link>

      <div className="rounded-[28px] border border-border bg-white p-6 shadow-sm md:p-8">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="font-heading text-3xl text-dark">{quote.name}</h2>
              <span className={`rounded-full px-3 py-1 text-[11px] font-bold uppercase ${badge[quote.status]}`}>
                {quote.status.replace("_", " ")}
              </span>
            </div>
            <p className="mt-2 text-sm text-text">
              {quote.reference} · received {when(quote.createdAt)}
            </p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <form action={updateStatus} className="flex items-center gap-2">
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
            <a
              href={`mailto:${quote.email}?subject=${encodeURIComponent(`Your Boxora quote ${quote.reference}`)}`}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-border px-4 py-3 text-[12px] font-bold text-dark transition hover:border-primary hover:text-primary"
            >
              <Mail className="h-4 w-4" /> Reply
            </a>
            <form action={deleteQuote}>
              <ConfirmButton
                message="Delete this quote request and its files list? This cannot be undone."
                label="Delete quote"
                className="rounded-xl border border-red-200 px-3 py-3 text-red-600 transition hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4" />
              </ConfirmButton>
            </form>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card title="Customer">
          <Row k="Name" v={quote.name} />
          <Row k="Email" v={<a className="text-primary hover:underline" href={`mailto:${quote.email}`}>{quote.email}</a>} />
          <Row
            k="Phone"
            v={
              quote.phone ? (
                <a className="inline-flex items-center gap-1.5 text-primary hover:underline" href={`tel:${quote.phone.replace(/\s/g, "")}`}>
                  <Phone className="h-3.5 w-3.5" /> {quote.phone}
                </a>
              ) : null
            }
          />
          <Row k="Company" v={quote.company} />
          <Row k="Ship to" v={details.shipTo} />
          <Row k="Needed by" v={details.neededBy} />
        </Card>

        <Card title="Request">
          <Row k="Request type" v={details.requestType === "order" ? "Product order" : "Quote"} />
          <Row k="Source" v={quote.source} />
          <Row k="Text on box" v={details.textOnBox ? `“${details.textOnBox}”` : null} />
          <Row k="Box type" v={details.boxType} />
          <Row k="Material" v={details.material} />
          <Row k="Finish" v={details.finish} />
          <Row k="Colour" v={details.color} />
          <Row k="Min. order (est.)" v={details.moq ? `${Number(details.moq).toLocaleString()} pcs` : null} />
          <Row k="Shipping risk (est.)" v={details.risk} />
          {extra.map(([k, v]) => (
            <Row key={k} k={label(k)} v={String(v)} />
          ))}
        </Card>
      </div>

      {quote.items.map((item, i) => {
        const d = (item.dimensions ?? {}) as Record<string, number | null>;
        const size = d.length && d.width && d.height ? `${d.length} × ${d.width} × ${d.height} in` : null;
        return (
          <Card key={item.id} title={quote.items.length > 1 ? `Product ${i + 1}` : "Product"}>
            <Row k="Product / industry" v={item.productName ?? item.productSlug} />
            <Row k="Industry line" v={item.industry} />
            <Row k="Quantity" v={item.quantity ? `${item.quantity.toLocaleString()} pcs` : null} />
            <Row k="Size (L × W × H)" v={size} />
            <Row k="Weight" v={d.weight ? `${d.weight} kg` : null} />
            <Row k="Finish" v={item.finishId} />
          </Card>
        );
      })}

      <Card title="Customer message">
        {quote.notes ? (
          <p className="whitespace-pre-wrap text-sm leading-relaxed text-text">{quote.notes}</p>
        ) : (
          <p className="text-sm text-lighter">No message was written.</p>
        )}
      </Card>

      <section className="rounded-[24px] border border-border bg-white p-6 shadow-sm">
        <h3 className="font-heading text-xl text-dark">Uploaded designs ({files.length})</h3>
        {files.length === 0 ? (
          <p className="mt-4 text-sm text-lighter">The customer did not upload any files.</p>
        ) : (
          <>
            {images.length > 0 && (
              <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {images.map((f) => (
                  <div key={f.storedName} className="overflow-hidden rounded-2xl border border-border">
                    <a href={`/api/admin/files/${f.storedName}?inline=1`} target="_blank" rel="noreferrer" className="block bg-background-field">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={`/api/admin/files/${f.storedName}?inline=1`} alt={f.name} className="h-56 w-full object-contain" />
                    </a>
                    <div className="flex items-center justify-between gap-2 p-3 text-xs">
                      <span className="min-w-0 truncate font-semibold text-dark" title={f.name}>
                        {f.name} <span className="font-normal text-lighter">· {kb(f.size)}</span>
                      </span>
                      <a href={`/api/admin/files/${f.storedName}`} className="inline-flex shrink-0 items-center gap-1 font-bold text-primary">
                        <Download className="h-3.5 w-3.5" /> Download
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {others.length > 0 && (
              <ul className="mt-4 divide-y divide-border rounded-2xl border border-border">
                {others.map((f) => (
                  <li key={f.storedName} className="flex items-center justify-between gap-3 px-4 py-3 text-sm">
                    <span className="flex min-w-0 items-center gap-2">
                      <FileText className="h-5 w-5 shrink-0 text-primary" />
                      <span className="truncate font-semibold text-dark">{f.name}</span>
                      <span className="shrink-0 text-xs text-lighter">{kb(f.size)}</span>
                    </span>
                    <a href={`/api/admin/files/${f.storedName}`} className="inline-flex shrink-0 items-center gap-1 font-bold text-primary">
                      <Download className="h-4 w-4" /> Download
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
      </section>

      <p className="text-center text-xs text-lighter">
        Received {when(quote.createdAt)} · last updated {when(quote.updatedAt)}
      </p>
    </div>
  );
}
