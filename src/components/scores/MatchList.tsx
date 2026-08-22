"use client";

import { useMemo } from "react";
import type { League, Match } from "@/lib/types";
import type { GroupingMode, StatusFilter } from "./StatusFilterRow";
import MatchRow from "./MatchRow";
import { formatDateHeadingLong } from "@/lib/scores/utils";
import styles from "./scores.module.css";

interface Props {
  matches: Match[];
  statusFilter: StatusFilter;
  groupingMode: GroupingMode;
  activeLeagueId: string;
  activeDate: string;
  loading: boolean;
  notConfigured: boolean;
  favoriteIds: Set<string>;
  onToggleFavorite: (id: string) => void;
}

function matchesStatusFilter(m: Match, filter: StatusFilter): boolean {
  if (filter === "all") return true;
  if (filter === "postponed") return m.status === "postponed" || m.status === "cancelled";
  return m.status === filter;
}

interface LeagueGroup {
  league: League;
  matches: Match[];
}

function groupByLeague(matches: Match[]): LeagueGroup[] {
  const map = new Map<string, LeagueGroup>();
  matches.forEach((m) => {
    const existing = map.get(m.league.id);
    if (existing) existing.matches.push(m);
    else map.set(m.league.id, { league: m.league, matches: [m] });
  });
  return Array.from(map.values())
    .map((g) => ({ ...g, matches: g.matches.slice().sort((a, b) => (a.kickoffAt ?? "").localeCompare(b.kickoffAt ?? "")) }))
    .sort((a, b) => {
      if (!!a.league.popular !== !!b.league.popular) return a.league.popular ? -1 : 1;
      return b.matches.length - a.matches.length;
    });
}

export default function MatchList({
  matches,
  statusFilter,
  groupingMode,
  activeLeagueId,
  activeDate,
  loading,
  notConfigured,
  favoriteIds,
  onToggleFavorite,
}: Props) {
  const filtered = useMemo(() => {
    return matches
      .filter((m) => activeLeagueId === "all" || m.league.id === activeLeagueId)
      .filter((m) => matchesStatusFilter(m, statusFilter));
  }, [matches, activeLeagueId, statusFilter]);

  const liveMatches = useMemo(() => filtered.filter((m) => m.status === "live"), [filtered]);
  const rest = useMemo(() => filtered.filter((m) => m.status !== "live"), [filtered]);

  const restGroups = useMemo(() => (groupingMode === "league" ? groupByLeague(rest) : null), [groupingMode, rest]);
  const restFlat = useMemo(
    () => (groupingMode === "time" ? rest.slice().sort((a, b) => (a.kickoffAt ?? "").localeCompare(b.kickoffAt ?? "")) : null),
    [groupingMode, rest]
  );

  if (notConfigured) {
    return (
      <div className={styles.emptyState}>
        축구 데이터를 표시할 수 없어요 (API-FOOTBALL 키가 설정되지 않았어요).
      </div>
    );
  }

  if (!loading && filtered.length === 0) {
    return <div className={styles.emptyState}>해당 조건의 경기 정보가 없어요.</div>;
  }

  return (
    <div className={styles.list}>
      {liveMatches.length > 0 && (
        <div>
          <div className={styles.liveGroupHeader}>
            <span className="dot" style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--live-color)" }} />
            진행 중 ({liveMatches.length})
          </div>
          <div className={styles.leagueGroup}>
            {liveMatches.map((m) => (
              <MatchRow
                key={m.id}
                match={m}
                showLeagueInline={groupingMode === "time"}
                isFavorite={favoriteIds.has(m.id)}
                onToggleFavorite={onToggleFavorite}
              />
            ))}
          </div>
        </div>
      )}

      {rest.length > 0 && (
        <>
          <div className={styles.dateSeparator}>{formatDateHeadingLong(activeDate)}</div>
          {restGroups
            ? restGroups.map((g) => (
                <div className={styles.leagueGroup} key={g.league.id}>
                  <div className={styles.leagueGroupHead}>
                    {g.league.logo && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={g.league.logo} alt="" />
                    )}
                    <span>{g.league.name}</span>
                    <span className="count">{g.matches.length}경기</span>
                    <span className={styles.rankLink}>순위 →</span>
                  </div>
                  {g.matches.map((m) => (
                    <MatchRow key={m.id} match={m} isFavorite={favoriteIds.has(m.id)} onToggleFavorite={onToggleFavorite} />
                  ))}
                </div>
              ))
            : (
                <div className={styles.leagueGroup}>
                  {restFlat!.map((m) => (
                    <MatchRow
                      key={m.id}
                      match={m}
                      showLeagueInline
                      isFavorite={favoriteIds.has(m.id)}
                      onToggleFavorite={onToggleFavorite}
                    />
                  ))}
                </div>
              )}
        </>
      )}
    </div>
  );
}
