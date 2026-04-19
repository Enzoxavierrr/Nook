import type { Transaction } from '@/types'
import { categorize } from '@/lib/category-mapper'

const PT_MONTHS: Record<string, number> = {
  JAN: 1, FEV: 2, MAR: 3, ABR: 4, MAI: 5, JUN: 6,
  JUL: 7, AGO: 8, SET: 9, OUT: 10, NOV: 11, DEZ: 12,
}

// Amount: 1–3 digits, optional thousands groups, mandatory cents.
// Optional CR suffix = reimbursement (negative amount).
const NUBANK_TX =
  /^(\d{1,2})\s+(JAN|FEV|MAR|ABR|MAI|JUN|JUL|AGO|SET|OUT|NOV|DEZ)\s+(.+?)\s+R\$\s*(\d{1,3}(?:\.\d{3})*,\d{2})\s*(CR)?$/i

const DATE_PREFIX = /^\d{1,2}\s+(?:JAN|FEV|MAR|ABR|MAI|JUN|JUL|AGO|SET|OUT|NOV|DEZ)\b/i

// Present in every genuine Nubank PDF — used to distinguish empty vs. unrecognised format.
const NUBANK_MARKER = /nubank|fatura\s+de\s+cr[eé]dito/i

function parseAmount(raw: string): number {
  return parseFloat(raw.replace(/\./g, '').replace(',', '.'))
}

function toISO(day: string, monthAbbr: string, year: number): string {
  const m = PT_MONTHS[monthAbbr.toUpperCase()]
  if (m === undefined) throw new Error(`Mês desconhecido: "${monthAbbr}"`)
  return `${year}-${String(m).padStart(2, '0')}-${day.padStart(2, '0')}`
}

// January statements contain "28 DEZ" transactions from the previous year.
// If tx date is > 45 days ahead of the statement month, decrement the year.
function adjustYear(txMonth: number, txDay: number, stmtYear: number, stmtMonth: number): number {
  const txDate = new Date(stmtYear, txMonth - 1, txDay)
  const stmtDate = new Date(stmtYear, stmtMonth - 1, 1)
  return (txDate.getTime() - stmtDate.getTime()) / 86_400_000 > 45 ? stmtYear - 1 : stmtYear
}

function inferStatementMonth(text: string): number | undefined {
  const match = text.match(
    /(?:JANEIRO|FEVEREIRO|MAR[ÇC]O|ABRIL|MAIO|JUNHO|JULHO|AGOSTO|SETEMBRO|OUTUBRO|NOVEMBRO|DEZEMBRO)/i
  )
  if (!match) return undefined
  const table: Record<string, number> = {
    JANEIRO: 1, FEVEREIRO: 2, MARÇO: 3, MARCO: 3, ABRIL: 4, MAIO: 5, JUNHO: 6,
    JULHO: 7, AGOSTO: 8, SETEMBRO: 9, OUTUBRO: 10, NOVEMBRO: 11, DEZEMBRO: 12,
  }
  return table[match[0].toUpperCase()]
}

function inferYear(text: string): number {
  const match = text.match(
    /(?:JANEIRO|FEVEREIRO|MAR[ÇC]O|ABRIL|MAIO|JUNHO|JULHO|AGOSTO|SETEMBRO|OUTUBRO|NOVEMBRO|DEZEMBRO)\s+(20\d{2})/i
  )
  if (match) return parseInt(match[1], 10)

  const yearMatch = text.slice(0, 2000).match(/\b(20\d{2})\b/)
  if (yearMatch) return parseInt(yearMatch[1], 10)

  return new Date().getFullYear()
}

interface NormalizedLine {
  text: string  // joined text for regex matching
  raw: string   // original PDF segments (newline-separated) for audit
}

// Rejoins orphan continuations of long merchant names. Only appends to a line
// that started with the date pattern and hasn't received its R$ amount yet.
// Preserves original PDF segments in `raw` so callers can audit the source text.
function normalizeLines(lines: string[]): NormalizedLine[] {
  const out: NormalizedLine[] = []
  for (const line of lines) {
    const trimmed = line.trim()
    if (!trimmed) continue

    if (DATE_PREFIX.test(trimmed)) {
      out.push({ text: trimmed, raw: trimmed })
    } else {
      const last = out.at(-1)
      if (last !== undefined && DATE_PREFIX.test(last.text) && !/R\$/.test(last.text)) {
        last.text = last.text + ' ' + trimmed
        last.raw = last.raw + '\n' + trimmed
      } else {
        out.push({ text: trimmed, raw: trimmed })
      }
    }
  }
  return out
}

export function parseNubankStatement(text: string): Transaction[] {
  if (!NUBANK_MARKER.test(text)) {
    throw new Error('Formato não reconhecido: verifique se o PDF é uma fatura Nubank.')
  }

  const year = inferYear(text)
  const stmtMonth = inferStatementMonth(text) ?? new Date().getMonth() + 1
  const transactions: Transaction[] = []

  for (const { text: lineText, raw: lineRaw } of normalizeLines(text.split('\n'))) {
    const match = lineText.match(NUBANK_TX)
    if (!match) continue

    const [, day, month, merchantRaw, amountRaw, crFlag] = match

    const amount = parseAmount(amountRaw)
    if (!isFinite(amount)) continue

    const txMonth = PT_MONTHS[month.toUpperCase()]!
    const txYear = adjustYear(txMonth, parseInt(day, 10), year, stmtMonth)

    // #6 — denominator supports up to 3 digits (e.g. 02/120 for 120x installments)
    const merchant = merchantRaw
      .replace(/\s*[-–]\s*\d{1,2}\/\d{1,3}$/, '')
      .replace(/\s*\(\d{1,2}\/\d{1,3}\)$/, '')
      .trim()

    transactions.push({
      merchant,
      amount: crFlag ? -amount : amount,
      date: toISO(day, month, txYear),
      category: categorize(merchant),
      raw: lineRaw,
    })
  }

  return transactions
}
