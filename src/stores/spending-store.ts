import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { DbTransaction, FinancialUpload, Category } from '@/types'

export interface SpendingFilters {
  mes: string | null    // 'YYYY-MM' ou null = todos
  categoria: Category | null
}

export interface SpendingStore {
  transactions: DbTransaction[]
  uploads: FinancialUpload[]
  filters: SpendingFilters

  replaceAll: (uploads: FinancialUpload[], transactions: DbTransaction[]) => void
  addTransactions: (transactions: DbTransaction[], upload: FinancialUpload) => void
  removeUpload: (uploadId: string) => void
  setFilterMes: (mes: string | null) => void
  setFilterCategoria: (categoria: Category | null) => void
  setFilter: (partial: Partial<SpendingFilters>) => void
  clearData: () => void
}

const DEFAULT_FILTERS: SpendingFilters = { mes: null, categoria: null }

const YYYY_MM = /^\d{4}-(?:0[1-9]|1[0-2])$/

export function selectFilteredTransactions(state: SpendingStore): DbTransaction[] {
  const { transactions, filters } = state
  return transactions.filter((tx) => {
    if (filters.mes && !tx.date.startsWith(filters.mes)) return false
    if (filters.categoria && tx.category?.trim() !== filters.categoria) return false
    return true
  })
}

export const useSpendingStore = create<SpendingStore>()(
  persist(
    (set) => ({
      transactions: [],
      uploads: [],
      filters: { ...DEFAULT_FILTERS },

      replaceAll: (uploads, transactions) =>
        set({ uploads, transactions, filters: { ...DEFAULT_FILTERS } }),

      addTransactions: (transactions, upload) =>
        set((state) => {
          if (state.uploads.some((u) => u.id === upload.id)) return state
          return {
            uploads: [...state.uploads, upload],
            transactions: [...state.transactions, ...transactions],
          }
        }),

      removeUpload: (uploadId) =>
        set((state) => ({
          uploads: state.uploads.filter((u) => u.id !== uploadId),
          transactions: state.transactions.filter((t) => t.upload_id !== uploadId),
        })),

      setFilterMes: (mes) => {
        if (mes !== null && !YYYY_MM.test(mes)) return
        set((state) => ({ filters: { ...state.filters, mes } }))
      },

      setFilterCategoria: (categoria) =>
        set((state) => ({ filters: { ...state.filters, categoria } })),

      setFilter: (partial) =>
        set((state) => ({ filters: { ...state.filters, ...partial } })),

      clearData: () =>
        set({ transactions: [], uploads: [], filters: { ...DEFAULT_FILTERS } }),
    }),
    {
      name: 'spending-storage',
      partialize: (state) => ({
        uploads: state.uploads,
        transactions: state.transactions.map(({ raw: _raw, ...rest }) => rest),
        filters: state.filters,
      }),
    }
  )
)
