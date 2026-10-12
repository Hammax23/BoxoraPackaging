import { requireAdmin } from "@/lib/adminAuth";
import { prisma } from "@/lib/db";
import { Plus, Trash2 } from "lucide-react";
import { revalidatePath } from "next/cache";

const input =
  "w-full min-h-[48px] rounded-xl border border-border bg-white px-4 py-3 text-[16px] text-dark outline-none transition placeholder:text-lighter focus:border-primary focus:ring-2 focus:ring-primary/15 sm:text-sm";

export default async function AdminMediaPage() {
  await requireAdmin();
  const assets = await prisma.mediaAsset.findMany({ orderBy: { createdAt: "desc" } });

  async function createAsset(formData: FormData) {
    "use server";
    await requireAdmin();
    const url = String(formData.get("url") ?? "").trim();
    const alt = String(formData.get("alt") ?? "").trim();
    if (!url) return;
    await prisma.mediaAsset.create({
      data: { provider: "remote", url, alt: alt || null },
    });
    revalidatePath("/adminpanel/media");
  }

  async function deleteAsset(formData: FormData) {
    "use server";
    await requireAdmin();
    const id = String(formData.get("id") ?? "");
    if (!id) return;
    await prisma.mediaAsset.delete({ where: { id } });
    revalidatePath("/adminpanel/media");
  }

  return (
    <div className="space-y-6">
      <div className="rounded-[28px] border border-border bg-white p-6 shadow-sm md:p-8">
        <p className="section-label text-primary">Library</p>
        <h2 className="mt-4 font-heading text-3xl text-dark">Media assets</h2>
        <p className="mt-2 text-sm text-text">Store image URLs used across products, blog, and homepage content.</p>
      </div>

      <div className="rounded-[28px] border border-border bg-white p-6 shadow-sm md:p-8">
        <form action={createAsset} className="grid gap-3 md:grid-cols-[1fr_1fr_auto]">
          <input name="url" placeholder="Image URL" className={input} required />
          <input name="alt" placeholder="Alt text" className={input} />
          <button type="submit" className="btn-slip inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-xs font-bold uppercase tracking-[0.08em] text-white">
            <Plus className="h-4 w-4" />
            Add
          </button>
        </form>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {assets.map((asset) => (
          <div key={asset.id} className="overflow-hidden rounded-[24px] border border-border bg-white shadow-sm">
            <div className="aspect-video bg-background-field">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={asset.url} alt={asset.alt ?? ""} className="h-full w-full object-cover" />
            </div>
            <div className="flex items-start justify-between gap-3 p-4">
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-dark">{asset.alt || "Untitled"}</p>
                <p className="mt-1 truncate text-xs text-lighter">{asset.url}</p>
              </div>
              <form action={deleteAsset}>
                <input type="hidden" name="id" value={asset.id} />
                <button type="submit" className="text-lighter hover:text-secondary">
                  <Trash2 className="h-4 w-4" />
                </button>
              </form>
            </div>
          </div>
        ))}
        {assets.length === 0 && (
          <p className="col-span-full rounded-[24px] border border-dashed border-border px-4 py-12 text-center text-sm text-lighter">
            No media assets yet.
          </p>
        )}
      </div>
    </div>
  );
}
