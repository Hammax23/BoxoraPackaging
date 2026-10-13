import { randomBytes } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

/** Admin-uploaded images live here and are served through /media/<name>. */
export const MEDIA_DIR = process.env.MEDIA_DIR ?? path.join(process.cwd(), "storage", "media");
export const MAX_IMAGE_BYTES = 8 * 1024 * 1024;

const TYPES: Record<string, string> = {
  png: "image/png",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  webp: "image/webp",
  gif: "image/gif",
};

export const extOf = (name: string) => name.split(".").pop()?.toLowerCase() ?? "";
export const mimeForImage = (name: string) => TYPES[extOf(name)] ?? "application/octet-stream";

/** Checks the real file header, not just the name, so a renamed file can't slip through. */
function looksLikeImage(buf: Buffer, ext: string) {
  const hex = buf.subarray(0, 12).toString("hex");
  if (ext === "png") return hex.startsWith("89504e47");
  if (ext === "jpg" || ext === "jpeg") return hex.startsWith("ffd8ff");
  if (ext === "gif") return hex.startsWith("47494638");
  if (ext === "webp") return hex.startsWith("52494646") && buf.subarray(8, 12).toString("ascii") === "WEBP";
  return false;
}

export function validateImage(file: File): string | null {
  const ext = extOf(file.name);
  if (!(ext in TYPES)) return "Please upload a PNG, JPG, WEBP or GIF image.";
  if (file.size === 0) return "That file is empty.";
  if (file.size > MAX_IMAGE_BYTES) return "Images must be under 8 MB.";
  return null;
}

export async function saveImage(file: File) {
  const ext = extOf(file.name);
  const buf = Buffer.from(await file.arrayBuffer());
  if (!looksLikeImage(buf, ext)) throw new Error("That file is not a valid image.");
  await mkdir(MEDIA_DIR, { recursive: true });
  const base = file.name
    .replace(/\.[^.]+$/, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);
  const name = `${Date.now().toString(36)}-${randomBytes(4).toString("hex")}-${base || "image"}.${ext}`;
  await writeFile(path.join(MEDIA_DIR, name), buf);
  return { name, url: `/media/${name}`, size: buf.length, mime: mimeForImage(name) };
}

export async function readImage(name: string) {
  if (!/^[a-z0-9._-]+$/.test(name) || name.includes("..") || !(extOf(name) in TYPES)) return null;
  try {
    return await readFile(path.join(MEDIA_DIR, name));
  } catch {
    return null;
  }
}
