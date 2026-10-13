import { getAdminFromRequest } from "@/lib/adminAuth";
import { mimeFor, readUpload } from "@/lib/leads/storage";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

/** Admin-only download for customer uploads. */
export async function GET(_req: Request, { params }: { params: Promise<{ name: string }> }) {
  const admin = await getAdminFromRequest();
  if (!admin) return new NextResponse("Unauthorized", { status: 401 });

  const { name } = await params;
  const data = await readUpload(name);
  if (!data) return new NextResponse("Not found", { status: 404 });

  return new NextResponse(new Uint8Array(data), {
    headers: {
      "Content-Type": mimeFor(name),
      "Content-Disposition": `attachment; filename="${name}"`,
      "X-Content-Type-Options": "nosniff",
      "Cache-Control": "private, no-store",
    },
  });
}
