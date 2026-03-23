import { useEffect, useState } from "react";
import {
  listTaskLog,
  type TaskLogRow,
} from "../db/taskRepository";

function formatAt(iso: string): string {
  try {
    return new Date(iso).toLocaleString();
  } catch {
    return iso;
  }
}

function actionLabel(action: string): string {
  switch (action) {
    case "creada":
      return "Creada";
    case "completada":
      return "Completada";
    case "reabierta":
      return "Reabierta";
    case "eliminada":
      return "Eliminada";
    case "eliminada_completada":
      return "Limpieza (hecha)";
    case "migrada_desde_localstorage":
      return "Migrada";
    default:
      return action;
  }
}

type Props = {
  version: number;
};

export function TaskLogPanel({ version }: Props) {
  const [rows, setRows] = useState<TaskLogRow[]>([]);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const r = await listTaskLog(100);
        if (!cancelled) {
          setRows(r);
          setError(false);
        }
      } catch {
        if (!cancelled) {
          setRows([]);
          setError(true);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [version]);

  return (
    <section className="panel task-log-panel">
      <h2 className="panel-title">Registro (SQLite)</h2>
      <p className="panel-hint">
        Historial de acciones sobre tus tareas: se guarda en la base de datos
        local de la app.
      </p>
      {error ? (
        <p className="muted">
          No se pudo leer el registro (¿modo solo navegador sin Tauri?).
        </p>
      ) : null}
      <ul className="task-log-list">
        {rows.length === 0 && !error ? (
          <li className="muted">Sin entradas aún.</li>
        ) : (
          rows.map((r) => (
            <li key={r.id} className="task-log-item">
              <span className="task-log-action">{actionLabel(r.action)}</span>
              <span className="task-log-meta">
                <code className="task-log-id">{r.task_id.slice(0, 8)}…</code>
                <span className="muted">{formatAt(r.at)}</span>
              </span>
              {r.detail ? (
                <span className="task-log-detail">{r.detail}</span>
              ) : null}
            </li>
          ))
        )}
      </ul>
    </section>
  );
}
