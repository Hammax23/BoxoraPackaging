"use server";

import { requireAdmin } from "@/lib/adminAuth";
import { logAction } from "@/lib/adminAudit";
import { revalidatePublicContent } from "@/lib/adminRevalidate";
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

const MEGAMENUS = ["industries", "packaging-styles", "trends"] as const;
const s = (f: FormData, k: string) => String(f.get(k) ?? "").trim();

function done() {
  revalidatePath("/adminpanel/navigation");
  revalidatePublicContent();
}

/** Only same-site paths, anchors, mailto/tel and https links are allowed in menus. */
function safeHref(href: string) {
  return /^(\/|#|https:\/\/|mailto:|tel:)/i.test(href) ? href : null;
}

export async function createNav(f: FormData) {
  const admin = await requireAdmin();
  const area = s(f, "area") === "right" ? "right" : "left";
  const label = s(f, "label");
  const href = safeHref(s(f, "href"));
  const mm = MEGAMENUS.find((m) => m === s(f, "megamenu")) ?? null;
  if (!label || !href) return;
  const count = await prisma.navigationItem.count({ where: { area, parentId: null } });
  const row = await prisma.navigationItem.create({ data: { area, label, href, megamenu: mm, sortOrder: count, isActive: true } });
  await logAction(admin.id, "Menu item added", "NavigationItem", row.id);
  done();
}

export async function saveNav(f: FormData) {
  const admin = await requireAdmin();
  const id = s(f, "id");
  const label = s(f, "label");
  const href = safeHref(s(f, "href"));
  const mm = MEGAMENUS.find((m) => m === s(f, "megamenu")) ?? null;
  if (!id || !label || !href) return;
  await prisma.navigationItem.update({ where: { id }, data: { label, href, megamenu: mm } });
  await logAction(admin.id, "Menu item edited", "NavigationItem", id);
  done();
}

export async function toggleNav(f: FormData) {
  const admin = await requireAdmin();
  const id = s(f, "id");
  if (!id) return;
  await prisma.navigationItem.update({ where: { id }, data: { isActive: f.get("isActive") === "true" } });
  await logAction(admin.id, "Menu item visibility changed", "NavigationItem", id);
  done();
}

export async function moveNav(f: FormData) {
  const admin = await requireAdmin();
  const id = s(f, "id");
  const dir = f.get("dir") === "up" ? -1 : 1;
  const item = await prisma.navigationItem.findUnique({ where: { id } });
  if (!item) return;
  const rows = await prisma.navigationItem.findMany({
    where: { area: item.area, parentId: null },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
  });
  const i = rows.findIndex((r) => r.id === id);
  const j = i + dir;
  if (i < 0 || j < 0 || j >= rows.length) return;
  [rows[i], rows[j]] = [rows[j], rows[i]];
  await Promise.all(rows.map((r, n) => prisma.navigationItem.update({ where: { id: r.id }, data: { sortOrder: n } })));
  await logAction(admin.id, "Menu reordered", "NavigationItem", id);
  done();
}

export async function deleteNav(f: FormData) {
  const admin = await requireAdmin();
  const id = s(f, "id");
  if (!id) return;
  await prisma.navigationItem.delete({ where: { id } });
  await logAction(admin.id, "Menu item deleted", "NavigationItem", id);
  done();
}

export async function createFooterLink(f: FormData) {
  const admin = await requireAdmin();
  const groupId = s(f, "groupId");
  const label = s(f, "label");
  const href = safeHref(s(f, "href"));
  if (!groupId || !label || !href) return;
  const count = await prisma.footerLink.count({ where: { groupId } });
  const row = await prisma.footerLink.create({ data: { groupId, label, href, sortOrder: count } });
  await logAction(admin.id, "Footer link added", "FooterLink", row.id);
  done();
}

export async function saveFooterLink(f: FormData) {
  const admin = await requireAdmin();
  const id = s(f, "id");
  const label = s(f, "label");
  const href = safeHref(s(f, "href"));
  if (!id || !label || !href) return;
  await prisma.footerLink.update({ where: { id }, data: { label, href } });
  await logAction(admin.id, "Footer link edited", "FooterLink", id);
  done();
}

export async function moveFooterLink(f: FormData) {
  const admin = await requireAdmin();
  const id = s(f, "id");
  const dir = f.get("dir") === "up" ? -1 : 1;
  const link = await prisma.footerLink.findUnique({ where: { id } });
  if (!link) return;
  const rows = await prisma.footerLink.findMany({
    where: { groupId: link.groupId },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
  });
  const i = rows.findIndex((r) => r.id === id);
  const j = i + dir;
  if (i < 0 || j < 0 || j >= rows.length) return;
  [rows[i], rows[j]] = [rows[j], rows[i]];
  await Promise.all(rows.map((r, n) => prisma.footerLink.update({ where: { id: r.id }, data: { sortOrder: n } })));
  await logAction(admin.id, "Footer links reordered", "FooterLink", id);
  done();
}

export async function deleteFooterLink(f: FormData) {
  const admin = await requireAdmin();
  const id = s(f, "id");
  if (!id) return;
  await prisma.footerLink.delete({ where: { id } });
  await logAction(admin.id, "Footer link deleted", "FooterLink", id);
  done();
}
