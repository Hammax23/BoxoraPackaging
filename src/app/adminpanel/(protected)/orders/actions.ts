"use server";

import { logAction } from "@/lib/adminAudit";
import { requireAdmin } from "@/lib/adminAuth";
import { prisma } from "@/lib/db";
import { ORDER_STAGES, safeUrl, stageIndex } from "@/lib/orderTracking";
import { revalidatePath } from "next/cache";

const str = (f: FormData, k: string, max: number) => String(f.get(k) ?? "").trim().slice(0, max);

function done(id: string) {
  revalidatePath("/adminpanel/orders");
  revalidatePath("/adminpanel/quotes");
  revalidatePath(`/adminpanel/quotes/${id}`);
}

/** Moves an order to `stage` (or turns tracking off with null) and logs a customer-visible update when it changed or a note was given. */
async function setStage(id: string, stage: string | null, message: string) {
  const current = await prisma.quoteRequest.findUnique({ where: { id }, select: { orderStage: true } });
  if (!current) return;
  await prisma.quoteRequest.update({ where: { id }, data: { orderStage: stage } });
  if (stage && (stage !== current.orderStage || message)) {
    await prisma.orderUpdate.create({ data: { quoteId: id, stage, message: message || ORDER_STAGES[stageIndex(stage)].hint } });
  }
}

export async function startTracking(formData: FormData) {
  const admin = await requireAdmin();
  const id = str(formData, "id", 40);
  const q = await prisma.quoteRequest.findUnique({ where: { id }, select: { orderStage: true } });
  if (!q || q.orderStage) return;
  await setStage(id, ORDER_STAGES[0].key, "");
  await logAction(admin.id, "Order tracking started", "QuoteRequest", id);
  done(id);
}

/** One-click "mark as next stage". */
export async function advanceStage(formData: FormData) {
  const admin = await requireAdmin();
  const id = str(formData, "id", 40);
  const q = await prisma.quoteRequest.findUnique({ where: { id }, select: { orderStage: true } });
  const next = ORDER_STAGES[stageIndex(q?.orderStage) + 1];
  if (!q?.orderStage || !next) return;
  await setStage(id, next.key, "");
  await logAction(admin.id, `Order stage → ${next.key}`, "QuoteRequest", id);
  done(id);
}

export async function saveTracking(formData: FormData) {
  const admin = await requireAdmin();
  const id = str(formData, "id", 40);
  const stageRaw = str(formData, "stage", 20);
  const stage = stageIndex(stageRaw) >= 0 ? stageRaw : null;
  const eta = str(formData, "estimatedDelivery", 10);
  await prisma.quoteRequest.update({
    where: { id },
    data: {
      carrier: str(formData, "carrier", 80) || null,
      trackingNumber: str(formData, "trackingNumber", 120) || null,
      trackingUrl: safeUrl(str(formData, "trackingUrl", 500)),
      estimatedDelivery: /^(20\d{2}|2100)-\d{2}-\d{2}$/.test(eta) ? new Date(`${eta}T12:00:00Z`) : null,
    },
  });
  await setStage(id, stage, str(formData, "message", 1000));
  await logAction(admin.id, `Order tracking → ${stage ?? "off"}`, "QuoteRequest", id);
  done(id);
}

export async function deleteUpdate(formData: FormData) {
  await requireAdmin();
  const id = str(formData, "id", 40);
  await prisma.orderUpdate.deleteMany({ where: { id: str(formData, "updateId", 40), quoteId: id } });
  done(id);
}
