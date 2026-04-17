import { useEffect, useState, useMemo } from 'react'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import { useAuth } from './use-auth'
import { useGuestStore } from '@/stores/guest-store'
import { useGuestDataStore } from '@/stores/guest-data-store'
import type { Task } from '@/types'
import { toast } from 'sonner'

export function useTasks(listId?: string | null) {
  const { user, isGuestMode } = useAuth()
  const { guestUser } = useGuestStore()
  const guestData = useGuestDataStore()
  const [localTasks, setLocalTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)

  // Em modo guest, lê diretamente da store persistente
  const tasks = isGuestMode ? guestData.tasks : localTasks

  useEffect(() => {
    if (isGuestMode) {
      setLoading(false)
      return
    }

    if (!isSupabaseConfigured || !user) {
      setLocalTasks([])
      setLoading(false)
      return
    }

    fetchTasks()

    const channel = supabase
      .channel('tasks-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'tasks',
          filter: `user_id=eq.${user.id}`,
        },
        () => {
          fetchTasks()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [user, listId, isGuestMode])

  const fetchTasks = async () => {
    if (!user || isGuestMode) return

    let query = supabase
      .from('tasks')
      .select('*')
      .eq('user_id', user.id)
      .order('completed', { ascending: true })
      .order('created_at', { ascending: false })

    if (listId) {
      query = query.eq('list_id', listId)
    }

    const { data, error } = await query

    if (error) {
      toast.error('Erro ao carregar tarefas')
      console.error(error)
    } else {
      setLocalTasks(data || [])
    }
    setLoading(false)
  }

  interface CreateTaskData {
    title: string
    description?: string
    list_id?: string | null
    difficulty?: number
    estimated_time?: number
    start_date?: string | null
    deadline?: string | null
  }

  const createTask = async (taskData: CreateTaskData | string, listId?: string | null) => {
    if (!user) return { error: new Error('Usuário não autenticado') }

    if (isGuestMode && guestUser) {
      const newTask: Task = typeof taskData === 'string'
        ? {
            id: `task-${Date.now()}-${Math.random()}`,
            user_id: guestUser.id,
            list_id: listId || null,
            title: taskData,
            description: null,
            completed: false,
            pomodoros_completed: 0,
            difficulty: 25,
            estimated_time: 60,
            start_date: null,
            deadline: null,
            scheduled_time: null,
            created_at: new Date().toISOString(),
          }
        : {
            id: `task-${Date.now()}-${Math.random()}`,
            user_id: guestUser.id,
            title: taskData.title,
            description: taskData.description || null,
            list_id: taskData.list_id || listId || null,
            completed: false,
            pomodoros_completed: 0,
            difficulty: taskData.difficulty ?? 25,
            estimated_time: taskData.estimated_time ?? 60,
            start_date: taskData.start_date || null,
            deadline: taskData.deadline || null,
            scheduled_time: null,
            created_at: new Date().toISOString(),
          }

      guestData.addTask(newTask)
      toast.success('Tarefa criada!')
      return { data: newTask, error: null }
    }

    const insertData = typeof taskData === 'string'
      ? {
          user_id: user.id,
          title: taskData,
          list_id: listId || null,
        }
      : {
          user_id: user.id,
          title: taskData.title,
          description: taskData.description || null,
          list_id: taskData.list_id || null,
          difficulty: taskData.difficulty ?? 25,
          estimated_time: taskData.estimated_time ?? 60,
          start_date: taskData.start_date || null,
          deadline: taskData.deadline || null,
        }

    const { data, error } = await (supabase as any)
      .from('tasks')
      .insert(insertData)
      .select()
      .single()

    if (error) {
      toast.error('Erro ao criar tarefa')
      console.error(error)
    } else {
      toast.success('Tarefa criada!')
    }

    return { data, error }
  }

  const updateTask = async (id: string, updates: Partial<Pick<Task, 'title' | 'description' | 'completed' | 'pomodoros_completed' | 'list_id' | 'scheduled_time' | 'start_date' | 'difficulty' | 'estimated_time'>>) => {
    if (isGuestMode) {
      guestData.updateTask(id, updates)
      toast.success('Tarefa atualizada!')
      return { data: null, error: null }
    }

    // Optimistic update para modo normal
    setLocalTasks((prevTasks) =>
      prevTasks.map((task) => (task.id === id ? { ...task, ...updates } : task))
    )

    const { data, error } = await (supabase as any)
      .from('tasks')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      fetchTasks()
      toast.error('Erro ao atualizar tarefa')
      console.error(error)
    } else {
      toast.success('Tarefa atualizada!')
    }

    return { data, error }
  }

  const scheduleTask = async (id: string, scheduledTime: number | null) => {
    if (isGuestMode) {
      guestData.updateTask(id, { scheduled_time: scheduledTime })
      return { data: null, error: null }
    }

    setLocalTasks((prevTasks) =>
      prevTasks.map((t) => (t.id === id ? { ...t, scheduled_time: scheduledTime } : t))
    )

    const { data, error } = await (supabase as any)
      .from('tasks')
      .update({ scheduled_time: scheduledTime })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      setLocalTasks((prevTasks) =>
        prevTasks.map((t) => (t.id === id ? { ...t, scheduled_time: t.scheduled_time } : t))
      )
      toast.error('Erro ao agendar tarefa')
      console.error(error)
    }

    return { data, error }
  }

  const toggleTaskComplete = async (id: string, completed: boolean) => {
    return updateTask(id, { completed })
  }

  const incrementPomodoros = async (id: string) => {
    const task = tasks.find((t) => t.id === id)
    if (!task) return { error: new Error('Tarefa não encontrada') }
    return updateTask(id, { pomodoros_completed: task.pomodoros_completed + 1 })
  }

  const deleteTask = async (id: string) => {
    if (isGuestMode) {
      guestData.removeTask(id)
      toast.success('Tarefa excluída!')
      return { error: null }
    }

    setLocalTasks((prevTasks) => prevTasks.filter((task) => task.id !== id))

    const { error } = await supabase.from('tasks').delete().eq('id', id)

    if (error) {
      fetchTasks()
      toast.error('Erro ao excluir tarefa')
      console.error(error)
    } else {
      toast.success('Tarefa excluída!')
    }

    return { error }
  }

  const getTaskById = (id: string) => {
    return tasks.find((task) => task.id === id)
  }

  const filteredTasks = useMemo(() => {
    if (!listId) return tasks
    return tasks.filter((t) => t.list_id === listId)
  }, [tasks, listId])

  return {
    tasks: filteredTasks,
    loading,
    createTask,
    updateTask,
    toggleTaskComplete,
    incrementPomodoros,
    deleteTask,
    getTaskById,
    scheduleTask,
    refetch: fetchTasks,
  }
}
