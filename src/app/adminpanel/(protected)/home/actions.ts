"use server";

import { requireAdmin } from "@/lib/adminAuth";
import { logAction } from "@/lib/adminAudit";
import { revalidatePublicContent } from "@/lib/adminRevalidate";
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

type Kind = "marquee" | "faq" | "testimonial";

// Each model has the same sortOrder/isActive shape, so one set of actions serves all three lists.
const models = {
  marquee: prisma.marqueeItem,
  faq: prisma.faq,
  testimonial: prisma.testimonial,
} as const;

function kindOf(v: FormDataEntryValue | null): Kind | null {
  return v === "marquee" || v === "faq" || v === "testimonial" ? v : null;
}

function done() {
  revalidatePath("/adminpanel/home");
  revalidatePublicContent();
}

type Row = { id: string; sortOrder: number };
type Delegate = {
  findMany(a: unknown): Promise<Row[]>;
  update(a: unknown): Promise<unknown>;
  delete(a: unknown): Promise<unknown>;
};
const model = (k: Kind) => models[k] as unknown as Delegate;

export async function moveItem(formData: FormData) {
  const admin = await requireAdmin();
  const kind = kindOf(formData.get("kind"));
  const id = String(formData.get("id") ?? "");
  const dir = formData.get("dir") === "up" ? -1 : 1;
  if (!kind || !id) return;

  const rows = await model(kind).findMany({ orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }] });
  const i = rows.findIndex((r) => r.id === id);
  const j = i + dir;
  if (i < 0 || j < 0 || j >= rows.length) return;
  [rows[i], rows[j]] = [rows[j], rows[i]];
  // Rewrite a clean 0..n sequence so ties never leave the order ambiguous.
  await Promise.all(rows.map((r, n) => model(kind).update({ where: { id: r.id }, data: { sortOrder: n } })));
  await logAction(admin.id, `Reordered ${kind}`, kind, id);
  done();
}

export async function toggleItem(formData: FormData) {
  const admin = await requireAdmin();
  const kind = kindOf(formData.get("kind"));
  const id = String(formData.get("id") ?? "");
  const isActive = formData.get("isActive") === "true";
  if (!kind || !id) return;
  await model(kind).update({ where: { id }, data: { isActive } });
  await logAction(admin.id, `${isActive ? "Showed" : "Hid"} ${kind}`, kind, id);
  done();
}

export async function removeItem(formData: FormData) {
  const admin = await requireAdmin();
  const kind = kindOf(formData.get("kind"));
  const id = String(formData.get("id") ?? "");
  if (!kind || !id) return;
  await model(kind).delete({ where: { id } });
  await logAction(admin.id, `Deleted ${kind}`, kind, id);
  done();
}

export async function saveItem(formData: FormData) {
  const admin = await requireAdmin();
  const kind = kindOf(formData.get("kind"));
  const id = String(formData.get("id") ?? "");
  if (!kind || !id) return;
  const s = (k: string) => String(formData.get(k) ?? "").trim();

  if (kind === "marquee") {
    if (!s("text")) return;
    await model(kind).update({ where: { id }, data: { text: s("text") } });
  } else if (kind === "faq") {
    if (!s("question") || !s("answer")) return;
    await model(kind).update({ where: { id }, data: { question: s("question"), answer: s("answer") } });
  } else {
    if (!s("title") || !s("text") || !s("name")) return;
    await model(kind).update({
      where: { id },
      data: {
        title: s("title"),
        text: s("text"),
        name: s("role") ? `${s("name")}|${s("role")}` : s("name"),
        imageUrl: s("imageUrl") || null,
      },
    });
  }
  await logAction(admin.id, `Edited ${kind}`, kind, id);
  done();
}

export async function setTestimonialsVisible(formData: FormData) {
  const admin = await requireAdmin();
  const value = formData.get("visible") === "true";
  await prisma.siteSetting.upsert({
    where: { key: "showTestimonials" },
    update: { value },
    create: { key: "showTestimonials", value },
  });
  await logAction(admin.id, value ? "Testimonials shown on homepage" : "Testimonials hidden on homepage", "SiteSetting", "showTestimonials");
  done();
  revalidatePath("/");
}
