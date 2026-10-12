import { requireAdmin } from "@/lib/adminAuth";
import { revalidatePublicContent } from "@/lib/adminRevalidate";
import { prisma } from "@/lib/db";
import { Plus, Trash2 } from "lucide-react";
import { revalidatePath } from "next/cache";

const input =
  "w-full min-h-[48px] rounded-xl border border-border bg-white px-4 py-3 text-[16px] text-dark outline-none transition placeholder:text-lighter focus:border-primary focus:ring-2 focus:ring-primary/15 sm:text-sm";

export default async function AdminNavigationPage() {
  await requireAdmin();

  const [navItems, footerGroups] = await Promise.all([
    prisma.navigationItem.findMany({
      where: { parentId: null },
      include: { children: { orderBy: { sortOrder: "asc" } } },
      orderBy: [{ area: "asc" }, { sortOrder: "asc" }],
    }),
    prisma.footerLinkGroup.findMany({
      include: { links: { orderBy: { sortOrder: "asc" } } },
      orderBy: { sortOrder: "asc" },
    }),
  ]);

  async function createNav(formData: FormData) {
    "use server";
    await requireAdmin();
    const area = String(formData.get("area") ?? "left");
    const label = String(formData.get("label") ?? "").trim();
    const href = String(formData.get("href") ?? "").trim();
    const megamenu = String(formData.get("megamenu") ?? "").trim() || null;
    if (!label || !href) return;
    const count = await prisma.navigationItem.count({ where: { area, parentId: null } });
    await prisma.navigationItem.create({
      data: { area, label, href, megamenu, sortOrder: count, isActive: true },
    });
    revalidatePath("/adminpanel/navigation");
    revalidatePublicContent();
  }

  async function deleteNav(formData: FormData) {
    "use server";
    await requireAdmin();
    const id = String(formData.get("id") ?? "");
    if (!id) return;
    await prisma.navigationItem.delete({ where: { id } });
    revalidatePath("/adminpanel/navigation");
    revalidatePublicContent();
  }

  async function createFooterLink(formData: FormData) {
    "use server";
    await requireAdmin();
    const groupId = String(formData.get("groupId") ?? "");
    const label = String(formData.get("label") ?? "").trim();
    const href = String(formData.get("href") ?? "").trim();
    if (!groupId || !label || !href) return;
    const count = await prisma.footerLink.count({ where: { groupId } });
    await prisma.footerLink.create({ data: { groupId, label, href, sortOrder: count } });
    revalidatePath("/adminpanel/navigation");
    revalidatePublicContent();
  }

  async function deleteFooterLink(formData: FormData) {
    "use server";
    await requireAdmin();
    const id = String(formData.get("id") ?? "");
    if (!id) return;
    await prisma.footerLink.delete({ where: { id } });
    revalidatePath("/adminpanel/navigation");
    revalidatePublicContent();
  }

  return (
    <div className="space-y-6">
      <div className="rounded-[28px] border border-border bg-white p-6 shadow-sm md:p-8">
        <p className="section-label text-primary">Structure</p>
        <h2 className="mt-4 font-heading text-3xl text-dark">Navigation & footer</h2>
      </div>

      <div className="rounded-[28px] border border-border bg-white p-6 shadow-sm md:p-8">
        <h3 className="font-heading text-2xl text-dark">Add nav item</h3>
        <form action={createNav} className="mt-4 grid gap-3 md:grid-cols-2">
          <select name="area" className={input}>
            <option value="left">Left nav</option>
            <option value="right">Right nav</option>
          </select>
          <select name="megamenu" className={input}>
            <option value="">No megamenu</option>
            <option value="industries">Industries</option>
            <option value="packaging-styles">Packaging styles</option>
            <option value="trends">Trends</option>
          </select>
          <input name="label" placeholder="Label" className={input} required />
          <input name="href" placeholder="Href" className={input} required />
          <button type="submit" className="btn-slip inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-xs font-bold uppercase tracking-[0.08em] text-white md:col-span-2">
            <Plus className="h-4 w-4" />
            Add nav item
          </button>
        </form>

        <div className="mt-6 divide-y divide-border rounded-2xl border border-border">
          {navItems.map((item) => (
            <div key={item.id} className="flex items-center justify-between gap-4 px-4 py-4">
              <div>
                <p className="font-semibold text-dark">
                  [{item.area}] {item.label}
                </p>
                <p className="text-sm text-lighter">
                  {item.href}
                  {item.megamenu ? ` · ${item.megamenu}` : ""}
                </p>
              </div>
              <form action={deleteNav}>
                <input type="hidden" name="id" value={item.id} />
                <button type="submit" className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border text-text hover:text-secondary">
                  <Trash2 className="h-4 w-4" />
                </button>
              </form>
            </div>
          ))}
          {navItems.length === 0 && <p className="px-4 py-8 text-center text-sm text-lighter">No nav items yet.</p>}
        </div>
      </div>

      {footerGroups.map((group) => (
        <div key={group.id} className="rounded-[28px] border border-border bg-white p-6 shadow-sm md:p-8">
          <h3 className="font-heading text-2xl text-dark">{group.title} links</h3>
          <form action={createFooterLink} className="mt-4 grid gap-3 md:grid-cols-[1fr_1fr_auto]">
            <input type="hidden" name="groupId" value={group.id} />
            <input name="label" placeholder="Label" className={input} required />
            <input name="href" placeholder="Href" className={input} required />
            <button type="submit" className="btn-slip rounded-xl bg-primary px-5 py-3 text-xs font-bold uppercase tracking-[0.08em] text-white">
              Add
            </button>
          </form>
          <div className="mt-4 divide-y divide-border rounded-2xl border border-border">
            {group.links.map((link) => (
              <div key={link.id} className="flex items-center justify-between px-4 py-3">
                <div>
                  <p className="font-semibold text-dark">{link.label}</p>
                  <p className="text-sm text-lighter">{link.href}</p>
                </div>
                <form action={deleteFooterLink}>
                  <input type="hidden" name="id" value={link.id} />
                  <button type="submit" className="text-lighter hover:text-secondary">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </form>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
