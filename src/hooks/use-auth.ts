import { useEffect, useState } from 'react'
import type { User, Session } from '@supabase/supabase-js'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import { useGuestStore, type GuestUser } from '@/stores/guest-store'

// Tipo unificado para usuário (pode ser User do Supabase ou GuestUser)
type AuthUser = User | (GuestUser & { user_metadata?: { name?: string } }) | null

export function useAuth() {
  const { isGuestMode, guestUser, disableGuestMode } = useGuestStore()
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Se estiver em modo guest, não precisa verificar Supabase
    if (isGuestMode) {
      setLoading(false)
      setUser(null) // Limpa usuário do Supabase quando em modo guest
      setSession(null)
      return
    }

    if (!isSupabaseConfigured || !supabase) {
      setLoading(false)
      return
    }

    supabase.auth.getSession().then(({ data: { session } }: any) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event: any, session: any) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => {
      if (subscription) {
        subscription.unsubscribe()
      }
    }
  }, [isGuestMode])

  const signUp = async (email: string, password: string, name?: string) => {
    if (!isSupabaseConfigured || !supabase) {
      return { data: null, error: new Error('Supabase não configurado') }
    }
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: name || email.split('@')[0],
        },
      },
    })
    return { data, error }
  }

  const signIn = async (email: string, password: string) => {
    if (!isSupabaseConfigured || !supabase) {
      return { data: null, error: new Error('Supabase não configurado') }
    }
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    return { data, error }
  }

  const resetPassword = async (email: string) => {
    if (!isSupabaseConfigured || !supabase) {
      return { error: new Error('Supabase não configurado') }
    }
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })
    return { error }
  }

  const updatePassword = async (newPassword: string) => {
    if (!isSupabaseConfigured || !supabase) {
      return { error: new Error('Supabase não configurado') }
    }
    const { error } = await supabase.auth.updateUser({ password: newPassword })
    return { error }
  }

  const signOut = async () => {
    // Se estiver em modo guest, apenas desabilita o modo guest
    if (isGuestMode) {
      disableGuestMode()
      return { error: null }
    }

    // Sempre limpa o estado local primeiro
    setUser(null)
    setSession(null)
    
    // Limpa o localStorage para remover qualquer sessão armazenada
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const keys = Object.keys(localStorage)
        keys.forEach(key => {
          if (key.includes('supabase') || key.includes('auth')) {
            localStorage.removeItem(key)
          }
        })
      }
    } catch (err) {
      // Ignora erros ao limpar localStorage
    }
    
    // Tenta fazer logout no Supabase de forma completamente assíncrona
    // Não espera a resposta para evitar bloqueios ou erros
    if (isSupabaseConfigured && supabase && typeof supabase.auth !== 'undefined') {
      const client = supabase
      setTimeout(() => {
        try {
          client.auth.signOut({ scope: 'local' }).catch(() => {})
        } catch {
          // ignora
        }
      }, 0)
    }

    return { error: null }
  }

  // Pegar o nome do usuário dos metadados ou do email
  const getUserName = () => {
    if (isGuestMode && guestUser) {
      return guestUser.name
    }
    if (!user) return 'Usuário'
    return user.user_metadata?.name || user.email?.split('@')[0] || 'Usuário'
  }

  // Retorna o usuário atual (pode ser User do Supabase ou GuestUser)
  const currentUser = (): AuthUser => {
    if (isGuestMode && guestUser) {
      // Retorna um objeto compatível com User do Supabase
      return {
        ...guestUser,
        user_metadata: { name: guestUser.name },
      } as any
    }
    return user
  }

  // Deletar conta e todos os dados do usuário
  const deleteAccount = async () => {
    if (!user) {
      return { error: new Error('Usuário não autenticado') }
    }

    if (!isSupabaseConfigured || !supabase) {
      return { error: new Error('Supabase não configurado') }
    }

    try {
      // 1. Deletar todas as tarefas do usuário
      const { error: tasksError } = await supabase
        .from('tasks')
        .delete()
        .eq('user_id', user.id)

      if (tasksError) {
        console.error('Erro ao deletar tarefas:', tasksError)
        return { error: tasksError }
      }

      // 2. Deletar todas as listas do usuário
      const { error: listsError } = await supabase
        .from('lists')
        .delete()
        .eq('user_id', user.id)

      if (listsError) {
        console.error('Erro ao deletar listas:', listsError)
        return { error: listsError }
      }

      // 3. Limpa o estado local primeiro
      setUser(null)
      setSession(null)
      
      // Limpa o localStorage
      try {
        if (typeof window !== 'undefined' && window.localStorage) {
          const keys = Object.keys(localStorage)
          keys.forEach(key => {
            if (key.includes('supabase') || key.includes('auth')) {
              localStorage.removeItem(key)
            }
          })
        }
      } catch (err) {
        // Ignora erros ao limpar localStorage
      }
      
      // Tenta fazer logout no Supabase de forma assíncrona (não bloqueia)
      if (isSupabaseConfigured && supabase && typeof supabase.auth !== 'undefined') {
        const client = supabase
        setTimeout(() => {
          try {
            client.auth.signOut({ scope: 'local' }).catch(() => {})
          } catch {
            // ignora
          }
        }, 0)
      }

      return { error: null }
    } catch (err) {
      console.error('Erro ao deletar conta:', err)
      return { error: err as Error }
    }
  }

  return {
    user: currentUser(),
    session,
    loading,
    signUp,
    signIn,
    signOut,
    resetPassword,
    updatePassword,
    getUserName,
    deleteAccount,
    isGuestMode: isGuestMode || false,
  }
}
