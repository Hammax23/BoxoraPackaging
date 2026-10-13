import crypto from "node:crypto";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";

const COOKIE_NAME = "boxora_admin_session";

const PLACEHOLDER_SECRET = /change|example|placeholder|dev-insecure|your[-_ ]?secret|secret123|test/i;

export function sessionSecretProblem(secret = process.env.ADMIN_SESSION_SECRET): string | null {
  if (!secret) return "ADMIN_SESSION_SECRET is not set.";
  if (secret.length < 32) return "ADMIN_SESSION_SECRET is shorter than 32 characters.";
  if (PLACEHOLDER_SECRET.test(secret)) return "ADMIN_SESSION_SECRET looks like a placeholder value.";
  return null;
}

function getSessionSecret() {
  const secret = process.env.ADMIN_SESSION_SECRET;
  const problem = sessionSecretProblem(secret);
  if (problem && process.env.NODE_ENV === "production") {
    // Never run production with a guessable session secret.
    throw new Error(`${problem} Set a long random value (e.g. \`openssl rand -hex 32\`).`);
  }
  // Development stays usable, with a fallback when nothing is set.
  return secret || "dev-insecure-secret-change-me";
}

export function hashPasswordScrypt(password: string) {
  const salt = crypto.randomBytes(16).toString("hex");
  const derived = crypto.scryptSync(password, salt, 64).toString("hex");
  return `scrypt$${salt}$${derived}`;
}

export function verifyPasswordScrypt(password: string, stored: string) {
  const [kind, salt, derived] = stored.split("$");
  if (kind !== "scrypt" || !salt || !derived) return false;
  const candidate = crypto.scryptSync(password, salt, 64).toString("hex");
  return crypto.timingSafeEqual(Buffer.from(candidate), Buffer.from(derived));
}

function hashSessionToken(token: string) {
  const secret = getSessionSecret();
  return crypto.createHash("sha256").update(`${token}.${secret}`).digest("hex");
}

export async function createAdminSession(userId: string) {
  const token = crypto.randomBytes(32).toString("hex");
  const tokenHash = hashSessionToken(token);
  const now = new Date();
  const expiresAt = new Date(now.getTime() + 1000 * 60 * 60 * 24 * 14); // 14 days

  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null;
  const userAgent = h.get("user-agent") ?? null;

  await prisma.adminSession.create({
    data: {
      userId,
      tokenHash,
      ip,
      userAgent,
      expiresAt,
    },
  });

  const c = await cookies();
  c.set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: expiresAt,
  });
}

/** Signs out every session of this user except the one making the request. */
export async function revokeOtherAdminSessions(userId: string) {
  const c = await cookies();
  const token = c.get(COOKIE_NAME)?.value;
  const currentHash = token ? hashSessionToken(token) : "";
  await prisma.adminSession.updateMany({
    where: { userId, status: "ACTIVE", NOT: { tokenHash: currentHash } },
    data: { status: "REVOKED", revokedAt: new Date() },
  });
}

export async function revokeAdminSession() {
  const c = await cookies();
  const token = c.get(COOKIE_NAME)?.value;
  if (token) {
    const tokenHash = hashSessionToken(token);
    await prisma.adminSession.updateMany({
      where: { tokenHash, status: "ACTIVE" },
      data: { status: "REVOKED", revokedAt: new Date() },
    });
  }
  c.set(COOKIE_NAME, "", { path: "/", expires: new Date(0) });
}

export async function getAdminFromRequest() {
  const c = await cookies();
  const token = c.get(COOKIE_NAME)?.value;
  if (!token) return null;

  const tokenHash = hashSessionToken(token);
  const session = await prisma.adminSession.findUnique({
    where: { tokenHash },
    include: { user: true },
  });

  if (!session) return null;
  if (session.status !== "ACTIVE") return null;
  if (session.expiresAt.getTime() <= Date.now()) return null;
  if (!session.user.isActive) return null;

  return session.user;
}

export async function requireAdmin() {
  const admin = await getAdminFromRequest();
  if (!admin) redirect("/adminpanel/login");
  return admin;
}

