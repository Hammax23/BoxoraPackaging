import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { createAdminSession, verifyPasswordScrypt } from "@/lib/adminAuth";

export async function POST(req: Request) {
  try {
    const form = await req.formData();
    const email = String(form.get("email") ?? "").trim().toLowerCase();
    const password = String(form.get("password") ?? "");

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
    }

    const user = await prisma.adminUser.findUnique({ where: { email } });
    if (!user || !user.isActive) {
      return NextResponse.json({ error: "Invalid credentials." }, { status: 401 });
    }

    const ok = verifyPasswordScrypt(password, user.passwordHash);
    if (!ok) {
      return NextResponse.json({ error: "Invalid credentials." }, { status: 401 });
    }

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

