import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface TimerSettingsStore {
  workDuration: number // em minutos
  shortBreak: number // em minutos
  longBreak: number // em minutos
  autoStart: boolean
  soundEnabled: boolean
  notifyOnWorkEnd: boolean
  notifyOnBreakEnd: boolean

  // Actions
  setWorkDuration: (minutes: number) => void
  setShortBreak: (minutes: number) => void
  setLongBreak: (minutes: number) => void
  setAutoStart: (enabled: boolean) => void
  setSoundEnabled: (enabled: boolean) => void
  setNotifyOnWorkEnd: (enabled: boolean) => void
  setNotifyOnBreakEnd: (enabled: boolean) => void
  
  // Helper para obter durações em segundos
  getDurations: () => {
    work: number
    'short-break': number
    'long-break': number
  }
}

export const useTimerSettingsStore = create<TimerSettingsStore>()(
  persist(
    (set, get) => ({
      workDuration: 25,
      shortBreak: 5,
      longBreak: 15,
      autoStart: false,
      soundEnabled: true,
      notifyOnWorkEnd: true,
      notifyOnBreakEnd: true,

      setWorkDuration: (minutes) => set({ workDuration: minutes }),
      setShortBreak: (minutes) => set({ shortBreak: minutes }),
      setLongBreak: (minutes) => set({ longBreak: minutes }),
      setAutoStart: (enabled) => set({ autoStart: enabled }),
      setSoundEnabled: (enabled) => set({ soundEnabled: enabled }),
      setNotifyOnWorkEnd: (enabled) => set({ notifyOnWorkEnd: enabled }),
      setNotifyOnBreakEnd: (enabled) => set({ notifyOnBreakEnd: enabled }),
      
      getDurations: () => {
        const { workDuration, shortBreak, longBreak } = get()
        return {
          work: workDuration * 60,
          'short-break': shortBreak * 60,
          'long-break': longBreak * 60,
        }
      },
    }),
    {
      name: 'timer-settings-storage',
    }
  )
)

