import { useState, useEffect } from 'react'
import { Clock, Zap } from 'lucide-react'
import { useTasks } from '../hooks/useTasks'
import TopNavBar from '../components/TopNavBar/TopNavBar'

// ── Dados mock para grupos ─────────────────────────────────────
const gruposDemo = [
  {
    id: 'alta',
    label: 'Alta Prioridade',
    cor: '#494bd6',
    tarefas: [
      { id: 'm1', titulo: 'Refatorar middleware de autenticação para API v2', categoria: 'Sistema', categoriaDestaque: true, tempo: '4h' },
      { id: 'm2', titulo: 'Finalizar diretrizes de marca para Precision Noir',  categoria: 'Design',  categoriaDestaque: false, tempo: '2h' },
    ],
  },
  {
    id: 'monolith',
    label: 'Projeto: Monolith',
    cor: '#474747',
    tarefas: [
      { id: 'm3', titulo: 'Implementar efeitos de glassmorfismo na navegação lateral', categoria: 'Front-end', categoriaDestaque: false, tempo: '1,5h' },
      { id: 'm4', titulo: 'Auditar hierarquia tipográfica para acessibilidade',          categoria: 'UX',        categoriaDestaque: false, tempo: '3h'   },
      { id: 'm5', titulo: 'Preparar relatório de desempenho trimestral',                 categoria: 'Admin',     categoriaDestaque: false, tempo: '1h'   },
    ],
  },
]

const abas = ['Ativo', 'Concluído', 'Backlog'] as const
type Aba = typeof abas[number]

export default function Tasks() {
  const { tasks, loading, fetchTasks, deleteTask, completeTask } = useTasks()
  const [abaAtiva, setAbaAtiva] = useState<Aba>('Ativo')

  useEffect(() => { fetchTasks() }, [])

  // Filtra tarefas do DB pela aba ativa
  const tarefasFiltradas = tasks.filter(t => {
    if (abaAtiva === 'Ativo')    return t.status !== 'completed'
    if (abaAtiva === 'Concluído') return t.status === 'completed'
    return false
  })

  return (
    <div style={{ flex: 1, background: '#131313', display: 'flex', flexDirection: 'column', overflow: 'hidden', position: 'relative' }}>
      <TopNavBar placeholder="Buscar tarefas..." />

      <div style={{ flex: 1, overflowY: 'auto', paddingLeft: 64, paddingRight: 64, paddingTop: 32, paddingBottom: 120 }}>

        {/* ══ CABEÇALHO E FILTROS ═══════════════════════════════ */}
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 48 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <h1 style={{ fontSize: 48, fontWeight: 700, color: '#ffffff', letterSpacing: '-0.05em', lineHeight: '48px' }}>
              Tarefas
            </h1>
            <p style={{ fontSize: 16, fontWeight: 500, color: '#6b7280' }}>
              {tasks.filter(t => t.status !== 'completed').length || 12} itens pendentes em 4 projetos
            </p>
          </div>

          {/* Abas de filtro */}
          <div style={{ display: 'flex', gap: 32, alignItems: 'center', borderBottom: '1px solid rgba(71,71,71,0.1)', paddingBottom: 1 }}>
            {abas.map(aba => (
              <button
                key={aba}
                onClick={() => setAbaAtiva(aba)}
                style={{
                  background: 'none',
                  border: 'none',
                  borderBottom: abaAtiva === aba ? '2px solid #494bd6' : '2px solid transparent',
                  paddingBottom: 14,
                  fontSize: 14,
                  fontWeight: 700,
                  color: abaAtiva === aba ? '#ffffff' : '#6b7280',
                  cursor: 'pointer',
                  letterSpacing: '-0.025em',
                  transition: 'color 150ms ease, border-color 150ms ease',
                }}
              >
                {aba}
              </button>
            ))}
          </div>
        </div>

        {/* ══ CANVAS DE TAREFAS ═════════════════════════════════ */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 48, maxWidth: 1024 }}>

          {/* Grupos demo (apenas aba Ativo) */}
          {abaAtiva === 'Ativo' && gruposDemo.map(grupo => (
            <div key={grupo.id} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {/* Cabeçalho do grupo */}
              <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                <div style={{ width: 6, height: 6, borderRadius: 9999, background: grupo.cor, flexShrink: 0 }} />
                <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#6b7280' }}>
                  {grupo.label}
                </span>
              </div>

              {/* Linhas de tarefa */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {grupo.tarefas.map(tarefa => (
                  <div key={tarefa.id} style={{
                    display: 'flex',
                    gap: 16,
                    alignItems: 'center',
                    padding: 12,
                    borderRadius: 8,
                    cursor: 'pointer',
                    transition: 'background 150ms ease',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = '#1c1b1b')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                  >
                    {/* Checkbox */}
                    <div style={{
                      width: 20,
                      height: 20,
                      borderRadius: 4,
                      border: '1px solid #474747',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }} />

                    <span style={{ flex: 1, fontSize: 14, fontWeight: 500, color: '#ffffff' }}>
                      {tarefa.titulo}
                    </span>

                    <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                      {/* Badge de categoria */}
                      <span style={{
                        background: tarefa.categoriaDestaque ? 'rgba(73,75,214,0.1)' : '#2a2a2a',
                        color: tarefa.categoriaDestaque ? '#494bd6' : '#9ca3af',
                        fontSize: 10,
                        fontWeight: 700,
                        letterSpacing: '0.05em',
                        textTransform: 'uppercase',
                        padding: '2px 8px',
                        borderRadius: 9999,
                      }}>
                        {tarefa.categoria}
                      </span>
                      {/* Tempo */}
                      <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                        <Clock size={11} color="#6b7280" />
                        <span style={{ fontSize: 11, fontWeight: 500, color: '#6b7280' }}>{tarefa.tempo}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Tarefas reais do banco */}
          {abaAtiva !== 'Ativo' && (
            loading ? (
              <p style={{ color: '#6b7280', fontSize: 14, textAlign: 'center', padding: '40px 0' }}>
                Carregando tarefas...
              </p>
            ) : tarefasFiltradas.length === 0 ? (
              <p style={{ color: '#6b7280', fontSize: 14, textAlign: 'center', padding: '40px 0' }}>
                Nenhuma tarefa nesta categoria.
              </p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {tarefasFiltradas.map((task: any) => (
                  <div key={task.id} style={{
                    display: 'flex',
                    gap: 16,
                    alignItems: 'center',
                    padding: 12,
                    borderRadius: 8,
                  }}>
                    <button
                      onClick={() => completeTask(task.id)}
                      style={{
                        width: 20,
                        height: 20,
                        borderRadius: 4,
                        border: '1px solid #474747',
                        background: task.status === 'completed' ? '#494bd6' : 'transparent',
                        cursor: 'pointer',
                        flexShrink: 0,
                      }}
                    />
                    <span style={{
                      flex: 1,
                      fontSize: 14,
                      fontWeight: 500,
                      color: task.status === 'completed' ? '#6b7280' : '#ffffff',
                      textDecoration: task.status === 'completed' ? 'line-through' : 'none',
                    }}>
                      {task.title}
                    </span>
                    <button onClick={() => deleteTask(task.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280', fontSize: 12 }}>
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )
          )}

          {/* ══ BENTO DE INSIGHT ══════════════════════════════════ */}
          {abaAtiva === 'Ativo' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 24 }}>
              {/* Insight de Produtividade (2 colunas) */}
              <div style={{
                gridColumn: '1 / span 2',
                background: '#1c1b1b',
                border: '1px solid rgba(71,71,71,0.1)',
                borderRadius: 12,
                padding: 33,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                minHeight: 240,
              }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#494bd6' }}>
                    Insight de Produtividade
                  </span>
                  <h3 style={{ fontSize: 24, fontWeight: 700, color: '#ffffff', letterSpacing: '-0.05em', lineHeight: 1.3 }}>
                    Você é 20% mais ativo durante as horas da manhã.
                  </h3>
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
                  <p style={{ fontSize: 14, color: '#6b7280', maxWidth: 320, lineHeight: 1.5 }}>
                    Considere agendar suas tarefas de "Sistema" de alta prioridade antes das 11:00.
                  </p>
                  <button style={{ background: 'none', border: 'none', color: '#ffffff', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>
                    Ver Análises
                  </button>
                </div>
              </div>

              {/* Modo Foco (1 coluna) */}
              <div style={{
                background: '#494bd6',
                borderRadius: 12,
                padding: 32,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                minHeight: 240,
              }}>
                <Zap size={28} color="rgba(255,255,255,0.8)" />
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <h3 style={{ fontSize: 20, fontWeight: 700, color: '#ffffff' }}>Modo Foco</h3>
                  <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.8)', lineHeight: 1.5 }}>
                    Silenciar notificações por 2 horas.
                  </p>
                  <button style={{
                    marginTop: 8,
                    background: '#ffffff',
                    border: 'none',
                    borderRadius: 8,
                    padding: '8px 16px',
                    fontSize: 14,
                    fontWeight: 700,
                    color: '#494bd6',
                    cursor: 'pointer',
                    alignSelf: 'flex-start',
                  }}>
                    Ativar
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ══ BARRA DE COMANDO FLUTUANTE ════════════════════════════ */}
      <div style={{
        position: 'absolute',
        bottom: 32,
        left: '50%',
        transform: 'translateX(-50%)',
        width: 512,
      }}>
        <div style={{
          background: 'rgba(53,53,52,0.4)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(71,71,71,0.2)',
          borderRadius: 9999,
          height: 56,
          display: 'flex',
          alignItems: 'center',
          paddingLeft: 25,
          paddingRight: 25,
          gap: 16,
          boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
        }}>
          {/* Search icon */}
          <div style={{ flexShrink: 0, color: '#6b7280' }}>⌕</div>

          {/* Input */}
          <input
            type="text"
            placeholder="Digite um comando ou tarefa..."
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              outline: 'none',
              fontSize: 14,
              color: '#6b7280',
              fontFamily: 'Inter, system-ui, sans-serif',
              caretColor: '#494bd6',
            }}
          />

          {/* Keyboard hint */}
          <div style={{ display: 'flex', gap: 4, alignItems: 'center', flexShrink: 0 }}>
            <kbd style={{
              fontSize: 12,
              color: '#9ca3af',
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(71,71,71,0.3)',
              borderRadius: 4,
              padding: '2px 6px',
            }}>⌘</kbd>
            <kbd style={{
              fontSize: 10,
              color: '#9ca3af',
              background: '#2a2a2a',
              border: 'none',
              borderRadius: 4,
              padding: '4px 8px',
              fontFamily: 'monospace',
            }}>K</kbd>
          </div>
        </div>
      </div>
    </div>
  )
}
