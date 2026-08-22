import { unstable_cache } from "next/cache";
import type { League, Match, MatchStatus, ScoresResponse } from "@/lib/types";
import { POPULAR_SOCCER_LEAGUE_NAMES } from "@/lib/scores/leagues";
import { toKoreanTeamName } from "@/lib/scores/team-names-ko";

const API_HOST = "https://v3.football.api-sports.io";

interface ApiFootballFixture {
  fixture: {
    id: number;
    date: string;
    timestamp: number;
    venue: { name: string | null } | null;
    status: { long: string; short: string; elapsed: number | null };
  };
  league: {
    id: number;
    name: string;
    country: string;
    logo: string;
    flag: string | null;
    round: string;
  };
  teams: {
    home: { id: number; name: string; logo: string };
    away: { id: number; name: string; logo: string };
  };
  goals: { home: number | null; away: number | null };
}

const STATUS_MAP: Record<string, MatchStatus> = {
  TBD: "scheduled",
  NS: "scheduled",
  "1H": "live",
  HT: "live",
  "2H": "live",
  ET: "live",
  BT: "live",
  P: "live",
  SUSP: "live",
  INT: "live",
  LIVE: "live",
  FT: "finished",
  AET: "finished",
  PEN: "finished",
  PST: "postponed",
  CANC: "cancelled",
  ABD: "cancelled",
  AWD: "finished",
  WO: "finished",
};

function statusTextOf(short: string, status: MatchStatus, elapsed: number | null, kickoffIso: string): string {
  if (status === "finished") return "종료";
  if (status === "postponed") return "연기";
  if (status === "cancelled") return "취소";
  if (short === "HT") return "HT";
  if (status === "live") return elapsed != null ? `${elapsed}'` : "LIVE";
  const d = new Date(kickoffIso);
  return d.toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit", hour12: false, timeZone: "Asia/Seoul" });
}

function toMatch(fx: ApiFootballFixture): Match {
  const status = STATUS_MAP[fx.fixture.status.short] ?? "scheduled";
  const league: League = {
    id: `af-${fx.league.id}`,
    sportId: "soccer",
    name: fx.league.name,
    country: fx.league.country,
    countryFlag: fx.league.flag ?? undefined,
    logo: fx.league.logo,
    popular: POPULAR_SOCCER_LEAGUE_NAMES.has(fx.league.name),
  };
  return {
    id: `af-${fx.fixture.id}`,
    sportId: "soccer",
    league,
    home: { id: `af-team-${fx.teams.home.id}`, name: toKoreanTeamName(fx.teams.home.name), logo: fx.teams.home.logo },
    away: { id: `af-team-${fx.teams.away.id}`, name: toKoreanTeamName(fx.teams.away.name), logo: fx.teams.away.logo },
    homeScore: fx.goals.home,
    awayScore: fx.goals.away,
    status,
    statusText: statusTextOf(fx.fixture.status.short, status, fx.fixture.status.elapsed, fx.fixture.date),
    elapsedMinutes: fx.fixture.status.elapsed,
    kickoffAt: fx.fixture.date,
    venue: fx.fixture.venue?.name ?? null,
    stats: null,
    source: "api-football",
  };
}

async function fetchFixturesUncached(date: string): Promise<Match[]> {
  const key = process.env.API_FOOTBALL_KEY;
  if (!key) return [];
  const res = await fetch(`${API_HOST}/fixtures?date=${date}`, {
    headers: { "x-apisports-key": key },
  });
  if (!res.ok) throw new Error(`api-football ${res.status}`);
  const data = (await res.json()) as { response: ApiFootballFixture[] };
  return data.response.map(toMatch);
}

/**
 * Shared, server-side cache keyed by date. This is the ONLY thing standing
 * between us and burning through the 100-req/day free quota — every visitor
 * hits this cache, not the upstream API. A 15-minute window keeps worst-case
 * upstream calls at ~96/day even under continuous traffic.
 */
const getCachedFixtures = unstable_cache(
  async (date: string) => fetchFixturesUncached(date),
  ["api-football-fixtures"],
  { revalidate: 900 }
);

export async function getSoccerFixtures(date: string): Promise<ScoresResponse> {
  if (!process.env.API_FOOTBALL_KEY) {
    return { ok: false, reason: "not_configured", matches: [] };
  }
  try {
    const matches = await getCachedFixtures(date);
    return { ok: true, matches };
  } catch {
    return { ok: false, reason: "upstream_error", matches: [] };
  }
}
