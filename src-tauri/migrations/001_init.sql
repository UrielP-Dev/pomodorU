CREATE TABLE IF NOT EXISTS tasks (
  id TEXT PRIMARY KEY NOT NULL,
  title TEXT NOT NULL,
  done INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS task_log (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  task_id TEXT NOT NULL,
  action TEXT NOT NULL,
  at TEXT NOT NULL,
  detail TEXT
);

CREATE INDEX IF NOT EXISTS idx_task_log_task ON task_log(task_id);
CREATE INDEX IF NOT EXISTS idx_task_log_at ON task_log(at);
