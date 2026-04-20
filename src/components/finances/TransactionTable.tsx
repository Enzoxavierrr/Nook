import { useEffect, useMemo, useState } from 'react'
import { ChevronUp, ChevronDown, ChevronsUpDown, ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useSpendingStore, selectFilteredTransactions } from '@/stores/spending-store'
import type { Category, DbTransaction } from '@/types'

const CATEGORIES: Category[] = [
  'Alimentação', 'Transporte', 'Lazer', 'Assinaturas', 'Saúde', 'Compras', 'Outros',
]

const fmt = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })

type SortKey = 'date' | 'amount'
type SortDir = 'asc' | 'desc'

const PAGE_SIZE = 10

function SortIcon({ col, sortKey, sortDir }: { col: SortKey; sortKey: SortKey; sortDir: SortDir }) {
  if (col !== sortKey) return <ChevronsUpDown className="w-3.5 h-3.5 opacity-40" />
  return sortDir === 'asc'
    ? <ChevronUp className="w-3.5 h-3.5 text-primary" />
    : <ChevronDown className="w-3.5 h-3.5 text-primary" />
}

function formatDate(iso: string) {
  const [y, m, d] = iso.slice(0, 10).split('-')
  return `${d}/${m}/${y}`
}

export function TransactionTable() {
  const allTransactions = useSpendingStore(selectFilteredTransactions)

  const [categoria, setCategoria] = useState<Category | 'all'>('all')
  const [sortKey, setSortKey] = useState<SortKey>('date')
  const [sortDir, setSortDir] = useState<SortDir>('desc')
  const [page, setPage] = useState(1)

  useEffect(() => { setPage(1) }, [allTransactions])

  function toggleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortKey(key)
      setSortDir('desc')
    }
    setPage(1)
  }

  const filtered = useMemo<DbTransaction[]>(() => {
    const base = categoria === 'all' ? allTransactions : allTransactions.filter((t) => t.category === categoria)
    return [...base].sort((a, b) => {
      const mul = sortDir === 'asc' ? 1 : -1
      if (sortKey === 'date') return mul * a.date.localeCompare(b.date)
      return mul * (a.amount - b.amount)
    })
  }, [allTransactions, categoria, sortKey, sortDir])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const safePage = Math.min(page, totalPages)
  const rows = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE)

  function handleCategoryChange(val: string) {
    setCategoria(val as Category | 'all')
    setPage(1)
  }

  if (allTransactions.length === 0) {
    return (
      <div className="flex items-center justify-center h-32 text-muted-foreground text-sm font-[Poppins]">
        Nenhuma transação encontrada
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Filtro */}
      <div className="flex items-center gap-2">
        <Select value={categoria} onValueChange={handleCategoryChange}>
          <SelectTrigger className="w-44 font-[Poppins] text-sm">
            <SelectValue placeholder="Categoria" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all" className="font-[Poppins] text-sm">Todas</SelectItem>
            {CATEGORIES.map((c) => (
              <SelectItem key={c} value={c} className="font-[Poppins] text-sm">{c}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <span className="text-xs text-muted-foreground font-[Poppins] ml-1">
          {filtered.length} transaç{filtered.length === 1 ? 'ão' : 'ões'}
        </span>
      </div>

      {/* Tabela */}
      <div className="rounded-2xl border border-border overflow-hidden">
        <table className="w-full text-sm font-[Poppins]">
          <thead>
            <tr className="border-b border-border bg-sidebar">
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                <button
                  onClick={() => toggleSort('date')}
                  className="flex items-center gap-1 hover:text-foreground transition-colors"
                >
                  Data <SortIcon col="date" sortKey={sortKey} sortDir={sortDir} />
                </button>
              </th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Estabelecimento</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Categoria</th>
              <th className="px-4 py-3 text-right font-medium text-muted-foreground">
                <button
                  onClick={() => toggleSort('amount')}
                  className="flex items-center gap-1 ml-auto hover:text-foreground transition-colors"
                >
                  Valor <SortIcon col="amount" sortKey={sortKey} sortDir={sortDir} />
                </button>
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((tx, i) => (
              <tr
                key={tx.id}
                className={`border-b border-border last:border-0 transition-colors hover:bg-sidebar-accent/40 ${i % 2 === 0 ? '' : 'bg-sidebar/40'}`}
              >
                <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">{formatDate(tx.date)}</td>
                <td className="px-4 py-3 max-w-[200px] truncate" title={tx.merchant}>{tx.merchant}</td>
                <td className="px-4 py-3">
                  <span className="inline-block px-2 py-0.5 rounded-full text-xs bg-primary/10 text-primary">
                    {tx.category}
                  </span>
                </td>
                <td className="px-4 py-3 text-right font-medium tabular-nums">{fmt.format(tx.amount)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Paginação */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-1">
          <span className="text-xs text-muted-foreground font-[Poppins]">
            Página {safePage} de {totalPages}
          </span>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              disabled={safePage === 1}
              onClick={() => setPage((p) => p - 1)}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              disabled={safePage === totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
