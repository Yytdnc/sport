"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { SPORT_META, SPORT_ORDER, type Match, type ScoresResponse, type SportId } from "@/lib/types";
import { filterMatchesByDate } from "@/lib/scores/utils";
import TopBar from "./TopBar";
import SportTabs from "./SportTabs";
import DateStrip from "./DateStrip";
import StatusFilterRow, { type GroupingMode, type StatusFilter } from "./StatusFilterRow";
import LeagueSidebar from "./LeagueSidebar";
import MatchList from "./MatchList";
import ComingSoonPanel from "./ComingSoonPanel";
import styles from "./scores.module.css";

const SUPPORTED_SPORTS: SportId[] = ["soccer", "baseball", "basketball", "volleyball", "hockey"];

interface Props {
  initialDate: string;
  initialData: Partial<Record<SportId, ScoresResponse>>;
}

function cacheKey(sport: SportId, date: string) {
  return `${sport}:${date}`;
}

async function fetchSportMatches(sportId: SportId, date: string): Promise<ScoresResponse> {
  const path = sportId === "soccer" ? "/api/scores/soccer" : `/api/scores/${sportId}`;
  try {
    const res = await fetch(`${path}?date=${date}`);
    if (!res.ok) return { ok: false, matches: [] };
    return (await res.json()) as ScoresResponse;
  } catch {
    return { ok: false, matches: [] };
  }
}

export default function ScoreboardSection({ initialDate, initialData }: Props) {
  const [activeSport, setActiveSport] = useState<SportId>("soccer");
  const [activeDate, setActiveDate] = useState(initialDate);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [groupingMode, setGroupingMode] = useState<GroupingMode>("league");
  const [activeLeagueId, setActiveLeagueId] = useState("all");
  const [activeTeamId, setActiveTeamId] = useState<string | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());
  const [loadingDate, setLoadingDate] = useState<string | null>(null);

  const [cache, setCache] = useState<Record<string, ScoresResponse>>(() => {
    const initial: Record<string, ScoresResponse> = {};
    SUPPORTED_SPORTS.forEach((s) => {
      const resp = initialData[s];
      if (resp) initial[cacheKey(s, initialDate)] = resp;
    });
    return initial;
  });

  const loadDate = useCallback(async (date: string) => {
    setLoadingDate(date);
    const results = await Promise.all(SUPPORTED_SPORTS.map((s) => fetchSportMatches(s, date)));
    setCache((prev) => {
      const next = { ...prev };
      SUPPORTED_SPORTS.forEach((s, i) => {
        next[cacheKey(s, date)] = results[i];
      });
      return next;
    });
    setLoadingDate((current) => (current === date ? null : current));
  }, []);

  useEffect(() => {
    const hasAny = SUPPORTED_SPORTS.some((s) => cache[cacheKey(s, activeDate)]);
    // Kicks off a network fetch (an external system), which is exactly what effects are for.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (!hasAny) loadDate(activeDate);
    // Intentionally re-runs only when activeDate changes, not on every cache/loadDate identity change.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeDate]);

  useEffect(() => {
    if (!autoRefresh) return;
    const id = setInterval(() => loadDate(activeDate), 45000);
    return () => clearInterval(id);
  }, [autoRefresh, activeDate, loadDate]);

  // Reset the league filter during render when the sport/date changes, instead of in an effect.
  const sportDateKey = `${activeSport}:${activeDate}`;
  const [resetKey, setResetKey] = useState(sportDateKey);
  if (resetKey !== sportDateKey) {
    setResetKey(sportDateKey);
    setActiveLeagueId("all");
    setActiveTeamId(null);
  }

  function handleSelectLeague(leagueId: string) {
    setActiveLeagueId(leagueId);
    setActiveTeamId(null);
  }

  function handleTeamClick(teamId: string) {
    setActiveTeamId((prev) => (prev === teamId ? null : teamId));
    setActiveLeagueId("all");
  }

  const matchesBySport = useMemo(() => {
    const map: Partial<Record<SportId, Match[]>> = {};
    SUPPORTED_SPORTS.forEach((s) => {
      const resp = cache[cacheKey(s, activeDate)];
      map[s] = resp ? filterMatchesByDate(resp.matches, activeDate) : [];
    });
    return map;
  }, [cache, activeDate]);

  const soccerResponse = cache[cacheKey("soccer", activeDate)];
  const activeMatches = matchesBySport[activeSport] ?? [];
  const totalCount = activeMatches.length;
  const liveCount = activeMatches.filter((m) => m.status === "live").length;

  const sportCounts = useMemo(() => {
    const counts: Record<SportId, number> = {} as Record<SportId, number>;
    SPORT_ORDER.forEach((s) => {
      counts[s] = (matchesBySport[s] ?? []).filter((m) => m.status === "live").length;
    });
    return counts;
  }, [matchesBySport]);

  function toggleFavorite(id: string) {
    setFavoriteIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  return (
    <section className="section wrap-wide">
      <div className="section-head">
        <h2>
          <span className="material-symbols-outlined">scoreboard</span> 라이브 스코어
        </h2>
      </div>

      <TopBar
        activeDate={activeDate}
        totalCount={totalCount}
        liveCount={liveCount}
        autoRefresh={autoRefresh}
        onAutoRefreshChange={setAutoRefresh}
      />
      <SportTabs activeSport={activeSport} onChange={setActiveSport} counts={sportCounts} />
      <DateStrip activeDate={activeDate} onChange={setActiveDate} />

      {!SPORT_META[activeSport].supported ? (
        <ComingSoonPanel sportLabel={SPORT_META[activeSport].label} />
      ) : (
        <div className={styles.layout}>
          <div className={styles.main}>
            {activeTeamId && (
              <div className={styles.teamFilterChip}>
                {(activeMatches.find((m) => m.home.id === activeTeamId)?.home.name ??
                  activeMatches.find((m) => m.away.id === activeTeamId)?.away.name) ||
                  "선택한 팀"}{" "}
                경기만 보기
                <button type="button" onClick={() => setActiveTeamId(null)} aria-label="팀 필터 해제">
                  ✕
                </button>
              </div>
            )}
            <StatusFilterRow
              matches={activeMatches}
              statusFilter={statusFilter}
              onStatusFilterChange={setStatusFilter}
              groupingMode={groupingMode}
              onGroupingModeChange={setGroupingMode}
            />
            <div className={styles.body}>
              <LeagueSidebar matches={activeMatches} activeLeagueId={activeLeagueId} onSelect={handleSelectLeague} />
              <MatchList
                matches={activeMatches}
                statusFilter={statusFilter}
                groupingMode={groupingMode}
                activeLeagueId={activeLeagueId}
                activeTeamId={activeTeamId}
                activeDate={activeDate}
                loading={loadingDate === activeDate}
                notConfigured={activeSport === "soccer" && soccerResponse?.ok === false && soccerResponse.reason === "not_configured"}
                favoriteIds={favoriteIds}
                onToggleFavorite={toggleFavorite}
                onTeamClick={handleTeamClick}
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
