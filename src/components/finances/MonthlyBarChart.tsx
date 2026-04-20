import { useMemo } from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { useSpendingStore } from '@/stores/spending-store'

const fmt = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })

const MONTH_LABELS: Record<string, string> = {
  '01': 'Jan', '02': 'Fev', '03': 'Mar', '04': 'Abr',
  '05': 'Mai', '06': 'Jun', '07': 'Jul', '08': 'Ago',
  '09': 'Set', '10': 'Out', '11': 'Nov', '12': 'Dez',
}

function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean
  payload?: Array<{ value: number }>
  label?: string
}) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-sidebar border border-border rounded-xl px-3 py-2 text-sm font-[Poppins] shadow-lg">
      <p className="font-medium">{label}</p>
      <p className="text-muted-foreground">{fmt.format(payload[0].value)}</p>
    </div>
  )
}

export function MonthlyBarChart() {
  const transactions = useSpendingStore((s) => s.transactions)

  const data = useMemo(() => {
    const totals = new Map<string, number>()
    for (const tx of transactions) {
      const month = tx.date.slice(0, 7) // 'YYYY-MM'
      totals.set(month, (totals.get(month) ?? 0) + tx.amount)
    }
    return [...totals.entries()]
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([month, total]) => {
        const [year, mm] = month.split('-')
        return { month: `${MONTH_LABELS[mm] ?? mm}/${year.slice(2)}`, total }
      })
  }, [transactions])

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-muted-foreground text-sm font-[Poppins]">
        Nenhuma transação encontrada
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={data} margin={{ top: 4, right: 8, left: 8, bottom: 4 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
        <XAxis
          dataKey="month"
          tick={{ fontSize: 12, fontFamily: 'Poppins', fill: 'var(--muted-foreground)' }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tickFormatter={(v) => {
            const n = v as number
            return n >= 1000 ? `R$${(n / 1000).toFixed(0)}k` : fmt.format(n)
          }}
          tick={{ fontSize: 11, fontFamily: 'Poppins', fill: 'var(--muted-foreground)' }}
          axisLine={false}
          tickLine={false}
          width={48}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'var(--primary)', opacity: 0.08 }} />
        <Bar dataKey="total" fill="var(--primary)" radius={[6, 6, 0, 0]} maxBarSize={48} />
      </BarChart>
    </ResponsiveContainer>
  )
}
