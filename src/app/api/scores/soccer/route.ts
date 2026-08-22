import { NextRequest, NextResponse } from "next/server";
import { getSoccerFixtures } from "@/lib/scores/api-football";

function todayKST(): string {
  return new Date().toLocaleDateString("sv-SE", { timeZone: "Asia/Seoul" });
}

export async function GET(req: NextRequest) {
  const date = req.nextUrl.searchParams.get("date") || todayKST();
  const result = await getSoccerFixtures(date);
  return NextResponse.json(result);
}
