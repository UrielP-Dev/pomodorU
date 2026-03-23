import { useState } from "react";
import type { Task } from "../pomodoro/types";
import { TaskLogPanel } from "./TaskLogPanel";

type Props = {
  tasks: Task[];
  tasksReady?: boolean;
  activeTaskId: string | null;
  onSelectTask: (id: string | null) => void;
  onAdd: (title: string) => void | Promise<unknown>;
  onToggle: (id: string) => void | Promise<void>;
  onRemove: (id: string) => void | Promise<void>;
  onClearDone: () => void | Promise<void>;
  taskLogVersion?: number;
};

export function TasksPanel({
  tasks,
  tasksReady = true,
  activeTaskId,
  onSelectTask,
  onAdd,
  onToggle,
  onRemove,
  onClearDone,
  taskLogVersion = 0,
}: Props) {
  const [draft, setDraft] = useState("");

  return (
    <>
    <section className="panel tasks-panel">
      <h2 className="panel-title">Tareas</h2>
      <p className="panel-hint">
        Lista guardada en <strong>SQLite</strong> (registro de acciones abajo).
        El enfoque actual se asocia a la tarea seleccionada.
      </p>
      {!tasksReady ? (
        <p className="panel-hint">Cargando tareas desde la base de datos…</p>
      ) : null}
      <form
        className="task-form"
        onSubmit={(e) => {
          e.preventDefault();
          if (!draft.trim() || !tasksReady) return;
          void Promise.resolve(onAdd(draft)).then(() => setDraft(""));
        }}
      >
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Nueva tarea (episodio, kanji, proyecto...)"
          maxLength={200}
        />
        <button type="submit" className="btn primary" disabled={!tasksReady}>
          Añadir
        </button>
      </form>

      <ul className="task-list">
        {tasks.map((t) => (
          <li key={t.id} className={t.done ? "task done" : "task"}>
            <label className="task-row">
              <input
                type="radio"
                name="active-task"
                checked={activeTaskId === t.id}
                onChange={() => onSelectTask(t.id)}
                disabled={!tasksReady}
              />
              <input
                type="checkbox"
                checked={t.done}
                onChange={() => void Promise.resolve(onToggle(t.id))}
                disabled={!tasksReady}
              />
              <span className="task-title">{t.title}</span>
              <button
                type="button"
                className="btn icon"
                onClick={() => void Promise.resolve(onRemove(t.id))}
                aria-label="Eliminar tarea"
                disabled={!tasksReady}
              >
                ×
              </button>
            </label>
          </li>
        ))}
      </ul>
      {tasks.some((t) => t.done) ? (
        <button
          type="button"
          className="btn ghost small"
          onClick={() => void Promise.resolve(onClearDone())}
          disabled={!tasksReady}
        >
          Limpiar completadas
        </button>
      ) : null}
    </section>
    <TaskLogPanel version={taskLogVersion} />
    </>
  );
}
