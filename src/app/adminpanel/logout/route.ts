import { NextResponse } from "next/server";
import { revokeAdminSession } from "@/lib/adminAuth";

export async function POST(req: Request) {
  await revokeAdminSession();
  return NextResponse.redirect(new URL("/adminpanel/login", req.url));
}

