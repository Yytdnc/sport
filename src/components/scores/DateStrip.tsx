"use client";

import { buildDateStrip } from "@/lib/scores/utils";
import styles from "./scores.module.css";

interface Props {
  activeDate: string;
  onChange: (date: string) => void;
}

export default function DateStrip({ activeDate, onChange }: Props) {
  const days = buildDateStrip(activeDate, 5, 5);

  return (
    <div className={styles.dateStrip}>
      {days.map((d) => (
        <button
          key={d.dateISO}
          type="button"
          className={`${styles.dateCell} ${d.isToday ? styles.today : ""} ${d.dateISO === activeDate ? styles.active : ""}`}
          onClick={() => onChange(d.dateISO)}
        >
          <span className={styles.weekday}>{d.isToday ? "오늘" : d.weekday}</span>
          <span className={styles.day}>{d.dayLabel}</span>
        </button>
      ))}
    </div>
  );
}
