import { unstable_cache } from "next/cache";

const API_HOST = "https://v3.football.api-sports.io";

export interface FixturePrediction {
  homePercent: number;
  drawPercent: number;
  awayPercent: number;
  advice: string | null;
}

interface ApiFootballPredictionResponse {
  response?: {
    predictions?: {
      percent?: { home?: string; draw?: string; away?: string };
      advice?: string | null;
    };
  }[];
}

async function fetchPredictionUncached(fixtureId: string): Promise<FixturePrediction | null> {
  const key = process.env.API_FOOTBALL_KEY;
  if (!key) return null;

  try {
    const res = await fetch(`${API_HOST}/predictions?fixture=${fixtureId}`, {
      headers: { "x-apisports-key": key },
    });
    if (!res.ok) return null;

    const data = (await res.json()) as ApiFootballPredictionResponse;
    const percent = data.response?.[0]?.predictions?.percent;
    if (!percent?.home || !percent.draw || !percent.away) return null;

    return {
      homePercent: parseInt(percent.home, 10),
      drawPercent: parseInt(percent.draw, 10),
      awayPercent: parseInt(percent.away, 10),
      advice: data.response?.[0]?.predictions?.advice ?? null,
    };
  } catch {
    return null;
  }
}

/**
 * Cached for 6 hours PER FIXTURE — predictions are computed pre-match and
 * don't meaningfully change, and this is what keeps per-click detail views
 * from eating into the same 100-req/day API-FOOTBALL quota the main
 * scoreboard refresh depends on. Under real traffic with many distinct
 * fixtures clicked in a day, this can still exceed the free quota — there's
 * no way to reserve a separate budget for it on the free plan.
 */
export const getFixturePrediction = unstable_cache(
  (fixtureId: string) => fetchPredictionUncached(fixtureId),
  ["api-football-prediction"],
  { revalidate: 21600 }
);
