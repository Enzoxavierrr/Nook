import initSqlJs, { Database, SqlJsStatic } from 'sql.js'
import path from 'path'
import fs from 'fs'
import { app } from 'electron'

// Caminho do arquivo .db no userData do usuário
const DB_PATH = path.join(app.getPath('userData'), 'nook.db')

let db: Database
let SQL: SqlJsStatic

export async function getDatabase(): Promise<Database> {
  if (db) return db

  SQL = await initSqlJs()

  if (fs.existsSync(DB_PATH)) {
    const fileBuffer = fs.readFileSync(DB_PATH)
    db = new SQL.Database(fileBuffer)
  } else {
    db = new SQL.Database()
  }

  return db
}

/** Persiste o banco em disco (chamar após cada mutação) */
export function persistDatabase(): void {
  if (!db) return
  const data = db.export()
  fs.writeFileSync(DB_PATH, Buffer.from(data))
}

export function closeDatabase(): void {
  if (db) {
    persistDatabase()
    db.close()
  }
}
