export type AppTab = "timer" | "tasks" | "history" | "stats" | "settings";

export const APP_TABS: { id: AppTab; label: string }[] = [
  { id: "timer", label: "⏱ Temporizador" },
  { id: "tasks", label: "✿ Tareas" },
  { id: "history", label: "☆ Historial" },
  { id: "stats", label: "♡ Stats" },
  { id: "settings", label: "⚙ Ajustes" },
];
