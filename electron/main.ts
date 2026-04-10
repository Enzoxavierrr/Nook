import { app, BrowserWindow, ipcMain, Notification } from 'electron'
import path from 'path'
import { getDatabase, closeDatabase } from './db/database'
import { runMigrations } from './db/migrations'

// Define app name
app.setName('Nook')

// Prevenir múltiplas instâncias
const gotTheLock = app.requestSingleInstanceLock()
if (!gotTheLock) {
  app.quit()
}

let mainWindow: BrowserWindow | null = null

// ─── Window ────────────────────────────────────────────────
function createWindow() {
  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.show()
    mainWindow.focus()
    return
  }

  const iconPath = path.join(__dirname, '../public/icon.png')

  // macOS: setar ícone no dock
  if (process.platform === 'darwin' && app.dock) {
    app.dock.setIcon(iconPath)
  }

  mainWindow = new BrowserWindow({
    width: 1100,
    height: 720,
    minWidth: 800,
    minHeight: 600,
    show: false,
    title: 'Nook',
    titleBarStyle: 'hiddenInset', // macOS native feel
    backgroundColor: '#0f0f0f',
    icon: iconPath,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  })

  if (process.env.VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(process.env.VITE_DEV_SERVER_URL)
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'))
  }

  mainWindow.setTitle('Nook')

  mainWindow.show()

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

// ─── App lifecycle ──────────────────────────────────────────
app.whenReady().then(() => {
  runMigrations()
  registerIpcHandlers()
  createWindow()

  app.on('activate', () => {
    createWindow()
  })

  app.on('second-instance', () => {
    createWindow()
  })
})

app.on('window-all-closed', () => {
  closeDatabase()
  if (process.platform !== 'darwin') app.quit()
})

// ─── IPC Handlers ───────────────────────────────────────────
function registerIpcHandlers() {
  // Tasks
  ipcMain.handle('tasks:getAll', () => {
    try {
      const db = getDatabase()
      return db.prepare('SELECT * FROM tasks ORDER BY date ASC, created_at DESC').all()
    } catch (error) {
      console.error('Erro ao buscar tarefas:', error)
      throw error
    }
  })

  ipcMain.handle('tasks:getById', (_e, id: number) => {
    try {
      const db = getDatabase()
      return db.prepare('SELECT * FROM tasks WHERE id = ?').get(id)
    } catch (error) {
      console.error(`Erro ao buscar tarefa ${id}:`, error)
      throw error
    }
  })

  ipcMain.handle('tasks:create', (_e, input) => {
    try {
      const db = getDatabase()
      const result = db.prepare(`
        INSERT INTO tasks (title, description, date, estimated_time, category)
        VALUES (?, ?, ?, ?, ?)
      `).run(
        input.title,
        input.description,
        input.date,
        input.estimatedTime,
        input.category,
      )

      return db.prepare('SELECT * FROM tasks WHERE id = ?').get(result.lastInsertRowid)
    } catch (error) {
      console.error('Erro ao criar tarefa:', error)
      throw error
    }
  })

  ipcMain.handle('tasks:update', (_e, id: number, input) => {
    try {
      const db = getDatabase()
      const fields = Object.keys(input)
        .map((k) => `${k} = ?`)
        .join(', ')
      const values = Object.values(input)

      db.prepare(`UPDATE tasks SET ${fields} WHERE id = ?`).run(...values, id)
      return db.prepare('SELECT * FROM tasks WHERE id = ?').get(id)
    } catch (error) {
      console.error(`Erro ao atualizar tarefa ${id}:`, error)
      throw error
    }
  })

  ipcMain.handle('tasks:delete', (_e, id: number) => {
    try {
      const db = getDatabase()
      db.prepare('DELETE FROM tasks WHERE id = ?').run(id)
      return { success: true }
    } catch (error) {
      console.error(`Erro ao deletar tarefa ${id}:`, error)
      throw error
    }
  })

  ipcMain.handle('tasks:complete', (_e, id: number) => {
    try {
      const db = getDatabase()
      db.prepare("UPDATE tasks SET status = 'completed' WHERE id = ?").run(id)
      return db.prepare('SELECT * FROM tasks WHERE id = ?').get(id)
    } catch (error) {
      console.error(`Erro ao completar tarefa ${id}:`, error)
      throw error
    }
  })

  // Time Sessions
  ipcMain.handle('sessions:start', (_e, taskId?: number) => {
    try {
      const db = getDatabase()
      const result = db
        .prepare('INSERT INTO time_sessions (task_id) VALUES (?)')
        .run(taskId ?? null)

      return db.prepare('SELECT * FROM time_sessions WHERE id = ?').get(result.lastInsertRowid)
    } catch (error) {
      console.error('Erro ao iniciar sessão:', error)
      throw error
    }
  })

  ipcMain.handle('sessions:end', (_e, sessionId: number) => {
    try {
      const db = getDatabase()
      db.prepare("UPDATE time_sessions SET ended_at = datetime('now') WHERE id = ?").run(sessionId)

      // Atualiza o tempo gasto na tarefa vinculada
      db.prepare(`
        UPDATE tasks
        SET spent_time = (
          SELECT COALESCE(SUM(CAST((julianday(ended_at) - julianday(started_at)) * 1440 AS INTEGER)), 0)
          FROM time_sessions
          WHERE task_id = tasks.id AND ended_at IS NOT NULL
        )
        WHERE id = (SELECT task_id FROM time_sessions WHERE id = ?)
      `).run(sessionId)

      return db.prepare('SELECT * FROM time_sessions WHERE id = ?').get(sessionId)
    } catch (error) {
      console.error(`Erro ao finalizar sessão ${sessionId}:`, error)
      throw error
    }
  })

  ipcMain.handle('sessions:getByTask', (_e, taskId: number) => {
    try {
      const db = getDatabase()
      return db.prepare('SELECT * FROM time_sessions WHERE task_id = ? ORDER BY started_at DESC').all(taskId)
    } catch (error) {
      console.error(`Erro ao buscar sessões da tarefa ${taskId}:`, error)
      throw error
    }
  })

  // Notifications
  ipcMain.handle('notifications:schedule', (_e, taskId: number) => {
    try {
      const db = getDatabase()
      const task = db.prepare('SELECT * FROM tasks WHERE id = ?').get(taskId)

      if (!task) return

      new Notification({
        title: '📌 Nook — Lembrete',
        body: `Amanhã você tem: "${task.title}"`,
      }).show()
    } catch (error) {
      console.error(`Erro ao agendar notificação para tarefa ${taskId}:`, error)
      throw error
    }
  })
}
