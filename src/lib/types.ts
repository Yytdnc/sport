export type SportId =
  | "soccer"
  | "baseball"
  | "basketball"
  | "volleyball"
  | "hockey"
  | "esports"
  | "ufc"
  | "tennis"
  | "golf"
  | "f1";

export type MatchStatus = "scheduled" | "live" | "finished" | "postponed" | "cancelled";

export interface TeamRef {
  id: string;
  name: string;
  logo?: string | null;
  rank?: number | null;
}

export interface League {
  id: string;
  sportId: SportId;
  name: string;
  country?: string;
  countryFlag?: string;
  logo?: string | null;
  popular?: boolean;
  /** Lower is more prominent. 0 = explicitly popular, 1 = presumed top flight,
   * 2 = second tier, 3 = third/fourth+ tier, 4 = youth/reserve/women/amateur/regional. */
  tier?: number;
}

export interface MatchStats {
  possession?: [number, number];
  shots?: [number, number];
  passAccuracy?: [number, number];
  corners?: [number, number];
}

export interface Match {
  id: string;
  sportId: SportId;
  league: League;
  home: TeamRef;
  away: TeamRef;
  homeScore: number | null;
  awayScore: number | null;
  status: MatchStatus;
  statusText: string;
  elapsedMinutes?: number | null;
  kickoffAt: string | null;
  venue?: string | null;
  stats?: MatchStats | null;
  source: "api-football" | "thesportsdb";
}

export interface ScoresResponse {
  ok: boolean;
  reason?: "not_configured" | "upstream_error";
  matches: Match[];
}

export const SPORT_META: Record<SportId, { label: string; icon: string; supported: boolean }> = {
  soccer: { label: "축구", icon: "⚽", supported: true },
  baseball: { label: "야구", icon: "⚾", supported: true },
  basketball: { label: "농구", icon: "🏀", supported: true },
  volleyball: { label: "배구", icon: "🏐", supported: true },
  hockey: { label: "하키", icon: "🏒", supported: true },
  esports: { label: "e스포츠", icon: "🎮", supported: false },
  ufc: { label: "UFC", icon: "🥊", supported: false },
  tennis: { label: "테니스", icon: "🎾", supported: false },
  golf: { label: "골프", icon: "⛳", supported: false },
  f1: { label: "F1", icon: "🏎️", supported: false },
};

export const SPORT_ORDER: SportId[] = [
  "soccer",
  "baseball",
  "basketball",
  "volleyball",
  "hockey",
  "esports",
  "ufc",
  "tennis",
  "golf",
  "f1",
];
