import { revalidatePublicContent } from "@/lib/adminRevalidate";
import { requireAdmin } from "@/lib/adminAuth";
import { prisma } from "@/lib/db";
import Link from "next/link";
import { ArrowUpRight, Plus, Search, Trash2 } from "lucide-react";
import { revalidatePath } from "next/cache";

export default async function AdminProductsPage() {
  await requireAdmin();
  const products = await prisma.product.findMany({ orderBy: { updatedAt: "desc" } });

  async function createProduct(formData: FormData) {
    "use server";
    await requireAdmin();
    const name = String(formData.get("name") ?? "").trim();
    const slug = String(formData.get("slug") ?? "").trim();
    const imageUrl = String(formData.get("imageUrl") ?? "").trim();
    const description = String(formData.get("description") ?? "").trim();
    if (!name || !slug || !imageUrl || !description) return;

    await prisma.product.create({
      data: {
        name,
        slug,
        imageUrl,
        description,
        rating: 0,
        reviews: 0,
        isActive: true,
      },
    });
    revalidatePath("/adminpanel/products");
    revalidatePublicContent();
  }

  async function deleteProduct(formData: FormData) {
    "use server";
    await requireAdmin();
    const id = String(formData.get("id") ?? "");
    if (!id) return;
    await prisma.product.delete({ where: { id } });
    revalidatePath("/adminpanel/products");
    revalidatePublicContent();
  }

  return (
    <div className="space-y-6">
      <div className="rounded-[28px] border border-border bg-white p-6 shadow-sm md:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="section-label text-primary">Catalog</p>
            <h2 className="mt-4 font-heading text-3xl text-dark md:text-4xl">Products</h2>
            <p className="mt-2 text-sm text-text md:text-base">
              Manage your product pages (slug, images, descriptions, badges).
            </p>
          </div>
          <Link
            href="/products"
            className="section-link group w-fit"
            target="_blank"
            rel="noreferrer"
          >
            <span>View site</span>
            <ArrowUpRight className="h-4 w-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>
      </div>

      <div className="rounded-[28px] border border-border bg-white p-6 shadow-sm md:p-8">
        <h3 className="font-heading text-2xl text-dark">Add new product</h3>
        <form action={createProduct} className="mt-5 grid gap-3 md:grid-cols-2">
          <input
            name="name"
            placeholder="Name"
            className="w-full rounded-xl border border-border px-4 py-3 text-[16px] outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 md:text-sm"
            required
          />
          <input
            name="slug"
            placeholder="Slug (e.g. mailer-box)"
            className="w-full rounded-xl border border-border px-4 py-3 text-[16px] outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 md:text-sm"
            required
          />
          <input
            name="imageUrl"
            placeholder="Image URL"
            className="w-full rounded-xl border border-border px-4 py-3 text-[16px] outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 md:col-span-2 md:text-sm"
            required
          />
          <textarea
            name="description"
            placeholder="Description"
            rows={3}
            className="w-full rounded-xl border border-border px-4 py-3 text-[16px] outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 md:col-span-2 md:text-sm"
            required
          />
          <button
            type="submit"
            className="btn-slip inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3.5 text-xs font-bold uppercase tracking-[0.08em] text-white shadow-[0_4px_16px_rgba(39,87,255,0.28)] transition hover:bg-primary/90 md:col-span-2"
          >
            <Plus className="h-4 w-4" />
            Create product
          </button>
        </form>
      </div>

      <div className="rounded-[28px] border border-border bg-white p-6 shadow-sm md:p-8">
        <div className="flex items-center justify-between gap-4">
          <h3 className="font-heading text-2xl text-dark">All products</h3>
          <div className="flex items-center gap-2 rounded-full border border-border bg-white px-3 py-2 text-sm text-lighter">
            <Search className="h-4 w-4" />
            <span>{products.length} items</span>
          </div>
        </div>

        <div className="mt-5 overflow-hidden rounded-2xl border border-border">
          <div className="grid grid-cols-[1.3fr_1fr_0.5fr] gap-3 bg-background-field/40 px-4 py-3 text-[11px] font-bold uppercase tracking-[0.1em] text-lighter">
            <div>Product</div>
            <div>Slug</div>
            <div className="text-right">Actions</div>
          </div>
          <div className="divide-y divide-border">
            {products.map((p) => (
              <div
                key={p.id}
                className="grid grid-cols-[1.3fr_1fr_0.5fr] items-center gap-3 px-4 py-4"
              >
                <div className="min-w-0">
                  <p className="truncate font-semibold text-dark">{p.name}</p>
                  <p className="mt-1 line-clamp-1 text-sm text-lighter">{p.description}</p>
                </div>
                <div className="min-w-0">
                  <p className="truncate font-mono text-sm text-text">{p.slug}</p>
                </div>
                <div className="flex items-center justify-end gap-2">
                  <Link
                    href={`/adminpanel/products/${p.id}`}
                    className="rounded-full border border-border bg-white px-3 py-2 text-xs font-bold uppercase tracking-[0.08em] text-text transition hover:border-primary/25 hover:text-primary"
                  >
                    Edit
                  </Link>
                  <form action={deleteProduct}>
                    <input type="hidden" name="id" value={p.id} />
                    <button
                      type="submit"
                      className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-white text-text transition hover:border-secondary/30 hover:bg-secondary/10 hover:text-secondary"
                      aria-label="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </form>
                </div>
              </div>
            ))}
            {products.length === 0 && (
              <div className="px-4 py-10 text-center text-sm text-lighter">
                No products yet. Create your first product above.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

