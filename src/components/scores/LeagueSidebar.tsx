"use client";

import { useMemo } from "react";
import type { League, Match } from "@/lib/types";
import styles from "./scores.module.css";

interface Props {
  matches: Match[];
  activeLeagueId: string;
  onSelect: (leagueId: string) => void;
}

interface LeagueCount {
  league: League;
  count: number;
}

export default function LeagueSidebar({ matches, activeLeagueId, onSelect }: Props) {
  const { popular, byCountry, total } = useMemo(() => {
    const map = new Map<string, LeagueCount>();
    matches.forEach((m) => {
      const existing = map.get(m.league.id);
      if (existing) existing.count += 1;
      else map.set(m.league.id, { league: m.league, count: 1 });
    });
    const byTierThenCount = (a: LeagueCount, b: LeagueCount) =>
      (a.league.tier ?? 1) - (b.league.tier ?? 1) || b.count - a.count;

    const all = Array.from(map.values());
    const popular = all.filter((l) => l.league.popular).sort(byTierThenCount);

    const countryMap = new Map<string, LeagueCount[]>();
    all.forEach((l) => {
      const key = l.league.country || "기타";
      const list = countryMap.get(key) ?? [];
      list.push(l);
      countryMap.set(key, list);
    });
    const byCountry = Array.from(countryMap.entries())
      .map(([country, leagues]) => ({
        country,
        flag: leagues.find((l) => l.league.countryFlag)?.league.countryFlag,
        leagues: leagues.sort(byTierThenCount),
        total: leagues.reduce((sum, l) => sum + l.count, 0),
      }))
      .sort((a, b) => b.total - a.total);

    return { popular, byCountry, total: matches.length };
  }, [matches]);

  return (
    <div className={styles.sidebar}>
      <button
        type="button"
        className={`${styles.sidebarItem} ${activeLeagueId === "all" ? styles.active : ""}`}
        onClick={() => onSelect("all")}
      >
        전체 리그
        <span className={styles.badge}>{total}</span>
      </button>

      {popular.length > 0 && (
        <>
          <div className={styles.sidebarGroupLabel}>인기 리그</div>
          {popular.map(({ league, count }) => (
            <button
              key={league.id}
              type="button"
              className={`${styles.sidebarItem} ${activeLeagueId === league.id ? styles.active : ""}`}
              onClick={() => onSelect(league.id)}
            >
              {league.logo && (
                // eslint-disable-next-line @next/next/no-img-element
                <img className={styles.sidebarFlag} src={league.logo} alt="" />
              )}
              {league.name}
              <span className={styles.badge}>{count}</span>
            </button>
          ))}
        </>
      )}

      {byCountry.map(({ country, flag, leagues, total: countryTotal }) => (
        <div key={country}>
          <div className={styles.sidebarGroupLabel}>
            {flag && (
              // eslint-disable-next-line @next/next/no-img-element
              <img className={styles.sidebarFlag} src={flag} alt="" />
            )}
            {country} · {countryTotal}
          </div>
          {leagues.map(({ league, count }) => (
            <button
              key={league.id}
              type="button"
              className={`${styles.sidebarItem} ${activeLeagueId === league.id ? styles.active : ""}`}
              onClick={() => onSelect(league.id)}
            >
              {league.logo && (
                // eslint-disable-next-line @next/next/no-img-element
                <img className={styles.sidebarFlag} src={league.logo} alt="" />
              )}
              {league.name}
              <span className={styles.badge}>{count}</span>
            </button>
          ))}
        </div>
      ))}
    </div>
  );
}
