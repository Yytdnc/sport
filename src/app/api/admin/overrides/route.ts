import { NextRequest, NextResponse } from "next/server";
import { isAdminSession } from "@/lib/admin/session";
import { getSupabaseAdminClient } from "@/lib/admin/supabase-admin";

export async function GET() {
  const client = getSupabaseAdminClient();
  if (!client) {
    return NextResponse.json({ ok: false, error: "SUPABASE_SERVICE_ROLE_KEY가 설정되지 않았어요.", rows: [] });
  }
  const { data, error } = await client
    .from("name_overrides")
    .select("id, kind, original_name, country, korean_name, created_at")
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ ok: false, error: error.message, rows: [] });
  return NextResponse.json({ ok: true, rows: data });
}

export async function POST(req: NextRequest) {
  if (!(await isAdminSession())) {
    return NextResponse.json({ ok: false, error: "로그인이 필요해요." }, { status: 401 });
  }
  const client = getSupabaseAdminClient();
  if (!client) {
    return NextResponse.json({ ok: false, error: "SUPABASE_SERVICE_ROLE_KEY가 설정되지 않았어요." }, { status: 500 });
  }

  const body = (await req.json()) as { kind?: string; originalName?: string; country?: string; koreanName?: string };
  const kind = body.kind;
  const originalName = body.originalName?.trim();
  const koreanName = body.koreanName?.trim();
  const country = body.country?.trim() || null;

  if (!kind || !["team", "league", "country"].includes(kind) || !originalName || !koreanName) {
    return NextResponse.json({ ok: false, error: "입력값을 확인해주세요." }, { status: 400 });
  }

  const { error } = await client
    .from("name_overrides")
    .upsert(
      { kind, original_name: originalName, country, korean_name: koreanName },
      { onConflict: "kind,original_name,country" }
    );

  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: NextRequest) {
  if (!(await isAdminSession())) {
    return NextResponse.json({ ok: false, error: "로그인이 필요해요." }, { status: 401 });
  }
  const client = getSupabaseAdminClient();
  if (!client) {
    return NextResponse.json({ ok: false, error: "SUPABASE_SERVICE_ROLE_KEY가 설정되지 않았어요." }, { status: 500 });
  }

  const id = req.nextUrl.searchParams.get("id");
  if (!id) return NextResponse.json({ ok: false, error: "id가 필요해요." }, { status: 400 });

  const { error } = await client.from("name_overrides").delete().eq("id", id);
  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
