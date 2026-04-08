import { useState, useRef, useCallback } from 'react'

interface UseTimerReturn {
  seconds: number
  isRunning: boolean
  sessionId: number | null
  start: (taskId?: number) => Promise<void>
  stop: () => Promise<void>
  reset: () => void
  formatted: string // "mm:ss"
}

export function useTimer(): UseTimerReturn {
  const [seconds, setSeconds] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [sessionId, setSessionId] = useState<number | null>(null)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const start = useCallback(async (taskId?: number) => {
    const session = await window.nook.startSession(taskId)
    setSessionId(session.id)
    setIsRunning(true)

    intervalRef.current = setInterval(() => {
      setSeconds((s) => s + 1)
    }, 1000)
  }, [])

  const stop = useCallback(async () => {
    if (intervalRef.current) clearInterval(intervalRef.current)
    setIsRunning(false)

    if (sessionId !== null) {
      await window.nook.endSession(sessionId)
      setSessionId(null)
    }
  }, [sessionId])

  const reset = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current)
    setIsRunning(false)
    setSeconds(0)
    setSessionId(null)
  }, [])

  const formatted = `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`

  return { seconds, isRunning, sessionId, start, stop, reset, formatted }
}
