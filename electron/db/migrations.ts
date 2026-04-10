import { getDatabase } from './database'
import Database from 'better-sqlite3'

const MIGRATIONS: Array<{
  version: number
  name: string
  up: (db: Database.Database) => void
}> = [
  {
    version: 1,
    name: 'create_tasks_and_sessions_tables',
    up: (db: Database.Database) => {
      db.exec(`
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
    },
  },
]

export function runMigrations(): void {
  const db = getDatabase()

  // Criar tabela de migrations se não existir
  db.exec(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      version INTEGER PRIMARY KEY,
      name    TEXT NOT NULL,
      run_at  TEXT NOT NULL DEFAULT (datetime('now'))
    )
  `)

  // Executar migrations pendentes
  for (const migration of MIGRATIONS) {
    // Verificar se migration já foi executada
    const existing = db
      .prepare('SELECT version FROM schema_migrations WHERE version = ?')
      .get(migration.version)

    if (!existing) {
      console.log(`📦 Running migration ${migration.version}: ${migration.name}`)
      migration.up(db)

      // Registrar migration como executada
      db.prepare('INSERT INTO schema_migrations (version, name) VALUES (?, ?)').run(
        migration.version,
        migration.name,
      )
    }
  }
}
