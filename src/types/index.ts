// ============================================================
// Types — Nook
// Definições de tipos compartilhados entre renderer e electron
// ============================================================

export type TaskStatus = 'pending' | 'completed'

export interface Task {
  id: number
  title: string
  description?: string
  date?: string         // ISO date string: "2026-04-08"
  status: TaskStatus
  estimatedTime?: number  // em minutos
  spentTime: number       // em minutos (acumulado pelas sessões)
  category?: string
  createdAt: string
  updatedAt: string
}

export interface TimeSession {
  id: number
  taskId?: number       // opcional: timer sem tarefa vinculada
  startedAt: string     // ISO datetime
  endedAt?: string      // ISO datetime
}

export interface CreateTaskInput {
  title: string
  description?: string
  date?: string
  estimatedTime?: number
  category?: string
}

export interface UpdateTaskInput extends Partial<CreateTaskInput> {
  status?: TaskStatus
}
