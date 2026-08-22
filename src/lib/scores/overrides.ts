import { unstable_cache } from "next/cache";
import { getSupabaseClient } from "@/lib/supabase/client";

export interface OverridesMap {
  team: Record<string, string>;
  league: Record<string, string>;
  country: Record<string, string>;
}

const EMPTY: OverridesMap = { team: {}, league: {}, country: {} };

async function fetchOverridesUncached(): Promise<OverridesMap> {
  const client = getSupabaseClient();
  if (!client) return EMPTY;

  const { data, error } = await client.from("name_overrides").select("kind, original_name, country, korean_name");
  if (error || !data) return EMPTY;

  const map: OverridesMap = { team: {}, league: {}, country: {} };
  for (const row of data) {
    if (row.kind === "team") map.team[row.original_name] = row.korean_name;
    else if (row.kind === "country") map.country[row.original_name] = row.korean_name;
    else if (row.kind === "league") {
      const key = row.country ? `${row.country}|${row.original_name}` : row.original_name;
      map.league[key] = row.korean_name;
    }
  }
  return map;
}

/** Cached for 2 minutes so admin edits show up quickly without hitting
 * Supabase on every scoreboard refresh. */
export const getOverridesMap = unstable_cache(fetchOverridesUncached, ["name-overrides"], { revalidate: 120 });
