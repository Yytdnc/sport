import { NextRequest, NextResponse } from "next/server";
import { getTheSportsDbMatches } from "@/lib/scores/thesportsdb";
import type { ScoresResponse, SportId } from "@/lib/types";

const THESPORTSDB_SPORTS: SportId[] = ["baseball", "basketball", "volleyball", "hockey"];

export async function GET(_req: NextRequest, { params }: { params: Promise<{ sport: string }> }) {
  const { sport } = await params;

  if (!THESPORTSDB_SPORTS.includes(sport as SportId)) {
    const body: ScoresResponse = { ok: true, matches: [] };
    return NextResponse.json(body);
  }

  const matches = await getTheSportsDbMatches(sport as SportId);
  const body: ScoresResponse = { ok: true, matches };
  return NextResponse.json(body);
}
