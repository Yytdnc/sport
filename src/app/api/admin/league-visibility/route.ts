import { NextRequest, NextResponse } from "next/server";
import { isAdminSession } from "@/lib/admin/session";
import { getSupabaseAdminClient } from "@/lib/admin/supabase-admin";

export async function GET() {
  const client = getSupabaseAdminClient();
  if (!client) {
    return NextResponse.json({ ok: false, error: "SUPABASE_SERVICE_ROLE_KEY가 설정되지 않았어요.", rows: [] });
  }
  const { data, error } = await client
    .from("league_visibility")
    .select("id, country, league_name, hidden, priority, created_at")
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

  const body = (await req.json()) as { country?: string; leagueName?: string; hidden?: boolean; priority?: number | null };
  const country = body.country?.trim();
  const leagueName = body.leagueName?.trim();

  if (!country || !leagueName) {
    return NextResponse.json({ ok: false, error: "국가와 리그명을 입력해주세요." }, { status: 400 });
  }

  const { error } = await client.from("league_visibility").upsert(
    {
      country,
      league_name: leagueName,
      hidden: body.hidden ?? false,
      priority: body.priority ?? null,
    },
    { onConflict: "country,league_name" }
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

  const { error } = await client.from("league_visibility").delete().eq("id", id);
  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
