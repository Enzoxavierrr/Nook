import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Task, List } from '@/types'

interface GuestDataStore {
  tasks: Task[]
  lists: List[]
  addTask: (task: Task) => void
  updateTask: (id: string, updates: Partial<Task>) => void
  removeTask: (id: string) => void
  addList: (list: List) => void
  updateList: (id: string, updates: Partial<List>) => void
  removeList: (id: string) => void
  clearAll: () => void
}

export const useGuestDataStore = create<GuestDataStore>()(
  persist(
    (set) => ({
      tasks: [],
      lists: [],
      addTask: (task) => set((state) => ({ tasks: [task, ...state.tasks] })),
      updateTask: (id, updates) =>
        set((state) => ({
          tasks: state.tasks.map((t) => (t.id === id ? { ...t, ...updates } : t)),
        })),
      removeTask: (id) =>
        set((state) => ({ tasks: state.tasks.filter((t) => t.id !== id) })),
      addList: (list) => set((state) => ({ lists: [...state.lists, list] })),
      updateList: (id, updates) =>
        set((state) => ({
          lists: state.lists.map((l) => (l.id === id ? { ...l, ...updates } : l)),
        })),
      removeList: (id) =>
        set((state) => ({ lists: state.lists.filter((l) => l.id !== id) })),
      clearAll: () => set({ tasks: [], lists: [] }),
    }),
    { name: 'nook-guest-data' }
  )
)
