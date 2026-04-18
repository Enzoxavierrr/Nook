import { useEffect, useRef } from 'react'
import { usePomodoroStore } from '@/stores/pomodoro-store'
import { useTasks } from './use-tasks'
import { toast } from 'sonner'

export function usePomodoro() {
  const store = usePomodoroStore()
  const { incrementPomodoros, getTaskById } = useTasks()
  const prevPhaseRef = useRef(store.phase)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  // Timer tick — polling a cada 250ms para compensar drift do setInterval
  useEffect(() => {
    const interval = setInterval(() => {
      store.tick()
    }, 250)

    return () => clearInterval(interval)
  }, [])

  // Phase change notification
  useEffect(() => {
    if (prevPhaseRef.current !== store.phase) {
      const wasWork = prevPhaseRef.current === 'work'
      
      // Play notification sound
      if (audioRef.current) {
        audioRef.current.play().catch(() => {})
      }

      if (wasWork && store.currentTaskId) {
        incrementPomodoros(store.currentTaskId)
      }

      // Show notification
      if (wasWork) {
        const isLongBreak = store.phase === 'long-break'
        toast.success(
          isLongBreak
            ? '🎉 Pausa longa! Você completou 4 ciclos!'
            : '☕ Hora da pausa! Descanse um pouco.'
        )
      } else {
        toast.info('💪 Hora de focar! Vamos trabalhar.')
      }

      prevPhaseRef.current = store.phase
    }
  }, [store.phase, store.currentTaskId])

  // Browser notification permission
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission()
    }
  }, [])

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
    audioRef,
  }
}

