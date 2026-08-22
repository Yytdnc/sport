"use client";

import { formatDateHeading } from "@/lib/scores/utils";
import styles from "./scores.module.css";

interface Props {
  activeDate: string;
  totalCount: number;
  liveCount: number;
  autoRefresh: boolean;
  onAutoRefreshChange: (value: boolean) => void;
}

export default function TopBar({ activeDate, totalCount, liveCount, autoRefresh, onAutoRefreshChange }: Props) {
  return (
    <div className={styles.topBar}>
      <div className={styles.topBarLeft}>
        <span className="title" style={{ fontFamily: "var(--font-display)", fontSize: "1.1rem", fontWeight: 700, color: "var(--text)" }}>
          {formatDateHeading(activeDate)} · 총 {totalCount.toLocaleString("ko-KR")}경기
        </span>
        {liveCount > 0 && (
          <span className={styles.liveBadge}>
            <span className="dot" style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--live-color)" }} />
            LIVE {liveCount}
          </span>
        )}
      </div>
      <div className={styles.topBarRight}>
        <button type="button" className={styles.goalAlertBtn} title="골 알림 (준비 중)">
          <span className="material-symbols-outlined" style={{ fontSize: 16 }}>
            notifications
          </span>
          골 알림
        </button>
        <label className={styles.autoRefreshLabel}>
          <input type="checkbox" checked={autoRefresh} onChange={(e) => onAutoRefreshChange(e.target.checked)} />
          라이브 자동 갱신
        </label>
      </div>
    </div>
  );
}
