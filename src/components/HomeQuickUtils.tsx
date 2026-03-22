import { useMemo, useState, type FormEvent } from "react";
import type { AmbientPreset, Settings } from "../pomodoro/types";
import {
  IconBell,
  IconChart,
  IconClock,
  IconGear,
  IconHeart,
  IconMusic,
  IconStar,
  IconTasks,
} from "../ui/icons";
import {
  countTodayWorkSessions,
  minutesTodayFocused,
  pomodorosUntilLongBreak,
} from "../utils/stats";
import type { SessionRecord, Task } from "../pomodoro/types";

const PRESETS = [
  { id: "classic", label: "Clásico", emoji: "🍓", work: 25, short: 5, long: 15 },
  { id: "short", label: "Corto", emoji: "🌸", work: 15, short: 3, long: 9 },
  { id: "deep", label: "52/17", emoji: "🍵", work: 52, short: 17, long: 30 },
  { id: "study", label: "Estudio", emoji: "📚", work: 45, short: 10, long: 20 },
] as const;

const AMBIENT_QUICK: { id: AmbientPreset; emoji: string; label: string }[] = [
  { id: "off", emoji: "🔇", label: "Off" },
  { id: "rain", emoji: "🌧️", label: "Lluvia" },
  { id: "cafe", emoji: "☕", label: "Café" },
  { id: "forest", emoji: "🌿", label: "Bosque" },
];

type Props = {
  settings: Settings;
  onChange: (patch: Partial<Settings>) => void;
  history: SessionRecord[];
  running: boolean;
  tasks: Task[];
  activeTaskId: string | null;
  onSelectTask: (id: string | null) => void;
  onQuickAddTask: (title: string) => void;
  totalWorkSessionsCompleted: number;
  onOpenSettings: () => void;
  onOpenStats: () => void;
};

export function HomeQuickUtils({
  settings,
  onChange,
  history,
  running,
  tasks,
  activeTaskId,
  onSelectTask,
  onQuickAddTask,
  totalWorkSessionsCompleted,
  onOpenSettings,
  onOpenStats,
}: Props) {
  const [draft, setDraft] = useState("");
  const todayCount = useMemo(
    () => countTodayWorkSessions(history),
    [history],
  );
  const todayMin = useMemo(() => minutesTodayFocused(history), [history]);
  const untilLong = pomodorosUntilLongBreak(totalWorkSessionsCompleted);

  function applyPreset(
    work: number,
    short: number,
    long: number,
  ): void {
    if (running) return;
    onChange({ workMinutes: work, shortBreakMinutes: short, longBreakMinutes: long });
  }

  function submitTask(e: FormEvent): void {
    e.preventDefault();
    if (!draft.trim()) return;
    onQuickAddTask(draft.trim());
    setDraft("");
  }

  const activeTasks = tasks.filter((t) => !t.done).slice(0, 6);

  return (
    <aside className="home-utils" aria-label="Utilidades del temporizador">
      <div className="home-utils-card kawaii-card">
        <h3 className="home-utils-title">
          <IconStar className="icon-inline" /> Hoy
        </h3>
        <div className="home-stats-row">
          <div className="home-stat-pill">
            <span className="home-stat-num">{todayCount}</span>
            <span className="home-stat-label">pomodoros</span>
          </div>
          <div className="home-stat-pill">
            <span className="home-stat-num">{todayMin}</span>
            <span className="home-stat-label">min foco</span>
          </div>
        </div>
        <p className="home-utils-hint">
          <IconHeart className="icon-inline" /> Próximo descanso largo
          en ~{untilLong} bloque{untilLong === 1 ? "" : "s"} de estudio
        </p>
      </div>

      <div className="home-utils-card kawaii-card">
        <h3 className="home-utils-title">
          <IconClock className="icon-inline" /> Presets
        </h3>
        <p className="home-utils-sub">
          {running
            ? "Pausa el timer para cambiar duraciones ✿"
            : "Toca una receta para tus minutos"}
        </p>
        <div className="preset-grid">
          {PRESETS.map((p) => {
            const active =
              settings.workMinutes === p.work &&
              settings.shortBreakMinutes === p.short &&
              settings.longBreakMinutes === p.long;
            return (
              <button
                key={p.id}
                type="button"
                className={`preset-btn ${active ? "active" : ""}`}
                disabled={running}
                onClick={() => applyPreset(p.work, p.short, p.long)}
              >
                <span className="preset-emoji" aria-hidden>
                  {p.emoji}
                </span>
                <span className="preset-name">{p.label}</span>
                <span className="preset-times">
                  {p.work}/{p.short}/{p.long}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="home-utils-card kawaii-card">
        <h3 className="home-utils-title">
          <IconTasks className="icon-inline" /> Tarea rápida
        </h3>
        <form className="home-quick-task" onSubmit={submitTask}>
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="¿Qué estudias ahora?"
            maxLength={120}
            aria-label="Nueva tarea rápida"
          />
          <button type="submit" className="btn btn-kawaii primary">
            Añadir
          </button>
        </form>
        {activeTasks.length > 0 ? (
          <div className="home-task-chips">
            {activeTasks.map((t) => (
              <button
                key={t.id}
                type="button"
                className={`task-chip ${activeTaskId === t.id ? "active" : ""}`}
                onClick={() => onSelectTask(t.id)}
              >
                {t.title}
              </button>
            ))}
          </div>
        ) : (
          <p className="home-utils-sub muted">Sin tareas activas aún</p>
        )}
      </div>

      <div className="home-utils-card kawaii-card home-utils-sound">
        <h3 className="home-utils-title">
          <IconMusic className="icon-inline" /> Sonido
        </h3>
        <label className="toggle-row">
          <IconBell className="icon-inline" />
          <span>Notificaciones</span>
          <button
            type="button"
            className={`toggle-pill ${settings.notificationsEnabled ? "on" : ""}`}
            onClick={() =>
              onChange({ notificationsEnabled: !settings.notificationsEnabled })
            }
            aria-pressed={settings.notificationsEnabled}
          >
            {settings.notificationsEnabled ? "on" : "off"}
          </button>
        </label>
        <label className="toggle-row">
          <IconMusic className="icon-inline" />
          <span>Ambiente</span>
          <button
            type="button"
            className={`toggle-pill ${settings.ambientEnabled ? "on" : ""}`}
            onClick={() =>
              onChange({ ambientEnabled: !settings.ambientEnabled })
            }
            aria-pressed={settings.ambientEnabled}
          >
            {settings.ambientEnabled ? "on" : "off"}
          </button>
        </label>
        <div className="ambient-chips" role="group" aria-label="Tipo de ambiente">
          {AMBIENT_QUICK.map((a) => (
            <button
              key={a.id}
              type="button"
              className={`ambient-chip ${settings.ambientPreset === a.id ? "active" : ""}`}
              onClick={() => onChange({ ambientPreset: a.id })}
              title={a.label}
            >
              <span aria-hidden>{a.emoji}</span>
            </button>
          ))}
        </div>
        <label className="volume-row">
          <span>Volumen</span>
          <input
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={settings.volume}
            onChange={(e) =>
              onChange({ volume: Number(e.target.value) })
            }
          />
        </label>
      </div>

      <div className="home-utils-actions">
        <button
          type="button"
          className="btn btn-kawaii ghost home-link-btn"
          onClick={onOpenStats}
        >
          <IconChart className="icon-inline" /> Ver estadísticas
        </button>
        <button
          type="button"
          className="btn btn-kawaii ghost home-link-btn"
          onClick={onOpenSettings}
        >
          <IconGear className="icon-inline" /> Más ajustes
        </button>
      </div>
    </aside>
  );
}
