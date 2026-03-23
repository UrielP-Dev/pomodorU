import Database from "@tauri-apps/plugin-sql";
import type { Task } from "../pomodoro/types";
import { SQLITE_DB_PATH } from "./const";

const STORAGE_KEY = "pomodoru-v1";

let dbPromise: Promise<Database> | null = null;

/** El plugin a veces devuelve una fila suelta u objeto; normalizamos a array. */
function asRows<T>(result: unknown): T[] {
  if (Array.isArray(result)) return result as T[];
  if (result === null || result === undefined) return [];
  return [result as T];
}

export async function getDb(): Promise<Database> {
  if (!dbPromise) {
    dbPromise = Database.load(SQLITE_DB_PATH);
  }
  return dbPromise;
}

function rowToTask(r: {
  id: string;
  title: string;
  done: number;
  created_at: string;
}): Task {
  return {
    id: r.id,
    title: r.title,
    done: r.done === 1,
    createdAt: r.created_at,
  };
}

export async function listTasks(): Promise<Task[]> {
  const db = await getDb();
  const raw = await db.select(
    "SELECT id, title, done, created_at FROM tasks ORDER BY datetime(created_at) DESC",
  );
  const rows = asRows<{
    id: string;
    title: string;
    done: number;
    created_at: string;
  }>(raw);
  return rows.map(rowToTask);
}

async function appendLog(
  taskId: string,
  action: string,
  detail: string | null,
): Promise<void> {
  const db = await getDb();
  const at = new Date().toISOString();
  await db.execute(
    "INSERT INTO task_log (task_id, action, at, detail) VALUES ($1, $2, $3, $4)",
    [taskId, action, at, detail],
  );
}

export async function insertTask(task: Task): Promise<void> {
  const db = await getDb();
  const now = new Date().toISOString();
  await db.execute(
    "INSERT INTO tasks (id, title, done, created_at, updated_at) VALUES ($1, $2, $3, $4, $5)",
    [task.id, task.title, task.done ? 1 : 0, task.createdAt, now],
  );
  await appendLog(task.id, "creada", task.title);
}

export async function updateTaskDone(id: string, done: boolean): Promise<void> {
  const db = await getDb();
  const now = new Date().toISOString();
  await db.execute("UPDATE tasks SET done = $1, updated_at = $2 WHERE id = $3", [
    done ? 1 : 0,
    now,
    id,
  ]);
  await appendLog(id, done ? "completada" : "reabierta", null);
}

export async function deleteTask(id: string): Promise<void> {
  const db = await getDb();
  await appendLog(id, "eliminada", null);
  await db.execute("DELETE FROM tasks WHERE id = $1", [id]);
}

export async function deleteAllDoneTasks(): Promise<void> {
  const db = await getDb();
  const raw = await db.select(
    "SELECT id FROM tasks WHERE done = 1",
  );
  const rows = asRows<{ id: string }>(raw);
  for (const r of rows) {
    await appendLog(r.id, "eliminada_completada", null);
  }
  await db.execute("DELETE FROM tasks WHERE done = 1");
}

export interface TaskLogRow {
  id: number;
  task_id: string;
  action: string;
  at: string;
  detail: string | null;
}

export async function listTaskLog(limit = 80): Promise<TaskLogRow[]> {
  const db = await getDb();
  const lim = Math.min(200, Math.max(1, Math.floor(limit)));
  const raw = await db.select(
    `SELECT id, task_id, action, at, detail FROM task_log ORDER BY datetime(at) DESC LIMIT ${lim}`,
  );
  return asRows<TaskLogRow>(raw);
}

/** Migra tareas guardadas en localStorage a SQLite (una sola vez si la tabla está vacía). */
export async function migrateTasksFromLocalStorageIfNeeded(): Promise<void> {
  const db = await getDb();
  const countRaw = await db.select(
    "SELECT COUNT(*) as n FROM tasks",
  );
  const countRows = asRows<{ n: number }>(countRaw);
  const n = Number(countRows[0]?.n ?? 0);
  if (n > 0) return;

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    const parsed = JSON.parse(raw) as { tasks?: Task[] };
    const tasks = parsed.tasks;
    if (!Array.isArray(tasks) || tasks.length === 0) return;

    const now = new Date().toISOString();
    for (const t of tasks) {
      if (!t?.id || !t.title) continue;
      await db.execute(
        "INSERT OR REPLACE INTO tasks (id, title, done, created_at, updated_at) VALUES ($1, $2, $3, $4, $5)",
        [
          t.id,
          t.title,
          t.done ? 1 : 0,
          t.createdAt ?? now,
          now,
        ],
      );
      await appendLog(
        t.id,
        "migrada_desde_localstorage",
        t.title,
      );
    }
  } catch {
    /* noop */
  }

  stripTasksFromPersistedLocalStorage();
}

function stripTasksFromPersistedLocalStorage(): void {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    const parsed = JSON.parse(raw) as Record<string, unknown>;
    delete parsed.tasks;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
  } catch {
    /* noop */
  }
}

/** Fallback en navegador sin Tauri: lee tareas del JSON guardado. */
export function readLegacyTasksFromLocalStorage(): Task[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as { tasks?: Task[] };
    return Array.isArray(parsed.tasks) ? parsed.tasks : [];
  } catch {
    return [];
  }
}
