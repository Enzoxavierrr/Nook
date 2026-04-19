import type { Category } from '@/types'

// Strip diacritics and non-alphanumeric chars for fuzzy matching.
function normalize(str: string): string {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

const RULES: [Category, string[]][] = [
  ['Alimentação', [
    'ifood', 'rappi', 'ubereats',
    'mcdonalds', 'mc donalds', 'burger king', 'wendys', 'subway', 'kfc', "bob's",
    'pizza', 'pizzaria', 'dominos', 'giraffas',
    'restaurante', 'padaria', 'lanchonete', 'cafeteria', 'cafe', 'bakery',
    'sushi', 'churrasco', 'churrascaria', 'acougue', 'peixaria', 'sorveteria',
    'carrefour', 'extra supermercado', 'pao de acucar', 'atacadao', 'assai',
    'supermercado', 'mercado', 'hortifruti',
  ]],
  ['Transporte', [
    '99app', '99 app', 'uber',
    'taxi', 'cabify',
    'latam', 'gol linhas', 'azul linhas', 'buser', 'clickbus',
    'shell', 'ipiranga', 'petrobras', 'posto', 'combustivel', 'gasolina',
    'estacionamento', 'parking',
    'sem parar', 'semparar', 'autopass', 'eztag', 'veloe', 'conectcar', 'pedagio',
    'metro', 'onibus', 'bilhete unico',
    'localiza', 'movida', 'unidas', 'hertz', 'rentacar',
  ]],
  ['Assinaturas', [
    'netflix', 'spotify', 'deezer', 'tidal',
    'amazon prime', 'prime video',
    'youtube premium', 'google one',
    'apple one', 'icloud',
    'hbo max', 'disney plus', 'paramount', 'globoplay', 'crunchyroll',
    'adobe', 'figma', 'canva',
    'microsoft 365', 'office 365',
    'dropbox', 'github',
    'notion', 'slack', 'zoom', 'linear',
    'openai', 'chatgpt',
    'linkedin premium',
    'apple com bill', 'google play', 'google storage', 'google one',
  ]],
  ['Saúde', [
    'ultrafarma', 'drogasil', 'drogaraia', 'drogaria', 'droga', 'farmacia',
    'hospital', 'pronto socorro', 'upa saude',
    'clinica', 'laboratorio', 'laborat',
    'unimed', 'amil', 'hapvida', 'bradesco saude', 'sulamerica saude',
    'dentista', 'odonto', 'ortodontia',
    'psicologo', 'psiquiatra', 'terapia',
    'smartfit', 'bluefit', 'bodytech', 'academia',
    'biolab', 'fleury', 'dasa', 'einstein', 'sirio libanes',
  ]],
  ['Lazer', [
    'steam', 'playstation', 'xbox', 'nintendo', 'nuuvem', 'epic games',
    'cinemark', 'uci', 'cinema',
    'teatro', 'museu', 'exposicao',
    'sympla', 'eventbrite', 'ingresso',
    'airbnb', 'booking', 'expedia', 'trivago', 'hotel', 'hostel', 'pousada',
    'parque', 'aquatico',
    'show', 'concert', 'karaoke', 'boliche',
  ]],
  ['Compras', [
    'shopee', 'mercado livre', 'aliexpress', 'wish', 'shein',
    'americanas', 'submarino', 'shoptime',
    'casas bahia', 'magazine luiza', 'magazineluiza', 'ponto frio',
    'amazon',
    'zara', 'renner', 'riachuelo', 'cea', 'hering', 'marisa',
    'nike', 'adidas', 'puma', 'asics', 'netshoes', 'centauro',
    'kabum', 'fast shop', 'livraria', 'saraiva',
    'ikea', 'tok stok', 'etna',
    'apple store', 'samsung store',
  ]],
]

// Compile-time guard: every non-fallback Category must appear in RULES.
// Adding a new Category without a matching RULES entry becomes a type error here.
type NonFallback = Exclude<Category, 'Outros'>
type CoveredCategories = (typeof RULES)[number][0]
type _Exhaustive = [CoveredCategories] extends [NonFallback]
  ? [NonFallback] extends [CoveredCategories] ? true : never
  : never
const _check: _Exhaustive = true

interface Rule {
  keyword: string
  category: Category
  // Pre-compiled boundary regex for single-word keywords; null for multi-word (plain includes).
  re: RegExp | null
}

// Flatten, sort longest first, pre-compile boundary patterns for single-word keywords.
const SORTED_RULES: Rule[] = RULES
  .flatMap(([cat, keywords]) =>
    keywords.map((kw) => {
      const keyword = normalize(kw)
      const re = keyword.includes(' ')
        ? null
        : new RegExp(`(?<![a-z0-9])${keyword}(?![a-z0-9])`)
      return { keyword, category: cat, re }
    })
  )
  .sort((a, b) => b.keyword.length - a.keyword.length)

function matches(normalized: string, rule: Rule): boolean {
  return rule.re ? rule.re.test(normalized) : normalized.includes(rule.keyword)
}

export function categorize(merchant: string): Category {
  const normalized = normalize(merchant)
  for (const rule of SORTED_RULES) {
    if (matches(normalized, rule)) return rule.category
  }
  return 'Outros'
}
