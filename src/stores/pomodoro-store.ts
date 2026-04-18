import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { PomodoroPhase } from '@/types'
import { POMODORO_DURATIONS } from '@/types'
import { useTimerSettingsStore } from './timer-settings-store'

interface PomodoroStore {
  phase: PomodoroPhase
  timeRemaining: number
  isRunning: boolean
  cyclesCompleted: number
  currentTaskId: string | null
  lastTickTime: number
  
  // Actions
  start: () => void
  pause: () => void
  reset: () => void
  skip: () => void
  tick: () => void
  setCurrentTask: (taskId: string | null) => void
  completePhase: () => void
  syncTime: () => void // Sincroniza tempo após recarregar
}

// Helper para obter durações (usa configurações personalizadas ou padrão)
const getDurations = () => {
  try {
    const settings = useTimerSettingsStore.getState()
    return settings.getDurations()
  } catch {
    // Fallback para valores padrão se o store não estiver disponível
    return POMODORO_DURATIONS
  }
}

export const usePomodoroStore = create<PomodoroStore>()(
  persist(
    (set, get) => {
      const durations = getDurations()
      return {
        phase: 'work',
        timeRemaining: durations.work,
        isRunning: false,
        cyclesCompleted: 0,
        currentTaskId: null,
        lastTickTime: Date.now(),

        start: () => set({ isRunning: true, lastTickTime: Date.now() }),
        
        pause: () => set({ isRunning: false }),
        
        reset: () => {
          const durations = getDurations()
          set({
            phase: 'work',
            timeRemaining: durations.work,
            isRunning: false,
          })
        },
        
        skip: () => {
          const { phase, cyclesCompleted } = get()
          const durations = getDurations()
          
          if (phase === 'work') {
            const newCycles = cyclesCompleted + 1
            const isLongBreak = newCycles % 4 === 0
            
            set({
              phase: isLongBreak ? 'long-break' : 'short-break',
              timeRemaining: isLongBreak ? durations['long-break'] : durations['short-break'],
              cyclesCompleted: newCycles,
              isRunning: false,
            })
          } else {
            set({
              phase: 'work',
              timeRemaining: durations.work,
              isRunning: false,
            })
          }
        },
        
        tick: () => {
          const { timeRemaining, isRunning, lastTickTime } = get()

          if (!isRunning) return

          const now = Date.now()
          const elapsedSeconds = Math.floor((now - lastTickTime) / 1000)

          if (elapsedSeconds < 1) return

          const newTimeRemaining = timeRemaining - elapsedSeconds

          if (newTimeRemaining <= 0) {
            get().completePhase()
          } else {
            set({
              timeRemaining: newTimeRemaining,
              lastTickTime: lastTickTime + elapsedSeconds * 1000,
            })
          }
        },
        
        // Sincroniza o tempo após recarregar a página (calcula tempo passado)
        syncTime: () => {
          const { isRunning, lastTickTime, timeRemaining } = get()
          
          if (!isRunning || !lastTickTime) return
          
          const now = Date.now()
          const elapsedSeconds = Math.floor((now - lastTickTime) / 1000)
          
          if (elapsedSeconds > 0) {
            const newTimeRemaining = timeRemaining - elapsedSeconds
            
            if (newTimeRemaining <= 0) {
              // O timer teria terminado enquanto estava fechado
              get().completePhase()
            } else {
              set({ timeRemaining: newTimeRemaining, lastTickTime: now })
            }
          }
        },
        
        setCurrentTask: (taskId) => set({ currentTaskId: taskId }),
        
        completePhase: () => {
          const { phase, cyclesCompleted } = get()
          const durations = getDurations()
          
          if (phase === 'work') {
            const newCycles = cyclesCompleted + 1
            const isLongBreak = newCycles % 4 === 0
            
            set({
              phase: isLongBreak ? 'long-break' : 'short-break',
              timeRemaining: isLongBreak ? durations['long-break'] : durations['short-break'],
              cyclesCompleted: newCycles,
              isRunning: false,
            })
          } else {
            set({
              phase: 'work',
              timeRemaining: durations.work,
              isRunning: false,
            })
          }
        },
      }
    },
    {
      name: 'pomodoro-storage',
      partialize: (state) => ({
        phase: state.phase,
        timeRemaining: state.timeRemaining,
        isRunning: state.isRunning,
        cyclesCompleted: state.cyclesCompleted,
        currentTaskId: state.currentTaskId,
        lastTickTime: Date.now(), // Salva quando foi o último tick
      }),
    }
  )
)

