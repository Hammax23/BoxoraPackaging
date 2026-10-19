import ConfirmButton from "@/components/admin/ConfirmButton";
import SubmitButton from "@/components/admin/SubmitButton";
import { requireAdmin } from "@/lib/adminAuth";
import { prisma } from "@/lib/db";
import { ArrowDown, ArrowUp, Eye, EyeOff, Pencil, Plus, Trash2 } from "lucide-react";
import {
  createFooterLink,
  createNav,
  deleteFooterLink,
  deleteNav,
  moveFooterLink,
  moveNav,
  saveFooterLink,
  saveNav,
  toggleNav,
} from "./actions";

export const dynamic = "force-dynamic";

const input =
  "w-full min-h-[48px] rounded-xl border border-border bg-white px-4 py-3 text-[16px] text-dark outline-none transition placeholder:text-lighter focus:border-primary focus:ring-2 focus:ring-primary/15 sm:text-sm";
const iconBtn = "h-9 w-9 rounded-full border border-border text-text transition hover:border-primary/30 hover:text-primary";
const danger = `${iconBtn} hover:!border-red-300 hover:!text-red-600`;
const primaryBtn = "btn-slip w-fit rounded-xl bg-primary px-5 py-3 text-xs font-bold uppercase tracking-[0.08em] text-white";

function Hidden({ name, value }: { name: string; value: string }) {
  return <input type="hidden" name={name} value={value} />;
}

function Megamenu({ value }: { value?: string | null }) {
  return (
    <select name="megamenu" defaultValue={value ?? ""} className={input}>
      <option value="">No megamenu</option>
      <option value="industries">Industries</option>
      <option value="packaging-styles">Packaging styles</option>
      <option value="trends">Trends</option>
    </select>
  );
}

export default async function AdminNavigationPage() {
  await requireAdmin();

  const [navItems, footerGroups] = await Promise.all([
    prisma.navigationItem.findMany({
      where: { parentId: null },
      orderBy: [{ area: "asc" }, { sortOrder: "asc" }, { createdAt: "asc" }],
    }),
    prisma.footerLinkGroup.findMany({
      include: { links: { orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }] } },
      orderBy: { sortOrder: "asc" },
    }),
  ]);

  return (
    <div className="space-y-6">
      <div className="rounded-[28px] border border-border bg-white p-6 shadow-sm md:p-8">
        <p className="section-label text-primary">Structure</p>
        <h2 className="mt-4 font-heading text-3xl text-dark">Navigation & footer</h2>
        <p className="mt-2 text-sm text-text">
          Add, edit, reorder, hide or delete menu items and footer links. Changes appear on the website straight away.
        </p>
      </div>

      <div className="rounded-[28px] border border-border bg-white p-6 shadow-sm md:p-8">
        <h3 className="font-heading text-2xl text-dark">Main menu ({navItems.length})</h3>
        <form action={createNav} className="mt-4 grid gap-3 rounded-2xl bg-background-field/50 p-4 md:grid-cols-2">
          <select name="area" className={input}>
            <option value="left">Left of logo</option>
            <option value="right">Right of logo</option>
          </select>
          <Megamenu />
          <input name="label" placeholder="Label (e.g. PRICING)" className={input} required />
          <input name="href" placeholder="Link (e.g. /pricing)" className={input} required />
          <SubmitButton pendingText="Adding…" className={`${primaryBtn} md:col-span-2`}>
            <Plus className="h-4 w-4" /> Add menu item
          </SubmitButton>
        </form>

        <div className="mt-6 divide-y divide-border rounded-2xl border border-border">
          {navItems.map((item) => (
            <div key={item.id} className={`px-4 py-4 ${item.isActive ? "" : "bg-background-field/40"}`}>
              <div className="flex items-center justify-between gap-4">
                <div className={`min-w-0 ${item.isActive ? "" : "opacity-60"}`}>
                  <p className="font-semibold text-dark">
                    {item.label}{" "}
                    <span className="ml-1 rounded-full bg-background-field px-2 py-0.5 text-[10px] font-bold uppercase text-text">{item.area}</span>
                  </p>
                  <p className="truncate text-sm text-lighter">
                    {item.href}
                    {item.megamenu ? ` · ${item.megamenu} megamenu` : ""}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-1.5">
                  <form action={moveNav}>
                    <Hidden name="id" value={item.id} />
                    <Hidden name="dir" value="up" />
                    <SubmitButton pendingText="" className={iconBtn}>
                      <ArrowUp className="h-4 w-4" aria-label="Move up" />
                    </SubmitButton>
                  </form>
                  <form action={moveNav}>
                    <Hidden name="id" value={item.id} />
                    <Hidden name="dir" value="down" />
                    <SubmitButton pendingText="" className={iconBtn}>
                      <ArrowDown className="h-4 w-4" aria-label="Move down" />
                    </SubmitButton>
                  </form>
                  <form action={toggleNav}>
                    <Hidden name="id" value={item.id} />
                    <Hidden name="isActive" value={String(!item.isActive)} />
                    <SubmitButton pendingText="" className={iconBtn}>
                      {item.isActive ? <Eye className="h-4 w-4" aria-label="Hide" /> : <EyeOff className="h-4 w-4" aria-label="Show" />}
                    </SubmitButton>
                  </form>
                  <form action={deleteNav}>
                    <Hidden name="id" value={item.id} />
                    <ConfirmButton message={`Delete the "${item.label}" menu item?`} label="Delete" className={danger}>
                      <Trash2 className="h-4 w-4" />
                    </ConfirmButton>
                  </form>
                </div>
              </div>
              <details className="mt-3">
                <summary className="inline-flex cursor-pointer list-none items-center gap-1.5 text-[12px] font-bold uppercase tracking-wide text-primary">
                  <Pencil className="h-3.5 w-3.5" /> Edit
                </summary>
                <form action={saveNav} className="mt-3 grid gap-3 md:grid-cols-3">
                  <Hidden name="id" value={item.id} />
                  <input name="label" defaultValue={item.label} className={input} required />
                  <input name="href" defaultValue={item.href} className={input} required />
                  <Megamenu value={item.megamenu} />
                  <SubmitButton pendingText="Saving…" className={`${primaryBtn} md:col-span-3`}>
                    Save changes
                  </SubmitButton>
                </form>
              </details>
            </div>
          ))}
          {navItems.length === 0 && <p className="px-4 py-8 text-center text-sm text-lighter">No menu items yet — the default menu is shown.</p>}
        </div>
      </div>

      {footerGroups.map((group) => (
        <div key={group.id} className="rounded-[28px] border border-border bg-white p-6 shadow-sm md:p-8">
          <h3 className="font-heading text-2xl text-dark">
            Footer · {group.title} ({group.links.length})
          </h3>
          <form action={createFooterLink} className="mt-4 grid gap-3 rounded-2xl bg-background-field/50 p-4 md:grid-cols-[1fr_1fr_auto]">
            <Hidden name="groupId" value={group.id} />
            <input name="label" placeholder="Label" className={input} required />
            <input name="href" placeholder="Link (e.g. /privacy)" className={input} required />
            <SubmitButton pendingText="Adding…" className={primaryBtn}>
              <Plus className="h-4 w-4" /> Add
            </SubmitButton>
          </form>
          <div className="mt-4 divide-y divide-border rounded-2xl border border-border">
            {group.links.map((link) => (
              <div key={link.id} className="px-4 py-3">
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-semibold text-dark">{link.label}</p>
                    <p className="truncate text-sm text-lighter">{link.href}</p>
                  </div>
                  <div className="flex shrink-0 items-center gap-1.5">
                    <form action={moveFooterLink}>
                      <Hidden name="id" value={link.id} />
                      <Hidden name="dir" value="up" />
                      <SubmitButton pendingText="" className={iconBtn}>
                        <ArrowUp className="h-4 w-4" aria-label="Move up" />
                      </SubmitButton>
                    </form>
                    <form action={moveFooterLink}>
                      <Hidden name="id" value={link.id} />
                      <Hidden name="dir" value="down" />
                      <SubmitButton pendingText="" className={iconBtn}>
                        <ArrowDown className="h-4 w-4" aria-label="Move down" />
                      </SubmitButton>
                    </form>
                    <form action={deleteFooterLink}>
                      <Hidden name="id" value={link.id} />
                      <ConfirmButton message={`Delete "${link.label}"?`} label="Delete" className={danger}>
                        <Trash2 className="h-4 w-4" />
                      </ConfirmButton>
                    </form>
                  </div>
                </div>
                <details className="mt-2">
                  <summary className="inline-flex cursor-pointer list-none items-center gap-1.5 text-[12px] font-bold uppercase tracking-wide text-primary">
                    <Pencil className="h-3.5 w-3.5" /> Edit
                  </summary>
                  <form action={saveFooterLink} className="mt-3 grid gap-3 md:grid-cols-[1fr_1fr_auto]">
                    <Hidden name="id" value={link.id} />
                    <input name="label" defaultValue={link.label} className={input} required />
                    <input name="href" defaultValue={link.href} className={input} required />
                    <SubmitButton pendingText="Saving…" className={primaryBtn}>
                      Save
                    </SubmitButton>
                  </form>
                </details>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
