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
app.whenReady().then(() => {
  runMigrations()
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
  const db = getDatabase()

  // Tasks
  ipcMain.handle('tasks:getAll', () => {
    return db.prepare('SELECT * FROM tasks ORDER BY date ASC, created_at DESC').all()
  })

  ipcMain.handle('tasks:getById', (_e, id: number) => {
    return db.prepare('SELECT * FROM tasks WHERE id = ?').get(id)
  })

  ipcMain.handle('tasks:create', (_e, input) => {
    const stmt = db.prepare(`
      INSERT INTO tasks (title, description, date, estimated_time, category)
      VALUES (@title, @description, @date, @estimatedTime, @category)
    `)
    const result = stmt.run(input)
    return db.prepare('SELECT * FROM tasks WHERE id = ?').get(result.lastInsertRowid)
  })

  ipcMain.handle('tasks:update', (_e, id: number, input) => {
    const fields = Object.keys(input)
      .map((k) => `${k} = @${k}`)
      .join(', ')
    db.prepare(`UPDATE tasks SET ${fields} WHERE id = @id`).run({ ...input, id })
    return db.prepare('SELECT * FROM tasks WHERE id = ?').get(id)
  })

  ipcMain.handle('tasks:delete', (_e, id: number) => {
    db.prepare('DELETE FROM tasks WHERE id = ?').run(id)
    return { success: true }
  })

  ipcMain.handle('tasks:complete', (_e, id: number) => {
    db.prepare("UPDATE tasks SET status = 'completed' WHERE id = ?").run(id)
    return db.prepare('SELECT * FROM tasks WHERE id = ?').get(id)
  })

  // Time Sessions
  ipcMain.handle('sessions:start', (_e, taskId?: number) => {
    const result = db
      .prepare('INSERT INTO time_sessions (task_id) VALUES (?)')
      .run(taskId ?? null)
    return db.prepare('SELECT * FROM time_sessions WHERE id = ?').get(result.lastInsertRowid)
  })

  ipcMain.handle('sessions:end', (_e, sessionId: number) => {
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
  })

  ipcMain.handle('sessions:getByTask', (_e, taskId: number) => {
    return db.prepare('SELECT * FROM time_sessions WHERE task_id = ? ORDER BY started_at DESC').all(taskId)
  })

  // Notifications
  ipcMain.handle('notifications:schedule', (_e, taskId: number) => {
    const task = db.prepare('SELECT * FROM tasks WHERE id = ?').get(taskId) as any
    if (!task) return

    new Notification({
      title: '📌 Nook — Lembrete',
      body: `Amanhã você tem: "${task.title}"`,
    }).show()
  })
}
