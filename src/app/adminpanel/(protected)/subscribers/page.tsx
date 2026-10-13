import { requireAdmin } from "@/lib/adminAuth";
import { prisma } from "@/lib/db";
import { logAction } from "@/lib/adminAudit";
import ConfirmButton from "@/components/admin/ConfirmButton";
import { Search, Trash2 } from "lucide-react";
import { revalidatePath } from "next/cache";

export const dynamic = "force-dynamic";

export default async function AdminSubscribersPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  await requireAdmin();
  const q = ((await searchParams).q ?? "").trim();
  const subs = await prisma.newsletterSubscriber.findMany({
    where: q ? { email: { contains: q, mode: "insensitive" } } : undefined,
    orderBy: { createdAt: "desc" },
    take: 1000,
  });

  async function removeSubscriber(formData: FormData) {
    "use server";
    const admin = await requireAdmin();
    const id = String(formData.get("id") ?? "");
    if (!id) return;
    await prisma.newsletterSubscriber.delete({ where: { id } });
    await logAction(admin.id, "Subscriber removed", "NewsletterSubscriber", id);
    revalidatePath("/adminpanel/subscribers");
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 rounded-[28px] border border-border bg-white p-6 shadow-sm md:flex-row md:items-center md:justify-between md:p-8">
        <div>
          <p className="section-label text-primary">Newsletter</p>
          <h2 className="mt-4 font-heading text-3xl text-dark">Subscribers</h2>
          <p className="mt-2 text-sm text-text">{subs.length} subscribers</p>
        </div>
        <a
          href="/api/admin/subscribers"
          className="btn-slip inline-flex items-center justify-center rounded-xl bg-primary px-5 py-3 text-xs font-bold uppercase tracking-[0.08em] text-white"
        >
          Download CSV
        </a>
      </div>

      <form action="/adminpanel/subscribers" className="relative">
        <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-lighter" />
        <input
          name="q"
          defaultValue={q}
          placeholder="Search by email…"
          className="w-full min-h-[48px] rounded-xl border border-border bg-white py-3 pl-11 pr-4 text-[16px] text-dark outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15 sm:text-sm"
        />
      </form>

      <div className="overflow-x-auto rounded-[28px] border border-border bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-background-field/60 text-[11px] font-bold uppercase tracking-[0.1em] text-lighter">
            <tr>
              <th className="px-5 py-3">Email</th>
              <th className="px-5 py-3">Source</th>
              <th className="px-5 py-3">Joined</th>
              <th className="px-5 py-3"><span className="sr-only">Remove</span></th>
            </tr>
          </thead>
          <tbody>
            {subs.map((s) => (
              <tr key={s.id} className="border-t border-border">
                <td className="px-5 py-3 font-semibold text-dark">{s.email}</td>
                <td className="px-5 py-3 text-text">{s.source ?? "-"}</td>
                <td className="px-5 py-3 text-lighter">{s.createdAt.toLocaleDateString()}</td>
                <td className="px-5 py-3 text-right">
                  <form action={removeSubscriber}>
                    <input type="hidden" name="id" value={s.id} />
                    <ConfirmButton className="rounded-lg p-2 text-red-600 transition hover:bg-red-50">
                      <Trash2 className="h-4 w-4" aria-label={`Remove ${s.email}`} />
                    </ConfirmButton>
                  </form>
                </td>
              </tr>
            ))}
            {subs.length === 0 && (
              <tr>
                <td colSpan={4} className="px-5 py-12 text-center text-lighter">
                  No subscribers yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
