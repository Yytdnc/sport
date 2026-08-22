"use client";

import { SPORT_META, SPORT_ORDER, type SportId } from "@/lib/types";
import styles from "./scores.module.css";

interface Props {
  activeSport: SportId;
  onChange: (sport: SportId) => void;
  counts: Record<SportId, number>;
}

export default function SportTabs({ activeSport, onChange, counts }: Props) {
  return (
    <div className={styles.sportTabs}>
      {SPORT_ORDER.map((sportId) => {
        const meta = SPORT_META[sportId];
        const count = counts[sportId] ?? 0;
        return (
          <button
            key={sportId}
            type="button"
            className={`${styles.sportTab} ${sportId === activeSport ? styles.active : ""}`}
            onClick={() => onChange(sportId)}
          >
            <span>{meta.icon}</span>
            <span>{meta.label}</span>
            {meta.supported && count > 0 && <span className={styles.count}>{count}</span>}
          </button>
        );
      })}
    </div>
  );
}
