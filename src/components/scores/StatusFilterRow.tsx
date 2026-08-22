"use client";

import type { Match } from "@/lib/types";
import styles from "./scores.module.css";

export type StatusFilter = "all" | "live" | "scheduled" | "finished" | "postponed";
export type GroupingMode = "league" | "time";

interface Props {
  matches: Match[];
  statusFilter: StatusFilter;
  onStatusFilterChange: (value: StatusFilter) => void;
  groupingMode: GroupingMode;
  onGroupingModeChange: (value: GroupingMode) => void;
}

export default function StatusFilterRow({
  matches,
  statusFilter,
  onStatusFilterChange,
  groupingMode,
  onGroupingModeChange,
}: Props) {
  const counts = {
    all: matches.length,
    live: matches.filter((m) => m.status === "live").length,
    scheduled: matches.filter((m) => m.status === "scheduled").length,
    finished: matches.filter((m) => m.status === "finished").length,
    postponed: matches.filter((m) => m.status === "postponed" || m.status === "cancelled").length,
  };

  const items: { id: StatusFilter; label: string; live?: boolean }[] = [
    { id: "all", label: "전체" },
    { id: "live", label: "라이브", live: true },
    { id: "scheduled", label: "예정" },
    { id: "finished", label: "종료" },
    { id: "postponed", label: "연기" },
  ];

  return (
    <div className={styles.statusRow}>
      {items.map((item) => (
        <button
          key={item.id}
          type="button"
          className={`${styles.statusPill} ${statusFilter === item.id ? styles.active : ""}`}
          onClick={() => onStatusFilterChange(item.id)}
        >
          {item.live && <span className={styles.liveDot} />}
          {item.label} {counts[item.id]}
        </button>
      ))}
      <div className={styles.statusRowRight}>
        <button
          type="button"
          className={`${styles.groupingBtn} ${groupingMode === "league" ? styles.active : ""}`}
          onClick={() => onGroupingModeChange("league")}
        >
          리그별
        </button>
        <button
          type="button"
          className={`${styles.groupingBtn} ${groupingMode === "time" ? styles.active : ""}`}
          onClick={() => onGroupingModeChange("time")}
        >
          시간순
        </button>
      </div>
    </div>
  );
}
