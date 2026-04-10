import path from 'path'
import { app } from 'electron'
import Database from 'better-sqlite3'

// Caminho do arquivo .db no userData do usuário
const DB_PATH = path.join(app.getPath('userData'), 'nook.db')

let db: Database.Database | null = null

export function getDatabase(): Database.Database {
  if (db) return db

  try {
    db = new Database(DB_PATH)
    // Habilita foreign keys por padrão
    db.pragma('foreign_keys = ON')
    return db
  } catch (error) {
    console.error('Erro ao carregar banco de dados:', error)
    throw new Error('Falha ao inicializar banco de dados: ' + (error as any).message)
  }
}

/** Executa um statement SQL */
export function execute(sql: string, params?: any[]): any {
  if (!db) {
    db = getDatabase()
  }
  try {
    const stmt = db.prepare(sql)
    return params ? stmt.run(params) : stmt.run()
  } catch (error) {
    console.error('Erro ao executar SQL:', error)
    throw error
  }
}

/** Consulta dados (retorna array) */
export function query(sql: string, params?: any[]): any[] {
  if (!db) {
    db = getDatabase()
  }
  try {
    const stmt = db.prepare(sql)
    return params ? stmt.all(params) : stmt.all()
  } catch (error) {
    console.error('Erro ao consultar banco:', error)
    throw error
  }
}

/** Consulta um único registro */
export function queryOne(sql: string, params?: any[]): any {
  if (!db) {
    db = getDatabase()
  }
  try {
    const stmt = db.prepare(sql)
    return params ? stmt.get(params) : stmt.get()
  } catch (error) {
    console.error('Erro ao consultar banco:', error)
    throw error
  }
}

export function closeDatabase(): void {
  if (db) {
    db.close()
    db = null
  }
}
