import ImageField from "@/components/admin/ImageField";
import { requireAdmin } from "@/lib/adminAuth";
import { revalidatePublicContent } from "@/lib/adminRevalidate";
import { prisma } from "@/lib/db";
import { staticIndustries } from "@/lib/queries/industries";
import { slugify } from "@/lib/slug";
import { ArrowDown, ArrowUp, ArrowUpRight, Download, Plus, Save, Trash2 } from "lucide-react";
import { revalidatePath } from "next/cache";
import Link from "next/link";

const input =
  "w-full min-h-[48px] rounded-xl border border-border bg-white px-4 py-3 text-[16px] text-dark outline-none transition placeholder:text-lighter focus:border-primary focus:ring-2 focus:ring-primary/15 sm:text-sm";

const iconButton =
  "inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-white text-text transition hover:border-primary/25 hover:text-primary disabled:cursor-not-allowed disabled:opacity-40";

async function uniqueSlug(base: string, excludeId?: string) {
  const root = base || "industry";
  let slug = root;
  for (let i = 2; ; i++) {
    const taken = await prisma.industry.findFirst({
      where: { slug, ...(excludeId ? { id: { not: excludeId } } : {}) },
      select: { id: true },
    });
    if (!taken) return slug;
    slug = `${root}-${i}`;
  }
}

function refresh() {
  revalidatePath("/adminpanel/industries");
  revalidatePath("/category/[slug]", "page");
  revalidatePublicContent();
}

export default async function AdminIndustriesPage() {
  await requireAdmin();

  const industries = await prisma.industry.findMany({ orderBy: { sortOrder: "asc" } });

  async function createIndustry(formData: FormData) {
    "use server";
    await requireAdmin();
    const name = String(formData.get("name") ?? "").trim();
    const subtitle = String(formData.get("subtitle") ?? "").trim();
    const imageUrl = String(formData.get("imageUrl") ?? "").trim();
    const slugInput = String(formData.get("slug") ?? "").trim();
    if (!name || !imageUrl) return;

    const last = await prisma.industry.findFirst({ orderBy: { sortOrder: "desc" } });
    await prisma.industry.create({
      data: {
        name,
        subtitle,
        imageUrl,
        slug: await uniqueSlug(slugify(slugInput || name)),
        sortOrder: (last?.sortOrder ?? -1) + 1,
        isActive: true,
      },
    });
    refresh();
  }

  async function updateIndustry(formData: FormData) {
    "use server";
    await requireAdmin();
    const id = String(formData.get("id") ?? "");
    const name = String(formData.get("name") ?? "").trim();
    const subtitle = String(formData.get("subtitle") ?? "").trim();
    const imageUrl = String(formData.get("imageUrl") ?? "").trim();
    const slugInput = String(formData.get("slug") ?? "").trim();
    const isActive = formData.get("isActive") === "on";
    if (!id || !name || !imageUrl) return;

    await prisma.industry.update({
      where: { id },
      data: {
        name,
        subtitle,
        imageUrl,
        isActive,
        slug: await uniqueSlug(slugify(slugInput || name), id),
      },
    });
    refresh();
  }

  async function moveIndustry(direction: "up" | "down", formData: FormData) {
    "use server";
    await requireAdmin();
    const id = String(formData.get("id") ?? "");
    const rows = await prisma.industry.findMany({ orderBy: { sortOrder: "asc" } });
    const index = rows.findIndex((r) => r.id === id);
    const swapWith = direction === "up" ? index - 1 : index + 1;
    if (index < 0 || swapWith < 0 || swapWith >= rows.length) return;

    // Re-number everything so legacy duplicate sortOrders can't block a swap
    const ordered = [...rows];
    [ordered[index], ordered[swapWith]] = [ordered[swapWith], ordered[index]];
    await prisma.$transaction(
      ordered.map((r, i) => prisma.industry.update({ where: { id: r.id }, data: { sortOrder: i } })),
    );
    refresh();
  }

  async function deleteIndustry(formData: FormData) {
    "use server";
    await requireAdmin();
    const id = String(formData.get("id") ?? "");
    if (!id) return;
    await prisma.industry.delete({ where: { id } });
    refresh();
  }

  async function importDefaults() {
    "use server";
    await requireAdmin();
    if ((await prisma.industry.count()) > 0) return;
    await prisma.industry.createMany({
      data: staticIndustries().map((c, i) => ({
        slug: c.slug,
        name: c.name,
        subtitle: c.sub,
        imageUrl: c.image,
        sortOrder: i,
        isActive: true,
      })),
      skipDuplicates: true,
    });
    refresh();
  }

  return (
    <div className="space-y-6">
      <div className="rounded-[28px] border border-border bg-white p-6 shadow-sm md:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="section-label text-primary">Header</p>
            <h2 className="mt-4 font-heading text-3xl text-dark md:text-4xl">Industries</h2>
            <p className="mt-2 text-sm text-text md:text-base">
              Items shown in the Industries megamenu. Each one links to <span className="font-mono">/category/&lt;slug&gt;</span>.
            </p>
          </div>
          <Link href="/" className="section-link group w-fit" target="_blank" rel="noreferrer">
            <span>View site</span>
            <ArrowUpRight className="h-4 w-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>
      </div>

      {industries.length === 0 && (
        <div className="rounded-[28px] border border-primary/25 bg-primary/[0.04] p-6 md:p-8">
          <h3 className="font-heading text-2xl text-dark">No industries in the database yet</h3>
          <p className="mt-2 text-sm text-text">
            The website is currently showing the {staticIndustries().length} built-in default industries. Import them
            first so you can edit, reorder, or delete them — otherwise adding a new item will replace the whole list.
          </p>
          <form action={importDefaults} className="mt-4">
            <button
              type="submit"
              className="btn-slip inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-xs font-bold uppercase tracking-[0.08em] text-white"
            >
              <Download className="h-4 w-4" />
              Import default industries
            </button>
          </form>
        </div>
      )}

      <div className="rounded-[28px] border border-border bg-white p-6 shadow-sm md:p-8">
        <h3 className="font-heading text-2xl text-dark">Add new industry</h3>
        <form action={createIndustry} className="mt-5 grid gap-3 md:grid-cols-2">
          <input name="name" placeholder="Name (e.g. Candle Packaging)" className={input} required />
          <input name="subtitle" placeholder="Subtitle (e.g. Luxury rigid candle boxes)" className={input} />
          <ImageField name="imageUrl" required />
          <input name="slug" placeholder="Slug (optional — generated from name)" className={input} />
          <button
            type="submit"
            className="btn-slip inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3.5 text-xs font-bold uppercase tracking-[0.08em] text-white shadow-[0_4px_16px_rgba(39,87,255,0.28)] transition hover:bg-primary/90 md:col-span-2"
          >
            <Plus className="h-4 w-4" />
            Add industry
          </button>
        </form>
      </div>

      <div className="rounded-[28px] border border-border bg-white p-6 shadow-sm md:p-8">
        <div className="flex items-center justify-between gap-4">
          <h3 className="font-heading text-2xl text-dark">All industries</h3>
          <span className="rounded-full border border-border px-3 py-2 text-sm text-lighter">
            {industries.length} items
          </span>
        </div>

        <div className="mt-5 space-y-4">
          {industries.map((item, index) => (
            <form
              key={item.id}
              action={updateIndustry}
              className={`grid gap-3 rounded-2xl border border-border p-4 md:grid-cols-[64px_1fr_auto] md:items-start ${
                item.isActive ? "" : "bg-background-field/40 opacity-70"
              }`}
            >
              <input type="hidden" name="id" value={item.id} />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={item.imageUrl} alt={item.name} className="h-16 w-16 rounded-2xl object-cover" />

              <div className="grid gap-3 md:grid-cols-2">
                <input name="name" defaultValue={item.name} placeholder="Name" className={input} required />
                <input name="subtitle" defaultValue={item.subtitle} placeholder="Subtitle" className={input} />
                <ImageField name="imageUrl" defaultValue={item.imageUrl} required />
                <input name="slug" defaultValue={item.slug} placeholder="Slug" className={`${input} font-mono`} />
                <label className="flex items-center gap-2 text-sm font-semibold text-text">
                  <input type="checkbox" name="isActive" defaultChecked={item.isActive} className="h-4 w-4" />
                  Show on website
                </label>
              </div>

              <div className="flex items-center gap-2 md:flex-col md:items-end">
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 rounded-full border border-border bg-white px-4 py-2.5 text-xs font-bold uppercase tracking-[0.08em] text-text transition hover:border-primary/25 hover:text-primary"
                >
                  <Save className="h-4 w-4" />
                  Save
                </button>
                <div className="flex gap-2">
                  <button
                    type="submit"
                    formAction={moveIndustry.bind(null, "up")}
                    formNoValidate
                    disabled={index === 0}
                    className={iconButton}
                    aria-label="Move up"
                  >
                    <ArrowUp className="h-4 w-4" />
                  </button>
                  <button
                    type="submit"
                    formAction={moveIndustry.bind(null, "down")}
                    formNoValidate
                    disabled={index === industries.length - 1}
                    className={iconButton}
                    aria-label="Move down"
                  >
                    <ArrowDown className="h-4 w-4" />
                  </button>
                  <button
                    type="submit"
                    formAction={deleteIndustry}
                    formNoValidate
                    className={`${iconButton} hover:border-secondary/30 hover:bg-secondary/10 hover:text-secondary`}
                    aria-label="Delete"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </form>
          ))}
          {industries.length === 0 && (
            <p className="rounded-2xl border border-border px-4 py-10 text-center text-sm text-lighter">
              No industries yet.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
