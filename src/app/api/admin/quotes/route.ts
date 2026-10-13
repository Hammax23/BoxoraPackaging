import { getAdminFromRequest } from "@/lib/adminAuth";
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

/** Admin-only CSV export of quote requests. */
export async function GET() {
  const admin = await getAdminFromRequest();
  if (!admin) return new NextResponse("Unauthorized", { status: 401 });

  const quotes = await prisma.quoteRequest.findMany({ include: { items: true }, orderBy: { createdAt: "desc" } });
  // Prefix risky leading characters so spreadsheet apps don't run a cell as a formula.
  const safe = (v: string) => `"${(/^[=+\-@]/.test(v) ? `'${v}` : v).replace(/"/g, '""')}"`;
  const rows = quotes.map((q) =>
    [
      q.reference,
      q.name,
      q.email,
      q.phone ?? "",
      q.company ?? "",
      q.status,
      q.items.map((i) => `${i.productName ?? i.productSlug ?? "Custom"} x${i.quantity ?? ""}`).join("; "),
      q.notes ?? "",
      q.createdAt.toISOString(),
    ]
      .map((v) => safe(String(v)))
      .join(","),
  );
  const csv = ["reference,name,email,phone,company,status,items,notes,received", ...rows].join("\n");

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="boxora-quotes.csv"',
      "Cache-Control": "private, no-store",
    },
  });
}
