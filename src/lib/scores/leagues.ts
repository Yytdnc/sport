import type { SportId } from "@/lib/types";

/**
 * TheSportsDB free-tier (test key "3") league IDs used for the sports that
 * are NOT covered by API-Football. Verified live against the API before
 * shipping — each of these actually returns events on the free key.
 */
export interface TheSportsDbLeague {
  id: string;
  apiId: number;
  label: string;
  sportId: SportId;
  country?: string;
}

export const THESPORTSDB_LEAGUES: TheSportsDbLeague[] = [
  { id: "mlb", apiId: 4424, label: "MLB", sportId: "baseball", country: "미국" },
  { id: "nba", apiId: 4387, label: "NBA", sportId: "basketball", country: "미국" },
  { id: "nhl", apiId: 4380, label: "NHL", sportId: "hockey", country: "미국" },
  { id: "vb-belgium", apiId: 5617, label: "벨기에 프로배구", sportId: "volleyball", country: "벨기에" },
];

/** League names (as returned by API-Football) surfaced under "인기 리그" in the sidebar. */
export const POPULAR_SOCCER_LEAGUE_NAMES = new Set([
  "Premier League",
  "La Liga",
  "Serie A",
  "Bundesliga",
  "Ligue 1",
  "K League 1",
  "J1 League",
  "UEFA Champions League",
  "UEFA Europa League",
]);
