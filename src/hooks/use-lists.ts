import { useEffect, useState } from 'react'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import { useAuth } from './use-auth'
import { useGuestStore } from '@/stores/guest-store'
import { useGuestDataStore } from '@/stores/guest-data-store'
import type { List } from '@/types'
import { toast } from 'sonner'

export function useLists() {
  const { user, isGuestMode } = useAuth()
  const { guestUser } = useGuestStore()
  const guestData = useGuestDataStore()
  const [localLists, setLocalLists] = useState<List[]>([])
  const [loading, setLoading] = useState(true)

  // Em modo guest, lê diretamente da store persistente
  const lists = isGuestMode ? guestData.lists : localLists

  useEffect(() => {
    if (isGuestMode) {
      setLoading(false)
      return
    }

    if (!isSupabaseConfigured || !supabase || !user) {
      setLocalLists([])
      setLoading(false)
      return
    }

    fetchLists()

    const channel = supabase
      .channel('lists-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'lists',
          filter: `user_id=eq.${user.id}`,
        },
        () => {
          fetchLists()
        }
      )
      .subscribe()

    return () => {
      supabase?.removeChannel(channel)
    }
  }, [user, isGuestMode])

  const fetchLists = async () => {
    if (!user || isGuestMode || !supabase) return

    const { data, error } = await supabase
      .from('lists')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: true })

    if (error) {
      toast.error('Erro ao carregar listas')
      console.error(error)
    } else {
      setLocalLists((data as List[]) || [])
    }
    setLoading(false)
  }

  const createList = async (name: string, color: string) => {
    if (!user) return { error: new Error('Usuário não autenticado') }

    if (isGuestMode && guestUser) {
      const newList: List = {
        id: `list-${Date.now()}-${Math.random()}`,
        user_id: guestUser.id,
        name,
        color,
        created_at: new Date().toISOString(),
      }

      guestData.addList(newList)
      toast.success('Lista criada!')
      return { data: newList, error: null }
    }

    const { data, error } = await supabase!
      .from('lists')
      .insert({ user_id: user.id, name, color })
      .select()
      .single()

    if (error) {
      toast.error('Erro ao criar lista')
      console.error(error)
    } else {
      toast.success('Lista criada!')
    }

    return { data, error }
  }

  const updateList = async (id: string, updates: Partial<Pick<List, 'name' | 'color'>>) => {
    if (isGuestMode) {
      guestData.updateList(id, updates)
      toast.success('Lista atualizada!')
      return { data: null, error: null }
    }

    setLocalLists((prevLists) =>
      prevLists.map((list) => (list.id === id ? { ...list, ...updates } : list))
    )

    const { data, error } = await supabase!
      .from('lists')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      fetchLists()
      toast.error('Erro ao atualizar lista')
      console.error(error)
    } else {
      toast.success('Lista atualizada!')
    }

    return { data, error }
  }

  const deleteList = async (id: string) => {
    if (isGuestMode) {
      guestData.removeList(id)
      toast.success('Lista excluída!')
      return { error: null }
    }

    setLocalLists((prevLists) => prevLists.filter((list) => list.id !== id))

    const { error } = await supabase!.from('lists').delete().eq('id', id)

    if (error) {
      fetchLists()
      toast.error('Erro ao excluir lista')
      console.error(error)
    } else {
      toast.success('Lista excluída!')
    }

    return { error }
  }

  const getListById = (id: string) => {
    return lists.find((list) => list.id === id)
  }

  return {
    lists,
    loading,
    createList,
    updateList,
    deleteList,
    getListById,
    refetch: fetchLists,
  }
}
