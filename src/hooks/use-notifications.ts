import { useState, useEffect, useCallback } from 'react'
import { requestPermission, sendNotification } from '@/lib/notifications'

type PermissionStatus = 'granted' | 'denied' | 'default' | 'unsupported'

export function useNotifications() {
  const [permission, setPermission] = useState<PermissionStatus>(() => {
    if (!('Notification' in window)) return 'unsupported'
    return Notification.permission as PermissionStatus
  })

  useEffect(() => {
    if (!('Notification' in window)) return
    setPermission(Notification.permission as PermissionStatus)
  }, [])

  const request = useCallback(async (): Promise<boolean> => {
    const granted = await requestPermission()
    if ('Notification' in window) {
      setPermission(Notification.permission as PermissionStatus)
    }
    return granted
  }, [])

  const notify = useCallback((title: string, body?: string) => {
    sendNotification(title, { body })
  }, [])

  return {
    permission,
    isPermissionGranted: permission === 'granted',
    requestPermission: request,
    notify,
  }
}
