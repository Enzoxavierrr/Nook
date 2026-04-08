import { contextBridge, ipcRenderer } from 'electron'
import type { CreateTaskInput, UpdateTaskInput } from '../src/types'

// Expõe uma API segura para o renderer via window.nook
contextBridge.exposeInMainWorld('nook', {
  // Tasks
  getTasks: () => ipcRenderer.invoke('tasks:getAll'),
  getTaskById: (id: number) => ipcRenderer.invoke('tasks:getById', id),
  createTask: (input: CreateTaskInput) => ipcRenderer.invoke('tasks:create', input),
  updateTask: (id: number, input: UpdateTaskInput) => ipcRenderer.invoke('tasks:update', id, input),
  deleteTask: (id: number) => ipcRenderer.invoke('tasks:delete', id),
  completeTask: (id: number) => ipcRenderer.invoke('tasks:complete', id),

  // Timer / Time Sessions
  startSession: (taskId?: number) => ipcRenderer.invoke('sessions:start', taskId),
  endSession: (sessionId: number) => ipcRenderer.invoke('sessions:end', sessionId),
  getSessions: (taskId: number) => ipcRenderer.invoke('sessions:getByTask', taskId),

  // Notifications
  scheduleReminder: (taskId: number) => ipcRenderer.invoke('notifications:schedule', taskId),
})
