import { useState, useEffect, useCallback, useRef } from 'react'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import { useAuth } from './use-auth'
import { useSpendingStore } from '@/stores/spending-store'
import type { Transaction, DbTransaction, Category } from '@/types'
import { toast } from 'sonner'

const VALID_CATEGORIES = new Set<string>([
  'Alimentação',
  'Transporte',
  'Lazer',
  'Assinaturas',
  'Saúde',
  'Compras',
  'Outros',
])

function castRow(row: Record<string, unknown>): DbTransaction {
  const trimmed = String(row.category).trim()
  return {
    ...row,
    amount: Number(row.amount),
    category: VALID_CATEGORIES.has(trimmed) ? (trimmed as Category) : 'Outros',
  } as DbTransaction
}

function chunk<T>(arr: T[], size: number): T[][] {
  const chunks: T[][] = []
  for (let i = 0; i < arr.length; i += size) chunks.push(arr.slice(i, i + size))
  return chunks
}

export function useFinances() {
  const { user } = useAuth()
  const [loadingFetch, setLoadingFetch] = useState(false)
  const [loadingUpload, setLoadingUpload] = useState(false)
  const [loadingDelete, setLoadingDelete] = useState(false)

  const fetchTransactions = useCallback(async () => {
    if (!user || !isSupabaseConfigured || !supabase) return

    const callerUserId = user.id
    setLoadingFetch(true)
    try {
      const [{ data: uploads, error: upErr }, { data: rows, error: txErr }] = await Promise.all([
        supabase
          .from('financial_uploads')
          .select('*')
          .eq('user_id', callerUserId)
          .order('uploaded_at', { ascending: false }),
        supabase
          .from('transactions')
          .select('*')
          .eq('user_id', callerUserId)
          .order('date', { ascending: false }),
      ])

      if (upErr) throw upErr
      if (txErr) throw txErr

      // Guard: if the user changed while the request was in-flight, discard results
      if (useSpendingStore.getState().uploads.length > 0 || callerUserId !== user.id) {
        if (callerUserId !== user.id) return
      }

      const allTransactions = (rows ?? []).map(castRow)
      const assignedIds = new Set<string>()

      const uploadList = uploads ?? []
      const grouped: DbTransaction[] = []
      for (const upload of uploadList) {
        const uploadTxs = allTransactions.filter((tx) => tx.upload_id === upload.id)
        uploadTxs.forEach((tx) => assignedIds.add(tx.id))
        grouped.push(...uploadTxs)
      }

      const orphans = allTransactions.filter((tx) => !assignedIds.has(tx.id))
      if (orphans.length > 0) {
        console.warn(`[useFinances] ${orphans.length} transaction(s) have no matching upload and were not loaded:`, orphans.map((t) => t.id))
      }

      useSpendingStore.getState().replaceAll(uploadList, grouped)
    } catch (err) {
      console.error(err)
      toast.error('Erro ao carregar transações')
    } finally {
      setLoadingFetch(false)
    }
  }, [user])

  const fetchRef = useRef(fetchTransactions)
  useEffect(() => {
    fetchRef.current = fetchTransactions
  }, [fetchTransactions])

  useEffect(() => {
    if (user) fetchTransactions()
  }, [user, fetchTransactions])

  const uploadTransactions = useCallback(
    async (transactions: Transaction[], filename: string) => {
      if (!user || !isSupabaseConfigured || !supabase) return

      setLoadingUpload(true)
      try {
        const { data: upload, error: upErr } = await supabase
          .from('financial_uploads')
          .insert({ user_id: user.id, filename })
          .select()
          .single()

        if (upErr) throw upErr

        const rows = transactions.map((tx) => ({
          user_id: user.id,
          upload_id: upload.id,
          merchant: tx.merchant,
          amount: tx.amount,
          date: tx.date,
          category: tx.category,
          raw: tx.raw ?? null,
        }))

        const batches = chunk(rows, 500)
        const inserted: DbTransaction[] = []

        try {
          for (const batch of batches) {
            const { data, error: txErr } = await supabase
              .from('transactions')
              .insert(batch)
              .select()

            if (txErr) throw txErr
            inserted.push(...(data ?? []).map(castRow))
          }
        } catch (txErr) {
          // Transaction insert failed — remove the orphan upload record
          await supabase
            .from('financial_uploads')
            .delete()
            .eq('id', upload.id)
            .eq('user_id', user.id)
          throw txErr
        }

        useSpendingStore.getState().addTransactions(inserted, upload)
        toast.success(`${inserted.length} transações importadas`)
      } catch (err) {
        console.error(err)
        toast.error('Erro ao importar fatura')
      } finally {
        setLoadingUpload(false)
      }
    },
    [user]
  )

  const deleteUpload = useCallback(
    async (uploadId: string) => {
      if (!user || !isSupabaseConfigured || !supabase || loadingDelete) return

      setLoadingDelete(true)
      useSpendingStore.getState().removeUpload(uploadId) // optimistic — ON DELETE CASCADE limpa as transactions no banco

      const { error } = await supabase
        .from('financial_uploads')
        .delete()
        .eq('id', uploadId)
        .eq('user_id', user.id) // defesa além do RLS

      if (error) {
        console.error(error)
        toast.error('Erro ao remover fatura')
        fetchRef.current()
        setLoadingDelete(false)
        return
      }

      toast.success('Fatura removida')
      setLoadingDelete(false)
    },
    [user, loadingDelete]
  )

  return {
    loadingFetch,
    loadingUpload,
    loadingDelete,
    uploadTransactions,
    fetchTransactions,
    deleteUpload,
  }
}
