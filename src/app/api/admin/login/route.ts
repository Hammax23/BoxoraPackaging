import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { createAdminSession, hashPasswordScrypt, verifyPasswordScrypt } from "@/lib/adminAuth";
import { clearFailures, clientIp, isLocked, recordFailure } from "@/lib/leads/rateLimit";

const WINDOW = 15 * 60 * 1000;
// Used to spend the same time when the email is unknown (prevents guessing which emails exist).
const DUMMY_HASH = hashPasswordScrypt("not-a-real-password");

export async function POST(req: Request) {
  try {
    const form = await req.formData();
    const email = String(form.get("email") ?? "").trim().toLowerCase();
    const password = String(form.get("password") ?? "");

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
    }

    // Brute-force protection: only FAILED attempts count, per IP and per account.
    const ipKey = `admin-login-ip:${clientIp(req)}`;
    const emailKey = `admin-login-email:${email}`;
    if (isLocked(ipKey, 10) || isLocked(emailKey, 6)) {
      return NextResponse.json(
        { error: "Too many login attempts. Please wait 15 minutes and try again." },
        { status: 429, headers: { "Retry-After": "900" } },
      );
    }

    const user = await prisma.adminUser.findUnique({ where: { email } });
    if (!user || !user.isActive) {
      verifyPasswordScrypt(password, DUMMY_HASH);
      recordFailure(ipKey, WINDOW);
      recordFailure(emailKey, WINDOW);
      return NextResponse.json({ error: "Invalid credentials." }, { status: 401 });
    }

    const ok = verifyPasswordScrypt(password, user.passwordHash);
    if (!ok) {
      recordFailure(ipKey, WINDOW);
      recordFailure(emailKey, WINDOW);
      return NextResponse.json({ error: "Invalid credentials." }, { status: 401 });
    }
    clearFailures(ipKey);
    clearFailures(emailKey);

    await createAdminSession(user.id);
    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: "admin.login",
        entityType: "AdminUser",
        entityId: user.id,
      },
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Admin login failed:", error);
    return NextResponse.json(
      { error: "Database connection failed. Check Docker and DATABASE_URL in .env." },
      { status: 500 }
    );
  }
}

