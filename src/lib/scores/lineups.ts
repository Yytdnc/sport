import { unstable_cache } from "next/cache";
import { toKoreanTeamName } from "@/lib/scores/team-names-ko";

const API_HOST = "https://v3.football.api-sports.io";

export interface LineupPlayer {
  number: number;
  name: string;
  position: string;
}

export interface TeamLineup {
  teamName: string;
  formation: string | null;
  startXI: LineupPlayer[];
  substitutes: LineupPlayer[];
  coach: string | null;
}

export interface FixtureLineups {
  home: TeamLineup | null;
  away: TeamLineup | null;
}

interface ApiFootballLineupEntry {
  team: { name: string };
  coach: { name: string } | null;
  formation: string | null;
  startXI: { player: { number: number; name: string; pos: string } }[];
  substitutes: { player: { number: number; name: string; pos: string } }[];
}

interface ApiFootballLineupResponse {
  response?: ApiFootballLineupEntry[];
}

async function fetchLineupsUncached(fixtureId: string): Promise<FixtureLineups> {
  const key = process.env.API_FOOTBALL_KEY;
  if (!key) return { home: null, away: null };

  try {
    const res = await fetch(`${API_HOST}/fixtures/lineups?fixture=${fixtureId}`, {
      headers: { "x-apisports-key": key },
    });
    if (!res.ok) return { home: null, away: null };

    const data = (await res.json()) as ApiFootballLineupResponse;
    const [home, away] = data.response ?? [];

    function toTeamLineup(entry: ApiFootballLineupEntry | undefined): TeamLineup | null {
      if (!entry) return null;
      return {
        teamName: toKoreanTeamName(entry.team.name),
        formation: entry.formation,
        coach: entry.coach?.name ?? null,
        startXI: entry.startXI.map((p) => ({ number: p.player.number, name: p.player.name, position: p.player.pos })),
        substitutes: entry.substitutes.map((p) => ({ number: p.player.number, name: p.player.name, position: p.player.pos })),
      };
    }

    return { home: toTeamLineup(home), away: toTeamLineup(away) };
  } catch {
    return { home: null, away: null };
  }
}

/** Cached for 1 hour per fixture — lineups are announced ~1h before kickoff
 * and don't change after, so this is cheap while still protecting the
 * shared 100-req/day API-FOOTBALL quota from per-click detail views. */
export const getFixtureLineups = unstable_cache(
  (fixtureId: string) => fetchLineupsUncached(fixtureId),
  ["api-football-lineups"],
  { revalidate: 3600 }
);
