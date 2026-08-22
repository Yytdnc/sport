import type { Match } from "@/lib/types";

const KST = "Asia/Seoul";
const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"];

export function todayISO(): string {
  return new Date().toLocaleDateString("sv-SE", { timeZone: KST });
}

export function isoDateOf(isoTimestamp: string): string {
  return new Date(isoTimestamp).toLocaleDateString("sv-SE", { timeZone: KST });
}

// A "YYYY-MM-DD" string has no inherent timezone — parsing it into a Date
// and reading it back with LOCAL getters (getDate/getMonth/getDay) silently
// reflects the RUNTIME's local timezone, not the calendar date the string
// names. That previously showed the wrong (often previous) day whenever the
// server ran outside KST, and could disagree with the browser's own local
// timezone, which is exactly what causes a hydration mismatch. Anchoring
// with Date.UTC() and reading back with UTC getters sidesteps this entirely
// — the components round-trip exactly regardless of runtime timezone.
function parseISOToUTCDate(dateISO: string): Date {
  const [year, month, day] = dateISO.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day));
}

export function addDaysISO(dateISO: string, days: number): string {
  const d = parseISOToUTCDate(dateISO);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

export function filterMatchesByDate(matches: Match[], dateISO: string): Match[] {
  return matches.filter((m) => m.kickoffAt && isoDateOf(m.kickoffAt) === dateISO);
}

export function formatDateHeading(dateISO: string): string {
  const d = parseISOToUTCDate(dateISO);
  const month = d.getUTCMonth() + 1;
  const day = d.getUTCDate();
  const weekday = WEEKDAYS[d.getUTCDay()];
  return `${month}월 ${day}일(${weekday})`;
}

export function formatDateHeadingLong(dateISO: string): string {
  const d = parseISOToUTCDate(dateISO);
  const weekday = WEEKDAYS[d.getUTCDay()];
  return `${d.getUTCFullYear()}년${String(d.getUTCMonth() + 1).padStart(2, "0")}월${String(d.getUTCDate()).padStart(2, "0")}일(${weekday})`;
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
    const d = parseISOToUTCDate(dateISO);
    days.push({
      dateISO,
      weekday: WEEKDAYS[d.getUTCDay()],
      dayLabel: `${d.getUTCMonth() + 1}/${d.getUTCDate()}`,
      isToday: dateISO === today,
    });
  }
  return days;
}
