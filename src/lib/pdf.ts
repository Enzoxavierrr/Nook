import * as pdfjsLib from 'pdfjs-dist'
import type { TextItem } from 'pdfjs-dist/types/src/display/api'
import workerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url'

pdfjsLib.GlobalWorkerOptions.workerSrc = workerUrl

const MAX_FILE_SIZE = 20 * 1024 * 1024 // 20MB
const MAX_FILE_SIZE_MB = MAX_FILE_SIZE / (1024 * 1024)
const PAGE_BATCH = 5
const LINE_Y_TOLERANCE = 2 // px

function validate(file: File): void {
  if (file.size === 0) throw new Error('Arquivo vazio.')
  if (file.size > MAX_FILE_SIZE) throw new Error(`Arquivo maior que ${MAX_FILE_SIZE_MB}MB.`)
  if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf'))
    throw new Error('O arquivo não é um PDF válido.')
}

// O(1) por item — quantiza Y em buckets de LINE_Y_TOLERANCE e ordena X dentro da linha
function itemsToLines(items: TextItem[]): string {
  if (items.length === 0) return ''

  const rows = new Map<number, { y: number; words: { x: number; str: string }[] }>()

  for (const item of items) {
    const y = item.transform[5]
    const x = item.transform[4]
    const key = Math.round(y / LINE_Y_TOLERANCE)

    if (!rows.has(key)) rows.set(key, { y, words: [] })
    rows.get(key)!.words.push({ x, str: item.str })
  }

  return [...rows.values()]
    .sort((a, b) => b.y - a.y)
    .map((row) =>
      row.words
        .sort((a, b) => a.x - b.x)
        .map((w) => w.str)
        .join(' ')
    )
    .join('\n')
}

export async function extractTextFromPDF(file: File): Promise<string> {
  validate(file)

  try {
    const arrayBuffer = await file.arrayBuffer()
    const pdf = await pdfjsLib.getDocument({
      data: arrayBuffer,
      isEvalSupported: false,
    }).promise

    const pages: string[] = []

    try {
      for (let i = 1; i <= pdf.numPages; i += PAGE_BATCH) {
        const batch = Array.from(
          { length: Math.min(PAGE_BATCH, pdf.numPages - i + 1) },
          (_, j) => i + j
        )

        const batchTexts = await Promise.all(
          batch.map(async (pageNum) => {
            const page = await pdf.getPage(pageNum)
            try {
              const content = await page.getTextContent()
              const items = content.items.filter((item): item is TextItem => 'str' in item)
              return itemsToLines(items)
            } finally {
              page.cleanup()
            }
          })
        )

        pages.push(...batchTexts)
      }
    } finally {
      // Erro no destroy não deve mascarar o erro original
      try { await pdf.destroy() } catch {}
    }

    return pages.join('\n\n')
  } catch (err: unknown) {
    if (err instanceof Error && err.name === 'PasswordException')
      throw new Error('PDF protegido por senha não é suportado.')
    if (err instanceof pdfjsLib.InvalidPDFException)
      throw new Error('PDF inválido ou corrompido.')
    if (err instanceof Error) throw err
    throw new Error('Não foi possível ler o PDF.')
  }
}
