import { useState } from "react";
import type { Task } from "../pomodoro/types";

type Props = {
  tasks: Task[];
  activeTaskId: string | null;
  onSelectTask: (id: string | null) => void;
  onAdd: (title: string) => void;
  onToggle: (id: string) => void;
  onRemove: (id: string) => void;
  onClearDone: () => void;
};

export function TasksPanel({
  tasks,
  activeTaskId,
  onSelectTask,
  onAdd,
  onToggle,
  onRemove,
  onClearDone,
}: Props) {
  const [draft, setDraft] = useState("");

  return (
    <section className="panel tasks-panel">
      <h2 className="panel-title">Tareas</h2>
      <p className="panel-hint">
        El enfoque actual se asocia a la tarea seleccionada (ideal para maratones
        de anime o estudio).
      </p>
      <form
        className="task-form"
        onSubmit={(e) => {
          e.preventDefault();
          if (!draft.trim()) return;
          onAdd(draft);
          setDraft("");
        }}
      >
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Nueva tarea (episodio, kanji, proyecto...)"
          maxLength={200}
        />
        <button type="submit" className="btn primary">
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
              />
              <input
                type="checkbox"
                checked={t.done}
                onChange={() => onToggle(t.id)}
              />
              <span className="task-title">{t.title}</span>
              <button
                type="button"
                className="btn icon"
                onClick={() => onRemove(t.id)}
                aria-label="Eliminar tarea"
              >
                ×
              </button>
            </label>
          </li>
        ))}
      </ul>
      {tasks.some((t) => t.done) ? (
        <button type="button" className="btn ghost small" onClick={onClearDone}>
          Limpiar completadas
        </button>
      ) : null}
    </section>
  );
}
