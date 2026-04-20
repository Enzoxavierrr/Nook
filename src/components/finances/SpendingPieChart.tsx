import { useMemo } from 'react'
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { useSpendingStore, selectFilteredTransactions } from '@/stores/spending-store'
import type { DbTransaction } from '@/types'

interface Props {
  groupBy: 'category' | 'merchant'
}

const COLORS = [
  '#8b5cf6', '#3b82f6', '#22c55e', '#f97316',
  '#ec4899', '#14b8a6', '#eab308', '#ef4444',
]

function buildSlices(transactions: DbTransaction[], groupBy: 'category' | 'merchant') {
  const totals = new Map<string, number>()
  for (const tx of transactions) {
    const key = groupBy === 'category' ? (tx.category ?? 'Outros') : tx.merchant
    totals.set(key, (totals.get(key) ?? 0) + tx.amount)
  }
  const sorted = [...totals.entries()].sort((a, b) => b[1] - a[1])
  // Cap merchants at top 8 to keep the chart readable
  const capped = groupBy === 'merchant' ? sorted.slice(0, 8) : sorted
  const grandTotal = capped.reduce((s, [, v]) => s + v, 0)
  return capped.map(([name, value]) => ({
    name,
    value,
    pct: grandTotal > 0 ? (value / grandTotal) * 100 : 0,
  }))
}

const fmt = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })

function CustomTooltip({ active, payload }: { active?: boolean; payload?: Array<{ payload: { name: string; value: number; pct: number } }> }) {
  if (!active || !payload?.length) return null
  const { name, value, pct } = payload[0].payload
  return (
    <div className="bg-sidebar border border-border rounded-xl px-3 py-2 text-sm font-[Poppins] shadow-lg">
      <p className="font-medium">{name}</p>
      <p className="text-muted-foreground">{fmt.format(value)} · {pct.toFixed(1)}%</p>
    </div>
  )
}

function CustomLegend({ payload }: { payload?: Array<{ color: string; payload: { name: string; pct: number } }> }) {
  if (!payload?.length) return null
  return (
    <ul className="flex flex-col gap-1 mt-2 font-[Poppins] text-xs">
      {payload.map((entry) => (
        <li key={entry.payload.name} className="flex items-center gap-2">
          <span className="inline-block w-2.5 h-2.5 rounded-full shrink-0" style={{ background: entry.color }} />
          <span className="truncate max-w-[140px] text-foreground">{entry.payload.name}</span>
          <span className="ml-auto text-muted-foreground pl-2">{entry.payload.pct.toFixed(1)}%</span>
        </li>
      ))}
    </ul>
  )
}

export function SpendingPieChart({ groupBy }: Props) {
  const transactions = useSpendingStore(selectFilteredTransactions)
  const slices = useMemo(() => buildSlices(transactions, groupBy), [transactions, groupBy])

  if (slices.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-muted-foreground text-sm font-[Poppins]">
        Nenhuma transação encontrada
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={280}>
      <PieChart>
        <Pie
          data={slices}
          cx="50%"
          cy="45%"
          innerRadius={60}
          outerRadius={95}
          paddingAngle={2}
          dataKey="value"
        >
          {slices.map((_, i) => (
            <Cell key={i} fill={COLORS[i % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        <Legend content={<CustomLegend />} />
      </PieChart>
    </ResponsiveContainer>
  )
}
