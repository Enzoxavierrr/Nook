import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { useGuestDataStore } from './guest-data-store'

const GUEST_TTL_MS = 20 * 60 * 1000 // 20 minutos

export interface GuestUser {
  id: string
  name: string
  email?: string
}

interface GuestStore {
  isGuestMode: boolean
  guestUser: GuestUser | null
  guestExpiresAt: number | null
  enableGuestMode: () => void
  disableGuestMode: () => void
}

export const useGuestStore = create<GuestStore>()(
  persist(
    (set, get) => ({
      isGuestMode: false,
      guestUser: null,
      guestExpiresAt: null,
      enableGuestMode: () => {
        const { isGuestMode, guestExpiresAt, guestUser } = get()
        // Retoma sessão existente se ainda válida
        if (isGuestMode && guestExpiresAt && Date.now() < guestExpiresAt && guestUser) {
          return
        }
        // Nova sessão: limpa dados anteriores
        useGuestDataStore.getState().clearAll()
        const guestId = `guest-${Date.now()}`
        set({
          isGuestMode: true,
          guestUser: { id: guestId, name: 'Visitante' },
          guestExpiresAt: Date.now() + GUEST_TTL_MS,
        })
      },
      disableGuestMode: () => {
        useGuestDataStore.getState().clearAll()
        set({ isGuestMode: false, guestUser: null, guestExpiresAt: null })
      },
    }),
    {
      name: 'nook-guest-session',
      onRehydrateStorage: () => (state) => {
        // Expira sessão ao recarregar a página se o TTL tiver vencido
        if (state?.isGuestMode && state?.guestExpiresAt && Date.now() > state.guestExpiresAt) {
          state.isGuestMode = false
          state.guestUser = null
          state.guestExpiresAt = null
          localStorage.removeItem('nook-guest-data')
        }
      },
    }
  )
)
