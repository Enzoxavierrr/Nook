import { app, BrowserWindow, ipcMain, Notification } from 'electron'
import path from 'path'
import { getDatabase, closeDatabase } from './db/database'
import { runMigrations } from './db/schema'

// ─── Window ────────────────────────────────────────────────
function createWindow() {
  const win = new BrowserWindow({
    width: 1100,
    height: 720,
    minWidth: 800,
    minHeight: 600,
    titleBarStyle: 'hiddenInset', // macOS native feel
    backgroundColor: '#0f0f0f',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  })

  if (process.env.VITE_DEV_SERVER_URL) {
    win.loadURL(process.env.VITE_DEV_SERVER_URL)
  } else {
    win.loadFile(path.join(__dirname, '../dist/index.html'))
  }
}

// ─── App lifecycle ──────────────────────────────────────────
app.whenReady().then(async () => {
  await runMigrations()
  registerIpcHandlers()
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  closeDatabase()
  if (process.platform !== 'darwin') app.quit()
})

// ─── IPC Handlers ───────────────────────────────────────────
function registerIpcHandlers() {
  // Tasks
  ipcMain.handle('tasks:getAll', async () => {
    try {
      const db = await getDatabase()
      const result = db.prepare('SELECT * FROM tasks ORDER BY date ASC, created_at DESC').all()
      return result
    } catch (error) {
      console.error('Error fetching tasks:', error)
      throw error
    }
  })

  ipcMain.handle('tasks:getById', async (_e, id: number) => {
    try {
      const db = await getDatabase()
      return db.prepare('SELECT * FROM tasks WHERE id = ?').get([id])
    } catch (error) {
      console.error(`Error fetching task ${id}:`, error)
      throw error
    }
  })

  ipcMain.handle('tasks:create', async (_e, input) => {
    try {
      const db = await getDatabase()
      const stmt = db.prepare(`
        INSERT INTO tasks (title, description, date, estimated_time, category)
        VALUES (@title, @description, @date, @estimatedTime, @category)
      `)
      const result = stmt.bind(input).step()
      const id = (db as any).exec('SELECT last_insert_rowid() as id')[0]?.values[0]?.[0]

      persistDatabase()
      return db.prepare('SELECT * FROM tasks WHERE id = ?').get([id])
    } catch (error) {
      console.error('Error creating task:', error)
      throw error
    }
  })

  ipcMain.handle('tasks:update', async (_e, id: number, input) => {
    try {
      const db = await getDatabase()
      const fields = Object.keys(input)
        .map((k) => `${k} = @${k}`)
        .join(', ')
      db.prepare(`UPDATE tasks SET ${fields} WHERE id = @id`).bind({ ...input, id }).step()

      persistDatabase()
      return db.prepare('SELECT * FROM tasks WHERE id = ?').get([id])
    } catch (error) {
      console.error(`Error updating task ${id}:`, error)
      throw error
    }
  })

  ipcMain.handle('tasks:delete', async (_e, id: number) => {
    try {
      const db = await getDatabase()
      db.prepare('DELETE FROM tasks WHERE id = ?').bind([id]).step()

      persistDatabase()
      return { success: true }
    } catch (error) {
      console.error(`Error deleting task ${id}:`, error)
      throw error
    }
  })

  ipcMain.handle('tasks:complete', async (_e, id: number) => {
    try {
      const db = await getDatabase()
      db.prepare("UPDATE tasks SET status = 'completed' WHERE id = ?").bind([id]).step()

      persistDatabase()
      return db.prepare('SELECT * FROM tasks WHERE id = ?').get([id])
    } catch (error) {
      console.error(`Error completing task ${id}:`, error)
      throw error
    }
  })

  // Time Sessions
  ipcMain.handle('sessions:start', async (_e, taskId?: number) => {
    try {
      const db = await getDatabase()
      const result = db
        .prepare('INSERT INTO time_sessions (task_id) VALUES (?)')
        .bind([taskId ?? null]).step()
      const sessionId = (db as any).exec('SELECT last_insert_rowid() as id')[0]?.values[0]?.[0]

      persistDatabase()
      return db.prepare('SELECT * FROM time_sessions WHERE id = ?').get([sessionId])
    } catch (error) {
      console.error('Error starting session:', error)
      throw error
    }
  })

  ipcMain.handle('sessions:end', async (_e, sessionId: number) => {
    try {
      const db = await getDatabase()
      db.prepare("UPDATE time_sessions SET ended_at = datetime('now') WHERE id = ?").bind([sessionId]).step()

      // Atualiza o tempo gasto na tarefa vinculada
      db.prepare(`
        UPDATE tasks
        SET spent_time = (
          SELECT COALESCE(SUM(CAST((julianday(ended_at) - julianday(started_at)) * 1440 AS INTEGER)), 0)
          FROM time_sessions
          WHERE task_id = tasks.id AND ended_at IS NOT NULL
        )
        WHERE id = (SELECT task_id FROM time_sessions WHERE id = ?)
      `).bind([sessionId]).step()

      persistDatabase()
      return db.prepare('SELECT * FROM time_sessions WHERE id = ?').get([sessionId])
    } catch (error) {
      console.error(`Error ending session ${sessionId}:`, error)
      throw error
    }
  })

  ipcMain.handle('sessions:getByTask', async (_e, taskId: number) => {
    try {
      const db = await getDatabase()
      return db.prepare('SELECT * FROM time_sessions WHERE task_id = ? ORDER BY started_at DESC').all([taskId])
    } catch (error) {
      console.error(`Error fetching sessions for task ${taskId}:`, error)
      throw error
    }
  })

  // Notifications
  ipcMain.handle('notifications:schedule', async (_e, taskId: number) => {
    try {
      const db = await getDatabase()
      const rows = db.prepare('SELECT * FROM tasks WHERE id = ?').getAsObject(taskId)
      if (!rows || rows.length === 0) return

      const task = rows[0] as any
      new Notification({
        title: '📌 Nook — Lembrete',
        body: `Amanhã você tem: "${task.title}"`,
      }).show()
    } catch (error) {
      console.error(`Error scheduling notification for task ${taskId}:`, error)
      throw error
    }
  })
}
