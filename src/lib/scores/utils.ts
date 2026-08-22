import type { Match } from "@/lib/types";

const KST = "Asia/Seoul";
const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"];

export function todayISO(): string {
  return new Date().toLocaleDateString("sv-SE", { timeZone: KST });
}

export function isoDateOf(isoTimestamp: string): string {
  return new Date(isoTimestamp).toLocaleDateString("sv-SE", { timeZone: KST });
}

export function addDaysISO(dateISO: string, days: number): string {
  const d = new Date(`${dateISO}T00:00:00+09:00`);
  d.setDate(d.getDate() + days);
  return d.toLocaleDateString("sv-SE", { timeZone: KST });
}

export function filterMatchesByDate(matches: Match[], dateISO: string): Match[] {
  return matches.filter((m) => m.kickoffAt && isoDateOf(m.kickoffAt) === dateISO);
}

export function formatDateHeading(dateISO: string): string {
  const d = new Date(`${dateISO}T00:00:00+09:00`);
  const month = d.getMonth() + 1;
  const day = d.getDate();
  const weekday = WEEKDAYS[d.getDay()];
  return `${month}월 ${day}일(${weekday})`;
}

export function formatDateHeadingLong(dateISO: string): string {
  const d = new Date(`${dateISO}T00:00:00+09:00`);
  const weekday = WEEKDAYS[d.getDay()];
  return `${d.getFullYear()}년${String(d.getMonth() + 1).padStart(2, "0")}월${String(d.getDate()).padStart(2, "0")}일(${weekday})`;
}

export interface DateStripDay {
  dateISO: string;
  weekday: string;
  dayLabel: string;
  isToday: boolean;
}

export function buildDateStrip(centerISO: string, before = 5, after = 5): DateStripDay[] {
  const today = todayISO();
  const days: DateStripDay[] = [];
  for (let offset = -before; offset <= after; offset++) {
    const dateISO = addDaysISO(centerISO, offset);
    const d = new Date(`${dateISO}T00:00:00+09:00`);
    days.push({
      dateISO,
      weekday: WEEKDAYS[d.getDay()],
      dayLabel: `${d.getMonth() + 1}/${d.getDate()}`,
      isToday: dateISO === today,
    });
  }
  return days;
}
