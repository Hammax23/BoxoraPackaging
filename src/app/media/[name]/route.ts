import { mimeForImage, readImage } from "@/lib/media";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

/** Public file server for images uploaded through the admin panel. */
export async function GET(_req: Request, { params }: { params: Promise<{ name: string }> }) {
  const { name } = await params;
  const data = await readImage(name);
  if (!data) return new NextResponse("Not found", { status: 404 });
  return new NextResponse(new Uint8Array(data), {
    headers: {
      "Content-Type": mimeForImage(name),
      "Cache-Control": "public, max-age=31536000, immutable",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
