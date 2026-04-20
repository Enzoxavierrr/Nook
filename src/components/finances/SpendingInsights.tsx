import { useMemo } from 'react'
import { TrendingDown, Repeat2, AlertTriangle, Trophy } from 'lucide-react'
import { useSpendingStore } from '@/stores/spending-store'
import type { DbTransaction, Category } from '@/types'

const fmt = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })
const LAZER_CATS: Category[] = ['Lazer']
const LAZER_KEYWORDS = ['ifood', 'rappi', 'uber eats', 'delivery', '99food', 'lazer']

// ─── helpers ────────────────────────────────────────────────────────────────

function inferLatestMonth(txs: DbTransaction[]): string {
  return txs.reduce((latest, tx) => (tx.date > latest ? tx.date.slice(0, 7) : latest), '0000-00')
}

function groupByCategory(txs: DbTransaction[]): Map<Category, number> {
  const map = new Map<Category, number>()
  for (const tx of txs) {
    const cat = tx.category ?? 'Outros'
    map.set(cat, (map.get(cat) ?? 0) + tx.amount)
  }
  return map
}

function prevMonth(yyyyMM: string): string {
  const [y, m] = yyyyMM.split('-').map(Number)
  if (m === 1) return `${y - 1}-12`
  return `${y}-${String(m - 1).padStart(2, '0')}`
}

// ─── tipos dos insights ──────────────────────────────────────────────────────

interface Top3 {
  kind: 'top3'
  items: { category: Category; amount: number; pct: number }[]
}

interface SavingsHint {
  kind: 'savings'
  pct: number
  amount: number
}

interface Recurring {
  kind: 'recurring'
  merchants: string[]
}

interface CategoryAlert {
  kind: 'alert'
  category: Category
  growthPct: number
  currentAmount: number
  prevAmount: number
}

type Insight = Top3 | SavingsHint | Recurring | CategoryAlert

// ─── cálculos ────────────────────────────────────────────────────────────────

function computeInsights(
  transactions: DbTransaction[],
  currentMes: string | null,
): Insight[] {
  if (transactions.length === 0) return []

  const insights: Insight[] = []

  // determina o mês de referência
  const refMonth = currentMes ?? inferLatestMonth(transactions)

  const current = transactions.filter((t) => t.date.startsWith(refMonth))
  if (current.length === 0) return []

  const total = current.reduce((s, t) => s + t.amount, 0)
  const byCat = groupByCategory(current)

  // ── top 3 ────────────────────────────────────────────────────────────────
  const top3Items = [...byCat.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([category, amount]) => ({ category, amount, pct: total > 0 ? (amount / total) * 100 : 0 }))

  if (top3Items.length > 0) insights.push({ kind: 'top3', items: top3Items })

  // ── economia potencial (Lazer + merchants de delivery) ───────────────────
  const lazerAmount = current
    .filter(
      (t) =>
        LAZER_CATS.includes(t.category) ||
        LAZER_KEYWORDS.some((kw) => t.merchant.toLowerCase().includes(kw)),
    )
    .reduce((s, t) => s + t.amount, 0)

  if (lazerAmount > 0 && total > 0) {
    insights.push({
      kind: 'savings',
      pct: Math.round((lazerAmount / total) * 100),
      amount: lazerAmount,
    })
  }

  // ── recorrentes: mesmo merchant em ≥ 2 meses ────────────────────────────
  const monthsByMerchant = new Map<string, Set<string>>()
  for (const tx of transactions) {
    const month = tx.date.slice(0, 7)
    const key = tx.merchant.toLowerCase().trim()
    if (!monthsByMerchant.has(key)) monthsByMerchant.set(key, new Set())
    monthsByMerchant.get(key)!.add(month)
  }

  const recurring = [...monthsByMerchant.entries()]
    .filter(([, months]) => months.size >= 2)
    .map(([merchant]) => merchant)
    .sort()
    .slice(0, 5)

  if (recurring.length > 0) {
    const displayNames = recurring.map((m) =>
      m.length > 22 ? m.slice(0, 22) + '…' : m,
    )
    insights.push({ kind: 'recurring', merchants: displayNames })
  }

  // ── alerta de crescimento >20% vs mês anterior ───────────────────────────
  const prev = prevMonth(refMonth)
  const prevTxs = transactions.filter((t) => t.date.startsWith(prev))

  if (prevTxs.length > 0) {
    const prevByCat = groupByCategory(prevTxs)
    for (const [cat, currentAmount] of byCat.entries()) {
      const prevAmount = prevByCat.get(cat) ?? 0
      if (prevAmount === 0) continue
      const growthPct = ((currentAmount - prevAmount) / prevAmount) * 100
      if (growthPct > 20) {
        insights.push({ kind: 'alert', category: cat, growthPct: Math.round(growthPct), currentAmount, prevAmount })
      }
    }
    // limita a 3 alertas para não poluir o grid
    const alertStart = insights.findIndex((i) => i.kind === 'alert')
    if (alertStart !== -1) insights.splice(alertStart + 3)
  }

  return insights
}

// ─── cards de insight ─────────────────────────────────────────────────────────

function Top3Card({ items }: { items: Top3['items'] }) {
  return (
    <InsightCard icon={<Trophy className="w-4 h-4 text-yellow-500" />} title="Top 3 categorias">
      <ul className="flex flex-col gap-2 mt-1">
        {items.map(({ category, amount, pct }, i) => (
          <li key={category} className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground w-4">{i + 1}.</span>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-baseline mb-0.5">
                <span className="text-sm font-medium truncate">{category}</span>
                <span className="text-sm tabular-nums text-muted-foreground ml-2">{fmt.format(amount)}</span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-border overflow-hidden">
                <div
                  className="h-full rounded-full bg-primary transition-all"
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
            <span className="text-xs text-muted-foreground w-8 text-right">{pct.toFixed(0)}%</span>
          </li>
        ))}
      </ul>
    </InsightCard>
  )
}

function SavingsCard({ pct, amount }: SavingsHint) {
  return (
    <InsightCard icon={<TrendingDown className="w-4 h-4 text-emerald-500" />} title="Economia potencial">
      <p className="text-sm text-muted-foreground mt-1">
        Cortando gastos com lazer e delivery você economizaria{' '}
        <span className="font-semibold text-foreground">{fmt.format(amount)}</span>{' '}
        este mês —{' '}
        <span className="font-semibold text-emerald-500">{pct}% do total</span>.
      </p>
    </InsightCard>
  )
}

function RecurringCard({ merchants }: Recurring) {
  return (
    <InsightCard icon={<Repeat2 className="w-4 h-4 text-blue-500" />} title="Gastos recorrentes">
      <p className="text-xs text-muted-foreground mt-1 mb-2">Aparecem em 2+ meses</p>
      <div className="flex flex-wrap gap-1.5">
        {merchants.map((m) => (
          <span key={m} className="px-2 py-0.5 rounded-full text-xs bg-blue-500/10 text-blue-500 capitalize">
            {m}
          </span>
        ))}
      </div>
    </InsightCard>
  )
}

function AlertCard({ category, growthPct, currentAmount, prevAmount }: CategoryAlert) {
  return (
    <InsightCard icon={<AlertTriangle className="w-4 h-4 text-orange-500" />} title={`${category} cresceu ${growthPct}%`}>
      <p className="text-sm text-muted-foreground mt-1">
        <span className="font-semibold text-foreground">{fmt.format(prevAmount)}</span>
        {' → '}
        <span className="font-semibold text-orange-500">{fmt.format(currentAmount)}</span>
        {' em relação ao mês anterior.'}
      </p>
    </InsightCard>
  )
}

function InsightCard({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <div className="bg-sidebar rounded-2xl p-4 flex flex-col gap-1">
      <div className="flex items-center gap-2">
        {icon}
        <span className="text-sm font-semibold font-[Poppins]">{title}</span>
      </div>
      <div className="font-[Poppins]">{children}</div>
    </div>
  )
}

// ─── componente principal ─────────────────────────────────────────────────────

export function SpendingInsights() {
  const transactions = useSpendingStore((s) => s.transactions)
  const mes = useSpendingStore((s) => s.filters.mes)

  const insights = useMemo(() => computeInsights(transactions, mes), [transactions, mes])

  if (insights.length === 0) {
    return (
      <div className="flex items-center justify-center h-32 text-muted-foreground text-sm font-[Poppins]">
        Dados insuficientes para gerar insights
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {insights.map((insight, i) => {
        if (insight.kind === 'top3') return <Top3Card key={i} {...insight} />
        if (insight.kind === 'savings') return <SavingsCard key={i} {...insight} />
        if (insight.kind === 'recurring') return <RecurringCard key={i} {...insight} />
        if (insight.kind === 'alert') return <AlertCard key={i} {...insight} />
      })}
    </div>
  )
}
