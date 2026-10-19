import { getAdminFromRequest } from "@/lib/adminAuth";
import { mimeFor, readUpload } from "@/lib/leads/storage";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

/** Admin-only download for customer uploads. */
export async function GET(req: Request, { params }: { params: Promise<{ name: string }> }) {
  const admin = await getAdminFromRequest();
  if (!admin) return new NextResponse("Unauthorized", { status: 401 });

  const { name } = await params;
  const data = await readUpload(name);
  if (!data) return new NextResponse("Not found", { status: 404 });

  const type = mimeFor(name);
  // Only raster images may be shown inline (for previews); everything else always downloads.
  const inline = new URL(req.url).searchParams.get("inline") === "1" && /^image\/(png|jpe?g)$/.test(type);

  return new NextResponse(new Uint8Array(data), {
    headers: {
      "Content-Type": type,
      "Content-Disposition": `${inline ? "inline" : "attachment"}; filename="${name}"`,
      "Content-Security-Policy": "default-src 'none'; img-src 'self'; sandbox",
      "X-Content-Type-Options": "nosniff",
      "Cache-Control": "private, no-store",
    },
  });
}
