import { NextResponse } from "next/server";
import { revokeAdminSession } from "@/lib/adminAuth";

export async function POST() {
  await revokeAdminSession();
  return NextResponse.redirect(new URL("/adminpanel/login", process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"));
}

