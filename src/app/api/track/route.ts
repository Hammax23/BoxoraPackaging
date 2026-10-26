import { prisma } from "@/lib/db";
import { allow, clientIp } from "@/lib/leads/rateLimit";
import { ORDER_STAGES, stageIndex } from "@/lib/orderTracking";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

const NOT_FOUND = "We couldn't find an order with that reference and email. Check both and try again.";

export async function POST(req: Request) {
  if (!allow(`track:${clientIp(req)}`, 20, 15 * 60 * 1000)) {
    return NextResponse.json({ ok: false, error: "Too many attempts. Please try again in a few minutes." }, { status: 429 });
  }
  const body = (await req.json().catch(() => null)) as { reference?: string; email?: string } | null;
  const reference = String(body?.reference ?? "").trim().toUpperCase().slice(0, 40);
  const email = String(body?.email ?? "").trim().toLowerCase().slice(0, 200);
  if (!reference || !email) return NextResponse.json({ ok: false, error: NOT_FOUND }, { status: 404 });

  const q = await prisma.quoteRequest.findUnique({
    where: { reference },
    include: { updates: { orderBy: { createdAt: "asc" } }, items: { select: { productName: true, quantity: true } } },
  });
  // Same answer for "no such reference", "wrong email" and "not an order yet" so references can't be probed.
  if (!q || q.email.toLowerCase() !== email || q.orderStage === null || stageIndex(q.orderStage) < 0) {
    return NextResponse.json({ ok: false, error: NOT_FOUND }, { status: 404 });
  }

  const reached = new Map<string, Date>();
  for (const u of q.updates) if (!reached.has(u.stage)) reached.set(u.stage, u.createdAt);

  return NextResponse.json({
    ok: true,
    reference: q.reference,
    stage: q.orderStage,
    stages: ORDER_STAGES.map((s) => ({ key: s.key, label: s.label, at: reached.get(s.key) ?? null })),
    updates: q.updates.map((u) => ({ stage: u.stage, message: u.message, at: u.createdAt })).reverse(),
    carrier: q.carrier,
    trackingNumber: q.trackingNumber,
    trackingUrl: q.trackingUrl,
    estimatedDelivery: q.estimatedDelivery,
    items: q.items.map((i) => ({ name: i.productName, quantity: i.quantity })),
  });
}
