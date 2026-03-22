import type { SessionRecord } from "../pomodoro/types";

export function countTodayWorkSessions(history: SessionRecord[]): number {
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  return history.filter(
    (h) => h.mode === "work" && new Date(h.endedAt) >= start,
  ).length;
}

export function minutesTodayFocused(history: SessionRecord[]): number {
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  const sec = history
    .filter((h) => h.mode === "work" && new Date(h.endedAt) >= start)
    .reduce((a, h) => a + h.durationSeconds, 0);
  return Math.round(sec / 60);
}

/** Pomodoros hasta el próximo descanso largo (cada 4 bloques de trabajo). */
export function pomodorosUntilLongBreak(totalWorkCompleted: number): number {
  const r = totalWorkCompleted % 4;
  return r === 0 ? 4 : 4 - r;
}
