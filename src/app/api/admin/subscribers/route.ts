import { getAdminFromRequest } from "@/lib/adminAuth";
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

/** Admin-only CSV export of newsletter subscribers. */
export async function GET() {
  const admin = await getAdminFromRequest();
  if (!admin) return new NextResponse("Unauthorized", { status: 401 });

  const subs = await prisma.newsletterSubscriber.findMany({ orderBy: { createdAt: "desc" } });
  // Prefix risky leading characters so spreadsheet apps don't run a cell as a formula.
  const safe = (v: string) => `"${(/^[=+\-@]/.test(v) ? `'${v}` : v).replace(/"/g, '""')}"`;
  const csv = ["email,source,joined", ...subs.map((s) => [safe(s.email), safe(s.source ?? ""), s.createdAt.toISOString()].join(","))].join("\n");

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="boxora-subscribers.csv"',
      "Cache-Control": "private, no-store",
    },
  });
}
