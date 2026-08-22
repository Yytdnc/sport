import { NextRequest, NextResponse } from "next/server";
import { checkAdminCredentials, createAdminSessionCookie } from "@/lib/admin/session";

export async function POST(req: NextRequest) {
  const { username, password } = (await req.json()) as { username?: string; password?: string };

  if (!checkAdminCredentials(username ?? "", password ?? "")) {
    return NextResponse.json({ ok: false, error: "아이디 또는 비밀번호가 올바르지 않아요." }, { status: 401 });
  }

  await createAdminSessionCookie();
  return NextResponse.json({ ok: true });
}
