export type SessionMode = "work" | "shortBreak" | "longBreak";

export type ThemeMode = "kawaii" | "light" | "dark" | "custom";

export type AmbientPreset = "off" | "rain" | "cafe" | "forest";

export interface Settings {
  workMinutes: number;
  shortBreakMinutes: number;
  longBreakMinutes: number;
  theme: ThemeMode;
  customAccent: string;
  customSurface: string;
  wallpaperPath: string | null;
  wallpaperUrl: string | null;
  notificationsEnabled: boolean;
  alertSoundEnabled: boolean;
  ambientEnabled: boolean;
  ambientPreset: AmbientPreset;
  volume: number;
}

export interface Task {
  id: string;
  title: string;
  done: boolean;
  createdAt: string;
}

export interface SessionRecord {
  id: string;
  endedAt: string;
  taskId: string | null;
  taskTitle: string | null;
  durationSeconds: number;
  mode: SessionMode;
}

export interface AppPersistedState {
  settings: Settings;
  /** Las tareas viven en SQLite; este campo solo existía en datos antiguos (migración). */
  tasks?: Task[];
  history: SessionRecord[];
  activeTaskId: string | null;
  totalWorkSessionsCompleted: number;
}

export const DEFAULT_SETTINGS: Settings = {
  workMinutes: 25,
  shortBreakMinutes: 5,
  longBreakMinutes: 15,
  theme: "kawaii",
  customAccent: "#ff6b9d",
  customSurface: "#fff0f5",
  wallpaperPath: null,
  wallpaperUrl: null,
  notificationsEnabled: true,
  alertSoundEnabled: true,
  ambientEnabled: false,
  ambientPreset: "rain",
  volume: 0.35,
};
