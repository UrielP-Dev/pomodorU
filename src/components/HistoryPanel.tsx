import type { SessionRecord } from "../pomodoro/types";

type Props = {
  history: SessionRecord[];
};

function modeLabel(m: SessionRecord["mode"]): string {
  switch (m) {
    case "work":
      return "Enfoque";
    case "shortBreak":
      return "Descanso corto";
    case "longBreak":
      return "Descanso largo";
    default:
      return m;
  }
}

function formatWhen(iso: string): string {
  try {
    const d = new Date(iso);
    return d.toLocaleString();
  } catch {
    return iso;
  }
}

export function HistoryPanel({ history }: Props) {
  return (
    <section className="panel history-panel">
      <h2 className="panel-title">Historial</h2>
      <p className="panel-hint">
        Registro local de cada fase completada (trabajo y descansos).
      </p>
      <ul className="history-list">
        {history.length === 0 ? (
          <li className="muted">Aún no hay sesiones. ¡Dale al temporizador!</li>
        ) : (
          history.map((h) => (
            <li key={h.id} className="history-item">
              <div>
                <strong>{modeLabel(h.mode)}</strong>
                <span className="muted"> · {Math.round(h.durationSeconds / 60)} min</span>
              </div>
              <div className="history-sub">
                {h.mode === "work" && h.taskTitle ? (
                  <span>Tarea: {h.taskTitle}</span>
                ) : (
                  <span className="muted">—</span>
                )}
                <span className="muted">{formatWhen(h.endedAt)}</span>
              </div>
            </li>
          ))
        )}
      </ul>
    </section>
  );
}
