"use client";

import { useState } from "react";
import type { Match } from "@/lib/types";
import styles from "./scores.module.css";

interface Props {
  match: Match;
  showLeagueInline?: boolean;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  onTeamClick: (teamId: string) => void;
  activeTeamId?: string | null;
}

function StatBarRow({ label, home, away }: { label: string; home: number; away: number }) {
  const total = home + away;
  const homePct = total > 0 ? Math.round((home / total) * 100) : 50;
  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "32px 1fr 32px", alignItems: "center", gap: 10 }}>
        <span style={{ textAlign: "right", fontFamily: "var(--font-mono)", fontWeight: 700 }}>{home}</span>
        <div style={{ display: "flex", height: 6, borderRadius: 3, overflow: "hidden", background: "var(--surface)" }}>
          <span style={{ width: `${homePct}%`, background: "var(--accent)" }} />
          <span style={{ width: `${100 - homePct}%`, background: "var(--border-technical)" }} />
        </div>
        <span style={{ fontFamily: "var(--font-mono)", fontWeight: 700 }}>{away}</span>
      </div>
      <div style={{ textAlign: "center", fontSize: "0.68rem", color: "var(--text-soft)", marginTop: 2 }}>{label}</div>
    </div>
  );
}

export default function MatchRow({ match, showLeagueInline, isFavorite, onToggleFavorite, onTeamClick, activeTeamId }: Props) {
  const [expanded, setExpanded] = useState(false);
  const expandable = match.status === "live" || match.status === "finished";
  const score = match.homeScore != null && match.awayScore != null ? `${match.homeScore} : ${match.awayScore}` : "vs";

  function handleTeamClick(e: React.MouseEvent, teamId: string) {
    e.stopPropagation();
    onTeamClick(teamId);
  }

  return (
    <div className={`${styles.matchRowWrap} ${match.status === "live" ? styles.live : ""}`}>
      {showLeagueInline && <div className={styles.leagueLabelInline}>{match.league.name}</div>}
      <div
        className={`${styles.matchRow} ${match.status === "live" ? styles.live : ""}`}
        role={expandable ? "button" : undefined}
        tabIndex={expandable ? 0 : undefined}
        onClick={() => expandable && setExpanded((v) => !v)}
      >
        <span className={styles.timeCell}>
          {match.status === "live" && <span className="dot" style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--live-color)" }} />}
          {match.statusText}
        </span>
        <span
          className={`${styles.teamCell} ${styles.home} ${activeTeamId === match.home.id ? styles.teamActive : ""}`}
          onClick={(e) => handleTeamClick(e, match.home.id)}
        >
          <span className={styles.teamName}>{match.home.name}</span>
          {match.home.logo && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={match.home.logo} alt="" />
          )}
          {match.home.rank != null && <span className={styles.teamRank}>[{match.home.rank}]</span>}
        </span>
        <span className={styles.scoreCell}>{score}</span>
        <span
          className={`${styles.teamCell} ${styles.away} ${activeTeamId === match.away.id ? styles.teamActive : ""}`}
          onClick={(e) => handleTeamClick(e, match.away.id)}
        >
          {match.away.logo && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={match.away.logo} alt="" />
          )}
          <span className={styles.teamName}>{match.away.name}</span>
          {match.away.rank != null && <span className={styles.teamRank}>[{match.away.rank}]</span>}
        </span>
        <button
          type="button"
          className={`${styles.starBtn} ${isFavorite ? styles.active : ""}`}
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(match.id);
          }}
          aria-label="즐겨찾기"
        >
          ★
        </button>
      </div>
      {expanded && (
        <div className={styles.detail}>
          <div className={styles.detailScore}>
            <span className="team">{match.home.name}</span>
            <span className="value">
              {match.homeScore ?? 0} : {match.awayScore ?? 0}
            </span>
            <span className="team">{match.away.name}</span>
          </div>
          <div className={styles.detailMeta}>
            {match.statusText}
            {match.venue ? ` · ${match.venue}` : ""}
          </div>
          {match.stats ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {match.stats.possession && <StatBarRow label="점유율 %" home={match.stats.possession[0]} away={match.stats.possession[1]} />}
              {match.stats.shots && <StatBarRow label="슈팅" home={match.stats.shots[0]} away={match.stats.shots[1]} />}
              {match.stats.passAccuracy && (
                <StatBarRow label="패스 정확도 %" home={match.stats.passAccuracy[0]} away={match.stats.passAccuracy[1]} />
              )}
              {match.stats.corners && <StatBarRow label="코너킥" home={match.stats.corners[0]} away={match.stats.corners[1]} />}
            </div>
          ) : (
            <p className={styles.detailEmpty}>실시간 세부 기록(점유율·슈팅 등)은 아직 제공되지 않아요.</p>
          )}
        </div>
      )}
    </div>
  );
}
