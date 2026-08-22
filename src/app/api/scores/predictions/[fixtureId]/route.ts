import { NextResponse } from "next/server";
import { getFixturePrediction } from "@/lib/scores/predictions";

export async function GET(_req: Request, { params }: { params: Promise<{ fixtureId: string }> }) {
  const { fixtureId } = await params;
  const prediction = await getFixturePrediction(fixtureId);
  return NextResponse.json({ ok: prediction !== null, prediction });
}
