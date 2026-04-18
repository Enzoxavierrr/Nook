import { useEffect, useRef } from 'react'
import { usePomodoroStore } from '@/stores/pomodoro-store'
import { useTimerSettingsStore } from '@/stores/timer-settings-store'
import { sendNotification } from '@/lib/notifications'
import { playTimerSound } from '@/lib/sounds'
import { useTasks } from './use-tasks'
import { toast } from 'sonner'

const PHASE_NOTIFICATIONS = {
  work: { title: 'Pomodoro concluído!', body: 'Hora de descansar.' },
  'short-break': { title: 'Pausa curta encerrada', body: 'Bora focar de novo.' },
  'long-break': { title: 'Pausa longa encerrada', body: 'Você está pronto!' },
} as const

export function usePomodoro() {
  const store = usePomodoroStore()
  const { incrementPomodoros, getTaskById } = useTasks()
  const prevPhaseRef = useRef(store.phase)

  // Timer tick — polling a cada 250ms para compensar drift do setInterval
  useEffect(() => {
    const interval = setInterval(() => {
      store.tick()
    }, 250)

    return () => clearInterval(interval)
  }, [])

  // Phase change: sound + browser notification + toast
  useEffect(() => {
    if (prevPhaseRef.current === store.phase) return

    const prevPhase = prevPhaseRef.current
    const wasWork = prevPhase === 'work'
    const { soundEnabled, notifyOnWorkEnd, notifyOnBreakEnd } = useTimerSettingsStore.getState()

    if (soundEnabled) playTimerSound()

    const shouldNotify = wasWork ? notifyOnWorkEnd : notifyOnBreakEnd
    if (shouldNotify) {
      const { title, body } = PHASE_NOTIFICATIONS[prevPhase]
      sendNotification(title, { body })
    }

    if (wasWork && store.currentTaskId) {
      incrementPomodoros(store.currentTaskId)
    }

    if (wasWork) {
      const isLongBreak = store.phase === 'long-break'
      toast.success(
        isLongBreak
          ? 'Pausa longa! Você completou 4 ciclos.'
          : 'Hora da pausa! Descanse um pouco.'
      )
    } else {
      toast.info('Hora de focar! Vamos trabalhar.')
    }

    prevPhaseRef.current = store.phase
  }, [store.phase, store.currentTaskId])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const getPhaseLabel = () => {
    switch (store.phase) {
      case 'work':
        return 'Foco'
      case 'short-break':
        return 'Pausa curta'
      case 'long-break':
        return 'Pausa longa'
    }
  }

  const getPhaseColor = () => {
    switch (store.phase) {
      case 'work':
        return 'text-primary'
      case 'short-break':
        return 'text-green-500'
      case 'long-break':
        return 'text-blue-500'
    }
  }

  const currentTask = store.currentTaskId ? getTaskById(store.currentTaskId) : null

  return {
    ...store,
    formatTime,
    getPhaseLabel,
    getPhaseColor,
    currentTask,
  }
}
