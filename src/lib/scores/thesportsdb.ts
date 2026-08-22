import { unstable_cache } from "next/cache";
import type { League, Match, MatchStatus, SportId } from "@/lib/types";
import { THESPORTSDB_LEAGUES, type TheSportsDbLeague } from "@/lib/scores/leagues";

const API_BASE = "https://www.thesportsdb.com/api/v1/json/3";

interface TsdbEvent {
  idEvent: string;
  strHomeTeam: string;
  strAwayTeam: string;
  intHomeScore: string | null;
  intAwayScore: string | null;
  dateEvent: string | null;
  strTimeLocal: string | null;
  strTimestamp: string | null;
  strVenue: string | null;
  strStatus: string | null;
}

async function fetchEvents(url: string): Promise<TsdbEvent[]> {
  try {
    const res = await fetch(url, { next: { revalidate: 300 } });
    if (!res.ok) return [];
    const data = (await res.json()) as { events?: TsdbEvent[] | null };
    return data.events ?? [];
  } catch {
    return [];
  }
}

/** Ported from the original js/sports-scores.js statusOf() heuristic — the free
 * TheSportsDB tier has no true live in-play flag, so status is guessed from
 * strStatus + a 4-hour "must be live" window around kickoff. */
function statusOf(ev: TsdbEvent): { status: MatchStatus; elapsedMinutes: number | null } {
  const now = Date.now();
  const timestamp = ev.strTimestamp ? new Date(ev.strTimestamp + "Z").getTime() : null;
  const hasScore = ev.intHomeScore != null && ev.intAwayScore != null;

  if (ev.strStatus === "FT" || ev.strStatus === "Match Finished") return { status: "finished", elapsedMinutes: null };
  if (ev.strStatus && /^(1H|2H|HT|ET|LIVE|Q1|Q2|Q3|Q4)/.test(ev.strStatus)) {
    const mins = timestamp ? Math.max(0, Math.round((now - timestamp) / 60000)) : null;
    return { status: "live", elapsedMinutes: mins };
  }
  if (timestamp) {
    if (hasScore) return { status: "finished", elapsedMinutes: null };
    if (timestamp <= now && timestamp > now - 4 * 60 * 60 * 1000) {
      return { status: "live", elapsedMinutes: Math.max(0, Math.round((now - timestamp) / 60000)) };
    }
    if (timestamp > now) return { status: "scheduled", elapsedMinutes: null };
    return { status: "finished", elapsedMinutes: null };
  }
  return { status: hasScore ? "finished" : "scheduled", elapsedMinutes: null };
}

function statusText(status: MatchStatus, elapsedMinutes: number | null, timeLocal: string | null): string {
  if (status === "live") return elapsedMinutes != null ? `${elapsedMinutes}'` : "LIVE";
  if (status === "finished") return "종료";
  return timeLocal ? timeLocal.slice(0, 5) : "예정";
}

function toMatch(ev: TsdbEvent, league: TheSportsDbLeague): Match {
  const { status, elapsedMinutes } = statusOf(ev);
  const leagueRef: League = {
    id: league.id,
    sportId: league.sportId,
    name: league.label,
    country: league.country,
  };
  return {
    id: `tsdb-${ev.idEvent}`,
    sportId: league.sportId,
    league: leagueRef,
    home: { id: `${league.id}-home-${ev.strHomeTeam}`, name: ev.strHomeTeam },
    away: { id: `${league.id}-away-${ev.strAwayTeam}`, name: ev.strAwayTeam },
    homeScore: ev.intHomeScore != null ? Number(ev.intHomeScore) : null,
    awayScore: ev.intAwayScore != null ? Number(ev.intAwayScore) : null,
    status,
    statusText: statusText(status, elapsedMinutes, ev.strTimeLocal),
    elapsedMinutes,
    kickoffAt: ev.strTimestamp ? `${ev.strTimestamp}Z` : null,
    venue: ev.strVenue,
    stats: null,
    source: "thesportsdb",
  };
}

async function loadLeague(league: TheSportsDbLeague): Promise<Match[]> {
  const [next, past] = await Promise.all([
    fetchEvents(`${API_BASE}/eventsnextleague.php?id=${league.apiId}`),
    fetchEvents(`${API_BASE}/eventspastleague.php?id=${league.apiId}`),
  ]);
  return [...past, ...next].map((ev) => toMatch(ev, league));
}

async function loadSportUncached(sportId: SportId): Promise<Match[]> {
  const leagues = THESPORTSDB_LEAGUES.filter((l) => l.sportId === sportId);
  if (leagues.length === 0) return [];
  const results = await Promise.all(leagues.map(loadLeague));
  return results.flat();
}

/** Cached per-sport for 5 minutes — TheSportsDB free tier has no strict quota,
 * but this still avoids hammering it on every client poll. */
export const getTheSportsDbMatches = unstable_cache(
  async (sportId: SportId) => loadSportUncached(sportId),
  ["thesportsdb-matches"],
  { revalidate: 300 }
);
