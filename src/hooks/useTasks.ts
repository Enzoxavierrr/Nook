import { useState, useCallback } from 'react'
import type { Task, CreateTaskInput, UpdateTaskInput } from '../types'

declare global {
  interface Window {
    nook: {
      getTasks: () => Promise<Task[]>
      getTaskById: (id: number) => Promise<Task>
      createTask: (input: CreateTaskInput) => Promise<Task>
      updateTask: (id: number, input: UpdateTaskInput) => Promise<Task>
      deleteTask: (id: number) => Promise<{ success: boolean }>
      completeTask: (id: number) => Promise<Task>
      startSession: (taskId?: number) => Promise<{ id: number }>
      endSession: (sessionId: number) => Promise<unknown>
      getSessions: (taskId: number) => Promise<unknown[]>
      scheduleReminder: (taskId: number) => Promise<void>
    }
  }
}

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(false)

  const fetchTasks = useCallback(async () => {
    setLoading(true)
    try {
      const data = await window.nook.getTasks()
      setTasks(data)
    } finally {
      setLoading(false)
    }
  }, [])

  const createTask = useCallback(async (input: CreateTaskInput) => {
    const task = await window.nook.createTask(input)
    setTasks((prev) => [task, ...prev])
    return task
  }, [])

  const updateTask = useCallback(async (id: number, input: UpdateTaskInput) => {
    const updated = await window.nook.updateTask(id, input)
    setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)))
    return updated
  }, [])

  const deleteTask = useCallback(async (id: number) => {
    await window.nook.deleteTask(id)
    setTasks((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const completeTask = useCallback(async (id: number) => {
    const updated = await window.nook.completeTask(id)
    setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)))
  }, [])

  return { tasks, loading, fetchTasks, createTask, updateTask, deleteTask, completeTask }
}
