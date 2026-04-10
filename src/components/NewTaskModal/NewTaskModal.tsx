import { useState, useEffect, useRef } from 'react'
import { Calendar, FolderOpen, Flag, ArrowRight } from 'lucide-react'

interface Props {
  open: boolean
  onClose: () => void
  onCreateTask: (title: string) => void
}

const S = {
  overlay: {
    position: 'fixed' as const,
    inset: 0,
    zIndex: 100,
    background: 'rgba(19,19,19,0.6)',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  hint: {
    position: 'absolute' as const,
    bottom: 32,
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    background: 'rgba(42,42,42,0.4)',
    backdropFilter: 'blur(4px)',
    WebkitBackdropFilter: 'blur(4px)',
    border: '1px solid rgba(71,71,71,0.1)',
    borderRadius: 9999,
    padding: '9px 17px',
  },
  modal: {
    position: 'relative' as const,
    background: '#2a2a2a',
    border: '1px solid rgba(71,71,71,0.2)',
    borderRadius: 12,
    boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
    width: 672,
    maxWidth: '100%',
    padding: 33,
    display: 'flex',
    flexDirection: 'column' as const,
    gap: 40,
    overflow: 'hidden',
  },
  glow: {
    position: 'absolute' as const,
    top: -96,
    right: -96,
    width: 256,
    height: 256,
    borderRadius: 9999,
    background: 'rgba(73,75,214,0.05)',
    filter: 'blur(50px)',
    pointerEvents: 'none' as const,
  },
  pill: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    background: '#0e0e0e',
    border: '1px solid rgba(71,71,71,0.2)',
    borderRadius: 9999,
    padding: '7px 13px',
    color: '#c6c6c6',
    fontSize: 14,
    fontWeight: 500,
    cursor: 'pointer',
    fontFamily: 'Inter, system-ui, sans-serif',
    transition: 'background 150ms ease',
  } as React.CSSProperties,
  kbd: {
    background: '#0e0e0e',
    border: '1px solid rgba(71,71,71,0.2)',
    borderRadius: 4,
    padding: '3px 7px',
    fontSize: 12,
    color: 'rgba(198,198,198,0.4)',
    fontFamily: 'monospace',
  },
}

export default function NewTaskModal({ open, onClose, onCreateTask }: Props) {
  const [title, setTitle] = useState('')
  const inputRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50)
    } else {
      setTitle('')
    }
  }, [open])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (!open) return
      if (e.key === 'Escape') onClose()
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
        e.preventDefault()
        handleCreate()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [open, title, onClose])

  function handleCreate() {
    if (title.trim()) {
      onCreateTask(title.trim())
      onClose()
    }
  }

  if (!open) return null

  return (
    <div style={S.overlay} onClick={onClose}>
      {/* Floating keyboard hint */}
      <div style={S.hint}>
        <span style={{ fontSize: 12, color: 'rgba(198,198,198,0.6)' }}>
          Ative o input com <strong style={{ color: 'rgba(198,198,198,0.9)' }}>/</strong>
        </span>
      </div>

      {/* Modal card */}
      <div style={S.modal} onClick={e => e.stopPropagation()}>
        {/* Background accent glow */}
        <div style={S.glow} />

        {/* Header */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, position: 'relative' }}>
          <h2 style={{
            fontSize: 30,
            fontWeight: 700,
            color: '#ffffff',
            letterSpacing: '-0.05em',
            lineHeight: '36px',
            margin: 0,
          }}>
            No que você está trabalhando?
          </h2>
          <div style={{ width: 48, height: 4, background: '#494bd6', borderRadius: 2 }} />
        </div>

        {/* Text input */}
        <div style={{ position: 'relative' }}>
          <textarea
            ref={inputRef}
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="Refatorar camada de autenticação..."
            rows={2}
            style={{
              background: 'transparent',
              border: 'none',
              outline: 'none',
              resize: 'none',
              fontSize: 24,
              fontWeight: 500,
              color: '#ffffff',
              fontFamily: 'Inter, system-ui, sans-serif',
              lineHeight: 'normal',
              width: '100%',
              caretColor: '#494bd6',
            }}
          />
        </div>

        {/* Action pills */}
        <div style={{ display: 'flex', gap: 16, alignItems: 'center', paddingTop: 8, paddingBottom: 24 }}>
          {[
            { icon: Calendar,   label: 'Definir Prazo'     },
            { icon: FolderOpen, label: 'Atribuir Projeto'  },
            { icon: Flag,       label: 'Prioridade'        },
          ].map(({ icon: Icon, label }) => (
            <button key={label} style={S.pill}>
              <Icon size={12} color="#c6c6c6" />
              {label}
            </button>
          ))}
        </div>

        {/* Footer */}
        <div style={{
          borderTop: '1px solid rgba(71,71,71,0.1)',
          paddingTop: 33,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          {/* Keyboard hints */}
          <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
              <kbd style={S.kbd}>ESC</kbd>
              <span style={{ fontSize: 12, fontWeight: 700, color: 'rgba(198,198,198,0.4)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Fechar</span>
            </div>
            <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
              <kbd style={S.kbd}>⌘</kbd>
              <span style={{ fontSize: 12, fontWeight: 700, color: 'rgba(198,198,198,0.4)' }}>+</span>
              <kbd style={S.kbd}>ENTER</kbd>
              <span style={{ fontSize: 12, fontWeight: 700, color: 'rgba(198,198,198,0.4)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Criar</span>
            </div>
          </div>

          {/* Create Task button */}
          <button
            onClick={handleCreate}
            style={{
              background: '#ffffff',
              borderRadius: 8,
              border: 'none',
              padding: '12px 32px',
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              cursor: 'pointer',
              fontFamily: 'Inter, system-ui, sans-serif',
              transition: 'opacity 150ms ease',
            }}
          >
            <span style={{ fontSize: 16, fontWeight: 700, color: '#07006c' }}>Criar Tarefa</span>
            <ArrowRight size={12} color="#07006c" />
          </button>
        </div>
      </div>
    </div>
  )
}
