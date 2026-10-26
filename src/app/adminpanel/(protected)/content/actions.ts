"use server";

import { requireAdmin } from "@/lib/adminAuth";
import { logAction } from "@/lib/adminAudit";
import { revalidatePublicContent } from "@/lib/adminRevalidate";
import { contentSection } from "@/lib/contentSections";
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

function done(key: string) {
  revalidatePath("/adminpanel/content");
  revalidatePath(`/adminpanel/content/${key}`);
  revalidatePublicContent();
  for (const p of ["/about", "/team", "/styles", "/trends", "/category"]) revalidatePath(p, "layout");
}

export async function saveSection(key: string, json: string): Promise<{ ok: boolean; error?: string }> {
  const admin = await requireAdmin();
  const section = contentSection(key);
  if (!section) return { ok: false, error: "Unknown section." };
  let value: unknown;
  try {
    value = JSON.parse(json);
  } catch {
    return { ok: false, error: "Invalid data." };
  }
  if (Array.isArray(section.defaults) !== Array.isArray(value) || value === null || typeof value !== "object") {
    return { ok: false, error: "Wrong shape for this section." };
  }
  if (Array.isArray(value) && value.length === 0) return { ok: false, error: "Keep at least one item (or use Reset to default)." };
  await prisma.siteSetting.upsert({
    where: { key: `content:${key}` },
    update: { value: value as object },
    create: { key: `content:${key}`, value: value as object },
  });
  await logAction(admin.id, "Page content saved", "SiteSetting", key);
  done(key);
  return { ok: true };
}

export async function resetSection(key: string) {
  const admin = await requireAdmin();
  if (!contentSection(key)) return;
  await prisma.siteSetting.deleteMany({ where: { key: `content:${key}` } });
  await logAction(admin.id, "Page content reset", "SiteSetting", key);
  done(key);
}
