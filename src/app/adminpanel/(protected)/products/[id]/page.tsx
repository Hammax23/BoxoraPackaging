import { revalidatePublicContent } from "@/lib/adminRevalidate";
import { requireAdmin } from "@/lib/adminAuth";
import { prisma } from "@/lib/db";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";
import { notFound } from "next/navigation";
import { revalidatePath } from "next/cache";

export default async function AdminProductEditPage({ params }: { params: { id: string } }) {
  await requireAdmin();
  const product = await prisma.product.findUnique({ where: { id: params.id } });
  if (!product) notFound();

  async function save(formData: FormData) {
    "use server";
    await requireAdmin();
    const id = String(formData.get("id") ?? "");
    const name = String(formData.get("name") ?? "").trim();
    const slug = String(formData.get("slug") ?? "").trim();
    const description = String(formData.get("description") ?? "").trim();
    const imageUrl = String(formData.get("imageUrl") ?? "").trim();
    const category = String(formData.get("category") ?? "").trim();
    const onSale = formData.get("onSale") === "on";
    const hot = formData.get("hot") === "on";
    const isActive = formData.get("isActive") === "on";
    const price = Number(formData.get("price") ?? "");
    const salePrice = Number(formData.get("salePrice") ?? "");

    await prisma.product.update({
      where: { id },
      data: {
        name,
        slug,
        description,
        imageUrl,
        category: category || null,
        onSale,
        hot,
        isActive,
        price: Number.isFinite(price) && price > 0 ? price : null,
        salePrice: Number.isFinite(salePrice) && salePrice > 0 ? salePrice : null,
      },
    });

    revalidatePath("/adminpanel/products");
    revalidatePath(`/adminpanel/products/${id}`);
    revalidatePath(`/products/${slug}`);
    revalidatePublicContent();
  }

  const input =
    "w-full min-h-[48px] rounded-xl border border-border bg-white px-4 py-3 text-[16px] text-dark outline-none transition placeholder:text-lighter focus:border-primary focus:ring-2 focus:ring-primary/15 sm:text-sm";

  return (
    <div className="space-y-6">
      <div className="rounded-[28px] border border-border bg-white p-6 shadow-sm md:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="section-label text-primary">Edit</p>
            <h2 className="mt-4 font-heading text-3xl text-dark md:text-4xl">{product.name}</h2>
            <p className="mt-2 text-sm text-text">Update product content and visibility.</p>
          </div>
          <Link
            href="/adminpanel/products"
            className="inline-flex items-center gap-2 rounded-full border border-border bg-white px-4 py-2.5 text-xs font-bold uppercase tracking-[0.08em] text-text transition hover:border-primary/25 hover:text-primary"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Link>
        </div>
      </div>

      <form action={save} className="rounded-[28px] border border-border bg-white p-6 shadow-sm md:p-8">
        <input type="hidden" name="id" value={product.id} />

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-dark">Name</label>
            <input name="name" defaultValue={product.name} className={input} required />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-dark">Slug</label>
            <input name="slug" defaultValue={product.slug} className={input} required />
          </div>
          <div className="md:col-span-2">
            <label className="mb-1.5 block text-sm font-semibold text-dark">Image URL</label>
            <input name="imageUrl" defaultValue={product.imageUrl} className={input} required />
          </div>
          <div className="md:col-span-2">
            <label className="mb-1.5 block text-sm font-semibold text-dark">Description</label>
            <textarea
              name="description"
              defaultValue={product.description}
              rows={4}
              className={`${input} resize-y`}
              required
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-dark">Category</label>
            <input name="category" defaultValue={product.category ?? ""} className={input} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-dark">Price</label>
              <input name="price" type="number" step="0.01" defaultValue={product.price ?? ""} className={input} />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-dark">Sale price</label>
              <input
                name="salePrice"
                type="number"
                step="0.01"
                defaultValue={product.salePrice ?? ""}
                className={input}
              />
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          {[
            { name: "isActive", label: "Visible on site", defaultChecked: product.isActive },
            { name: "onSale", label: "Sale badge", defaultChecked: product.onSale },
            { name: "hot", label: "Hot badge", defaultChecked: product.hot },
          ].map((f) => (
            <label
              key={f.name}
              className="flex items-center justify-between gap-3 rounded-2xl border border-border bg-background-field/40 px-4 py-4 text-sm font-semibold text-dark"
            >
              <span>{f.label}</span>
              <input name={f.name} type="checkbox" defaultChecked={f.defaultChecked} className="h-5 w-5 accent-primary" />
            </label>
          ))}
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
          <button
            type="submit"
            className="btn-slip inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-4 text-xs font-bold uppercase tracking-[0.08em] text-white shadow-[0_4px_16px_rgba(39,87,255,0.28)] transition hover:bg-primary/90"
          >
            <Save className="h-4 w-4" />
            Save changes
          </button>
        </div>
      </form>
    </div>
  );
}

