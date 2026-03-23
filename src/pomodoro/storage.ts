import type { AppPersistedState, Settings, SessionRecord } from "./types";
import { DEFAULT_SETTINGS } from "./types";

const STORAGE_KEY = "pomodoru-v1";

function defaultState(): AppPersistedState {
  return {
    settings: { ...DEFAULT_SETTINGS },
    history: [],
    activeTaskId: null,
    totalWorkSessionsCompleted: 0,
  };
}

export function loadState(): AppPersistedState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState();
    const parsed = JSON.parse(raw) as Partial<AppPersistedState>;
    return {
      settings: { ...DEFAULT_SETTINGS, ...parsed.settings },
      history: Array.isArray(parsed.history) ? parsed.history : [],
      activeTaskId:
        typeof parsed.activeTaskId === "string" || parsed.activeTaskId === null
          ? parsed.activeTaskId
          : null,
      totalWorkSessionsCompleted:
        typeof parsed.totalWorkSessionsCompleted === "number"
          ? parsed.totalWorkSessionsCompleted
          : 0,
    };
  } catch {
    return defaultState();
  }
}

export function saveState(state: AppPersistedState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    /* almacenamiento lleno o modo privado */
  }
}

export function patchSettings(
  prev: Settings,
  patch: Partial<Settings>,
): Settings {
  return { ...prev, ...patch };
}

export function appendHistory(
  history: SessionRecord[],
  entry: SessionRecord,
  max = 500,
): SessionRecord[] {
  const next = [entry, ...history];
  return next.slice(0, max);
}
