import type { SessionMode, Settings } from "./types";

export function durationSecondsForMode(mode: SessionMode, s: Settings): number {
  switch (mode) {
    case "work":
      return s.workMinutes * 60;
    case "shortBreak":
      return s.shortBreakMinutes * 60;
    case "longBreak":
      return s.longBreakMinutes * 60;
    default:
      return s.workMinutes * 60;
  }
}
