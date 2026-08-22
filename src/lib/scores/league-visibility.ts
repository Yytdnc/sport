import { unstable_cache } from "next/cache";
import { getSupabaseClient } from "@/lib/supabase/client";

export interface LeagueVisibilityEntry {
  hidden: boolean;
  priority: number | null;
}

export type LeagueVisibilityMap = Record<string, LeagueVisibilityEntry>;

async function fetchLeagueVisibilityUncached(): Promise<LeagueVisibilityMap> {
  const client = getSupabaseClient();
  if (!client) return {};

  const { data, error } = await client.from("league_visibility").select("country, league_name, hidden, priority");
  if (error || !data) return {};

  const map: LeagueVisibilityMap = {};
  for (const row of data) {
    map[`${row.country}|${row.league_name}`] = { hidden: row.hidden, priority: row.priority };
  }
  return map;
}

/** Cached for 2 minutes so admin show/hide changes apply quickly. */
export const getLeagueVisibilityMap = unstable_cache(fetchLeagueVisibilityUncached, ["league-visibility"], {
  revalidate: 120,
});
