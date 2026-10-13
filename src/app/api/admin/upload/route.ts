import { getAdminFromRequest } from "@/lib/adminAuth";
import { prisma } from "@/lib/db";
import { saveImage, validateImage } from "@/lib/media";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

/** Admin-only image upload. Returns { url } to paste into any image field. */
export async function POST(req: Request) {
  const admin = await getAdminFromRequest();
  if (!admin) return NextResponse.json({ error: "Please sign in again." }, { status: 401 });

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json({ error: "Invalid upload." }, { status: 400 });
  }
  const file = form.get("file");
  if (!(file instanceof File)) return NextResponse.json({ error: "No file received." }, { status: 400 });

  const problem = validateImage(file);
  if (problem) return NextResponse.json({ error: problem }, { status: 400 });

  try {
    const saved = await saveImage(file);
    const alt = String(form.get("alt") ?? "").trim().slice(0, 200);
    await prisma.mediaAsset.create({
      data: { provider: "local", url: saved.url, alt: alt || file.name.slice(0, 120), mime: saved.mime, meta: { size: saved.size, original: file.name.slice(0, 160) } },
    });
    return NextResponse.json({ ok: true, url: saved.url });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Upload failed." }, { status: 400 });
  }
}
