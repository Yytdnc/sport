import { NextResponse } from "next/server";
import { getFixtureLineups } from "@/lib/scores/lineups";

export async function GET(_req: Request, { params }: { params: Promise<{ fixtureId: string }> }) {
  const { fixtureId } = await params;
  const lineups = await getFixtureLineups(fixtureId);
  return NextResponse.json({ ok: true, lineups });
}
