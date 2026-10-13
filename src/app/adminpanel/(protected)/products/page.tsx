import { revalidatePublicContent } from "@/lib/adminRevalidate";
import { requireAdmin } from "@/lib/adminAuth";
import { prisma } from "@/lib/db";
import Link from "next/link";
import { ArrowUpRight, Plus, Search, Trash2 } from "lucide-react";
import { revalidatePath } from "next/cache";
import ImageField from "@/components/admin/ImageField";
import ConfirmButton from "@/components/admin/ConfirmButton";
import SubmitButton from "@/components/admin/SubmitButton";
import { logAction } from "@/lib/adminAudit";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  await requireAdmin();
  const q = ((await searchParams).q ?? "").trim();
  const products = await prisma.product.findMany({
    where: q
      ? { OR: [{ name: { contains: q, mode: "insensitive" } }, { slug: { contains: q, mode: "insensitive" } }] }
      : undefined,
    orderBy: { updatedAt: "desc" },
  });

  async function toggleActive(formData: FormData) {
    "use server";
    const admin = await requireAdmin();
    const id = String(formData.get("id") ?? "");
    const isActive = formData.get("isActive") === "true";
    if (!id) return;
    await prisma.product.update({ where: { id }, data: { isActive } });
    await logAction(admin.id, isActive ? "Product shown" : "Product hidden", "Product", id);
    revalidatePath("/adminpanel/products");
    revalidatePublicContent();
  }

  async function createProduct(formData: FormData) {
    "use server";
    const admin = await requireAdmin();
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
    await logAction(admin.id, "Product created", "Product", slug);
    revalidatePath("/adminpanel/products");
    revalidatePublicContent();
  }

  async function deleteProduct(formData: FormData) {
    "use server";
    const admin = await requireAdmin();
    const id = String(formData.get("id") ?? "");
    if (!id) return;
    await prisma.product.delete({ where: { id } });
    await logAction(admin.id, "Product deleted", "Product", id);
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
          <div className="md:col-span-2">
            <ImageField name="imageUrl" required />
          </div>
          <textarea
            name="description"
            placeholder="Description"
            rows={3}
            className="w-full rounded-xl border border-border px-4 py-3 text-[16px] outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 md:col-span-2 md:text-sm"
            required
          />
          <SubmitButton
            pendingText="Creating…"
            className="btn-slip rounded-xl bg-primary px-5 py-3.5 text-xs font-bold uppercase tracking-[0.08em] text-white shadow-[0_4px_16px_rgba(39,87,255,0.28)] md:col-span-2"
          >
            <Plus className="h-4 w-4" />
            Create product
          </SubmitButton>
        </form>
      </div>

      <div className="rounded-[28px] border border-border bg-white p-6 shadow-sm md:p-8">
        <div className="flex items-center justify-between gap-4">
          <h3 className="font-heading text-2xl text-dark">All products</h3>
          <form action="/adminpanel/products" className="flex items-center gap-2 rounded-full border border-border bg-white px-3 py-2 text-sm text-lighter">
            <Search className="h-4 w-4" />
            <input name="q" defaultValue={q} placeholder={`Search ${products.length} items`} className="w-40 bg-transparent text-dark outline-none placeholder:text-lighter sm:w-56" />
          </form>
        </div>

        <div className="mt-5 overflow-hidden rounded-2xl border border-border">
          <div className="hidden grid-cols-[1.3fr_0.9fr_0.9fr] gap-3 bg-background-field/40 sm:grid px-4 py-3 text-[11px] font-bold uppercase tracking-[0.1em] text-lighter">
            <div>Product</div>
            <div>Slug</div>
            <div className="text-right">Actions</div>
          </div>
          <div className="divide-y divide-border">
            {products.map((p) => (
              <div
                key={p.id}
                className="grid grid-cols-1 items-center gap-3 px-4 py-4 sm:grid-cols-[1.3fr_0.9fr_0.9fr]"
              >
                <div className="flex min-w-0 items-center gap-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={p.imageUrl} alt="" className="h-12 w-12 shrink-0 rounded-xl bg-background-field object-cover" />
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-dark">
                      {p.name}
                      {!p.isActive && (
                        <span className="ml-2 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold uppercase text-amber-800">Hidden</span>
                      )}
                    </p>
                    <p className="mt-1 line-clamp-1 text-sm text-lighter">{p.description}</p>
                  </div>
                </div>
                <div className="min-w-0">
                  <p className="truncate font-mono text-xs text-text sm:text-sm">/{p.slug}</p>
                </div>
                <div className="flex flex-wrap items-center gap-2 sm:justify-end">
                  <form action={toggleActive}>
                    <input type="hidden" name="id" value={p.id} />
                    <input type="hidden" name="isActive" value={String(!p.isActive)} />
                    <SubmitButton
                      pendingText="…"
                      className="rounded-full border border-border bg-white px-3 py-2 text-xs font-bold uppercase tracking-[0.08em] text-text transition hover:border-primary/25 hover:text-primary"
                    >
                      {p.isActive ? "Hide" : "Show"}
                    </SubmitButton>
                  </form>
                  <Link
                    href={`/adminpanel/products/${p.id}`}
                    className="rounded-full border border-border bg-white px-3 py-2 text-xs font-bold uppercase tracking-[0.08em] text-text transition hover:border-primary/25 hover:text-primary"
                  >
                    Edit
                  </Link>
                  <form action={deleteProduct}>
                    <input type="hidden" name="id" value={p.id} />
                    <ConfirmButton
                      
                      className="h-10 w-10 rounded-full border border-border bg-white text-text transition hover:border-secondary/30 hover:bg-secondary/10 hover:text-secondary"
                    >
                      <Trash2 className="h-4 w-4" aria-label="Delete" />
                    </ConfirmButton>
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

