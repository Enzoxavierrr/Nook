import { getDatabase, persistDatabase } from './database'

export async function runMigrations(): Promise<void> {
  const db = await getDatabase()

  db.run(`
    CREATE TABLE IF NOT EXISTS tasks (
      id             INTEGER PRIMARY KEY AUTOINCREMENT,
      title          TEXT    NOT NULL,
      description    TEXT,
      date           TEXT,
      status         TEXT    NOT NULL DEFAULT 'pending',
      estimated_time INTEGER,
      spent_time     INTEGER NOT NULL DEFAULT 0,
      category       TEXT,
      created_at     TEXT    NOT NULL DEFAULT (datetime('now')),
      updated_at     TEXT    NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS time_sessions (
      id         INTEGER PRIMARY KEY AUTOINCREMENT,
      task_id    INTEGER REFERENCES tasks(id) ON DELETE SET NULL,
      started_at TEXT NOT NULL DEFAULT (datetime('now')),
      ended_at   TEXT
    );

    CREATE TRIGGER IF NOT EXISTS tasks_updated_at
      AFTER UPDATE ON tasks
      BEGIN
        UPDATE tasks SET updated_at = datetime('now') WHERE id = NEW.id;
      END;
  `)

  persistDatabase()
}
