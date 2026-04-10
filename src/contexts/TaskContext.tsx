/**
 * TaskContext — estado global de tarefas
 * Uma única fonte de verdade para todo o app.
 * Qualquer página que ler/escrever tarefas usa este contexto.
 */
import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useRef,
  type ReactNode,
} from 'react'
import type { Task, CreateTaskInput } from '../types'

interface TaskContextValue {
  tasks: Task[]
  loading: boolean
  fetchTasks: () => Promise<void>
  createTask: (input: CreateTaskInput) => Promise<Task>
  completeTask: (id: number) => Promise<void>
  deleteTask: (id: number) => Promise<void>
}

const TaskContext = createContext<TaskContextValue | null>(null)

// Gera ID único quando offline (sem Electron)
let _nextId = Date.now()
function nextId() { return ++_nextId }

export function TaskProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(false)
  const fetched = useRef(false)

  const fetchTasks = useCallback(async () => {
    if (fetched.current) return
    fetched.current = true
    setLoading(true)
    try {
      const data = await window.nook?.getTasks?.()
      setTasks(data ?? [])
    } catch {
      setTasks([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchTasks() }, [fetchTasks])

  const createTask = useCallback(async (input: CreateTaskInput): Promise<Task> => {
    const now = new Date().toISOString()
    try {
      const task = await window.nook.createTask(input)
      setTasks(prev => [task, ...prev])
      return task
    } catch {
      // Fallback para desenvolvimento sem Electron
      const fallback: Task = {
        id: nextId(),
        title: input.title,
        description: input.description,
        date: input.date,
        category: input.category,
        status: 'pending',
        spentTime: 0,
        createdAt: now,
        updatedAt: now,
      }
      setTasks(prev => [fallback, ...prev])
      return fallback
    }
  }, [])

  const completeTask = useCallback(async (id: number) => {
    // Atualização optimista imediata
    setTasks(prev =>
      prev.map(t =>
        t.id === id
          ? { ...t, status: 'completed' as const, updatedAt: new Date().toISOString() }
          : t
      )
    )
    try {
      const updated = await window.nook.completeTask(id)
      setTasks(prev => prev.map(t => (t.id === id ? updated : t)))
    } catch {
      // Mantém o estado optimista se não houver Electron
    }
  }, [])

  const deleteTask = useCallback(async (id: number) => {
    // Remoção optimista imediata
    setTasks(prev => prev.filter(t => t.id !== id))
    try {
      await window.nook.deleteTask(id)
    } catch {
      // ignore
    }
  }, [])

  return (
    <TaskContext.Provider value={{ tasks, loading, fetchTasks, createTask, completeTask, deleteTask }}>
      {children}
    </TaskContext.Provider>
  )
}

export function useTaskContext() {
  const ctx = useContext(TaskContext)
  if (!ctx) throw new Error('useTaskContext precisa estar dentro de TaskProvider')
  return ctx
}
