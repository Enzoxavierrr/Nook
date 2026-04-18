import { useRef, useState, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Upload, FileText, Loader2, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { extractTextFromPDF } from '@/lib/pdf'
import { toast } from 'sonner'

const MAX_SIZE = 20 * 1024 * 1024

interface PDFUploadProps {
  onParsed: (text: string) => void
  onReset?: () => void
  disabled?: boolean
}

type UploadState = 'idle' | 'dragging' | 'loading' | 'done'

function validateFile(file: File): string | null {
  if (!file.name.toLowerCase().endsWith('.pdf') && file.type !== 'application/pdf')
    return 'O arquivo não é um PDF válido.'
  if (file.size === 0) return 'Arquivo vazio.'
  if (file.size > MAX_SIZE) return 'Arquivo maior que 20MB.'
  return null
}

export function PDFUpload({ onParsed, onReset, disabled = false }: PDFUploadProps) {
  const [state, setState] = useState<UploadState>('idle')
  const [fileName, setFileName] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const requestIdRef = useRef(0)      // descarta resultados de promises obsoletas
  const dragCounterRef = useRef(0)    // evita flickering ao passar sobre filhos
  const isMountedRef = useRef(true)   // evita setState após unmount

  useEffect(() => () => { isMountedRef.current = false }, [])

  const handleFile = useCallback(
    async (file: File) => {
      const error = validateFile(file)
      if (error) { toast.error(error); return }

      const requestId = ++requestIdRef.current
      setFileName(file.name)
      setState('loading')

      try {
        const text = await extractTextFromPDF(file)
        if (!isMountedRef.current || requestId !== requestIdRef.current) return
        setState('done')
        toast.success('Fatura lida com sucesso!')
        onParsed(text)
      } catch (err) {
        if (!isMountedRef.current || requestId !== requestIdRef.current) return
        setState('idle')
        setFileName(null)
        toast.error(err instanceof Error ? err.message : 'Não foi possível ler o PDF.')
      }
    },
    [onParsed]
  )

  const handleReset = () => {
    setState('idle')
    setFileName(null)
    onReset?.()
  }

  // dragenter/dragleave com contador — evita flickering ao passar sobre elementos filhos
  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault()
    if (disabled || state === 'loading' || state === 'done') return
    if (++dragCounterRef.current === 1) setState('dragging')
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    if (--dragCounterRef.current === 0 && state === 'dragging') setState('idle')
  }

  const handleDragOver = (e: React.DragEvent) => e.preventDefault()

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    dragCounterRef.current = 0
    if (disabled || state === 'loading' || state === 'done') { setState('idle'); return }
    setState('idle')
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      if (isInteractive) inputRef.current?.click()
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
    e.target.value = ''
  }

  const isInteractive = !disabled && state !== 'loading' && state !== 'done'

  return (
    <div className="w-full">
      <input
        ref={inputRef}
        type="file"
        accept=".pdf,application/pdf"
        className="hidden"
        onChange={handleInputChange}
        disabled={disabled || state === 'loading'}
      />

      {/* Anuncia mudanças de estado para leitores de tela */}
      <div aria-live="polite" className="sr-only">
        {state === 'loading' && 'Lendo o PDF, aguarde.'}
        {state === 'done' && `Arquivo ${fileName} processado com sucesso.`}
      </div>

      <div
        role={isInteractive ? 'button' : undefined}
        tabIndex={isInteractive ? 0 : -1}
        aria-label={
          state === 'loading'
            ? 'Processando PDF'
            : state === 'done'
            ? `Arquivo ${fileName} carregado`
            : 'Área de upload de PDF. Clique ou arraste um arquivo.'
        }
        aria-busy={state === 'loading'}
        aria-disabled={disabled || undefined}
        onKeyDown={handleKeyDown}
        onDrop={handleDrop}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onClick={() => isInteractive && inputRef.current?.click()}
        className={cn(
          'flex flex-col items-center justify-center gap-4 rounded-3xl border-2 border-dashed p-10 transition-all duration-200',
          state === 'dragging' && 'border-primary bg-primary/5 scale-[1.01]',
          state === 'done' && 'border-primary bg-primary/5',
          state === 'idle' && 'border-border',
          isInteractive &&
            'cursor-pointer hover:border-primary/50 hover:bg-sidebar-accent/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
          disabled && 'opacity-50 cursor-not-allowed'
        )}
      >
        <AnimatePresence mode="wait">
          {state === 'loading' && (
            <motion.div
              key="loading"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="flex flex-col items-center gap-3"
            >
              <Loader2 className="w-10 h-10 text-primary animate-spin" />
              <p className="text-sm text-muted-foreground font-[Poppins]">Lendo o PDF...</p>
            </motion.div>
          )}

          {state === 'done' && (
            <motion.div
              key="done"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="flex flex-col items-center gap-3"
            >
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
                <FileText className="w-7 h-7 text-primary" />
              </div>
              <p
                className="max-w-[240px] truncate font-medium text-foreground font-[Poppins] text-center"
                title={fileName ?? ''}
              >
                {fileName}
              </p>
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => { e.stopPropagation(); handleReset() }}
                className="font-[Poppins] text-muted-foreground hover:text-destructive"
              >
                <X className="w-4 h-4 mr-1" />
                Remover
              </Button>
            </motion.div>
          )}

          {(state === 'idle' || state === 'dragging') && (
            <motion.div
              key="idle"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="flex flex-col items-center gap-3 text-center"
            >
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
                <Upload className="w-7 h-7 text-primary" />
              </div>
              <div>
                <p className="font-medium text-foreground font-[Poppins]">
                  {state === 'dragging' ? 'Solte o arquivo aqui' : 'Arraste sua fatura aqui'}
                </p>
                <p className="text-sm text-muted-foreground font-[Poppins] mt-1">
                  Somente PDF — máx. 20MB
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => { e.stopPropagation(); inputRef.current?.click() }}
                disabled={disabled || state === 'loading'}
                className="font-[Poppins] mt-1"
              >
                Selecionar arquivo
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
