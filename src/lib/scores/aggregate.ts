import type { ScoresResponse, SportId } from "@/lib/types";
import { getSoccerFixtures } from "@/lib/scores/api-football";
import { getTheSportsDbMatches } from "@/lib/scores/thesportsdb";

const THESPORTSDB_SPORTS: SportId[] = ["baseball", "basketball", "volleyball", "hockey"];

export async function getAllSportsForDate(date: string): Promise<Partial<Record<SportId, ScoresResponse>>> {
  const [soccer, ...rest] = await Promise.all([
    getSoccerFixtures(date),
    ...THESPORTSDB_SPORTS.map((s) => getTheSportsDbMatches(s).then((matches): ScoresResponse => ({ ok: true, matches }))),
  ]);

  const result: Partial<Record<SportId, ScoresResponse>> = { soccer };
  THESPORTSDB_SPORTS.forEach((s, i) => {
    result[s] = rest[i];
  });
  return result;
}
