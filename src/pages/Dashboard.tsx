import { ArrowUpRight, Zap } from 'lucide-react'
import TopNavBar from '../components/TopNavBar/TopNavBar'

// ── Dados mock ─────────────────────────────────────────────────
const tarefasUrgentes = [
  { id: 1, titulo: 'Finalizar Projeções de Receita Q4', prioridade: 'Prioridade 1', categoria: 'Finanças',   tempo: undefined,       status: 'overdue' as const },
  { id: 2, titulo: 'Revisar diretrizes de marca para Monolith', prioridade: 'Prioridade 1', categoria: 'Design',    tempo: '14:00 Hoje', status: 'pendente' as const },
  { id: 3, titulo: 'Preparar slides para reunião do board',       prioridade: 'Prioridade 2', categoria: 'Estratégia', tempo: '17:30 Hoje', status: 'pendente' as const },
]

function getDataHoje() {
  return new Date().toLocaleDateString('pt-BR', { weekday: 'long', month: 'short', day: 'numeric' })
    .replace(/^\w/, c => c.toUpperCase())
}

// ── Task item compacto ─────────────────────────────────────────
function TaskItemRow({ task }: { task: typeof tarefasUrgentes[0] }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: 21,
      background: '#1c1b1b',
      borderRadius: 8,
      cursor: 'pointer',
      transition: 'background 150ms ease',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
        {/* Checkbox */}
        <div style={{
          width: 24,
          height: 24,
          borderRadius: 6,
          border: '2px solid #474747',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }} />

        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <p style={{ fontSize: 14, fontWeight: 500, color: '#ffffff', letterSpacing: '-0.025em' }}>
            {task.titulo}
          </p>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <span style={{ fontSize: 10, color: '#6b7280' }}>{task.prioridade}</span>
            <span style={{ fontSize: 10, color: '#6b7280' }}>{task.categoria}</span>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
        {task.status === 'overdue' ? (
          <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#ffb4ab' }}>
            Atrasada
          </span>
        ) : (
          <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#6b7280' }}>
            {task.tempo}
          </span>
        )}
        {/* Arrow icon */}
        <div style={{ width: 14, height: 3, background: '#474747', borderRadius: 9999 }} />
      </div>
    </div>
  )
}

export default function Dashboard() {
  return (
    <div style={{ flex: 1, background: '#131313', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <TopNavBar placeholder="Buscar tarefas..." />

      <div style={{
        flex: 1,
        overflowY: 'auto',
        paddingTop: 48,
        paddingBottom: 96,
        paddingLeft: 32,
        paddingRight: 32,
        display: 'flex',
        flexDirection: 'column',
        gap: 64,
      }}>

        {/* ══ HERO ═══════════════════════════════════════════════ */}
        <section style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <p style={{
              fontSize: 16,
              fontWeight: 700,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color: '#6b7280',
            }}>
              {getDataHoje()}
            </p>
            <h1 style={{
              fontSize: 56,
              fontWeight: 700,
              letterSpacing: '-0.04em',
              color: '#ffffff',
              lineHeight: '56px',
            }}>
              Hoje
            </h1>
          </div>

          <div style={{ display: 'flex', gap: 32, alignItems: 'center', paddingBottom: 8 }}>
            {/* Tempo Rastreado */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'flex-end' }}>
              <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#6b7280' }}>
                Tempo Rastreado
              </p>
              <p style={{ fontSize: 24, fontWeight: 600, color: '#ffffff', letterSpacing: '-0.05em' }}>04h 22m</p>
            </div>

            {/* Divisor */}
            <div style={{ width: 1, height: 40, background: 'rgba(71,71,71,0.3)' }} />

            {/* Tarefas Pendentes */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'flex-end' }}>
              <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#6b7280' }}>
                Tarefas Pendentes
              </p>
              <p style={{ fontSize: 24, fontWeight: 600, color: '#ffffff', letterSpacing: '-0.05em' }}>12</p>
            </div>
          </div>
        </section>

        {/* ══ BENTO GRID — Visão Geral ══════════════════════════ */}
        <section style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 24 }}>
          {/* Modo Foco (ocupa 2/3) */}
          <div style={{
            gridColumn: '1 / span 2',
            background: '#1c1b1b',
            borderRadius: 12,
            padding: 32,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            minHeight: 220,
          }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <h3 style={{ fontSize: 18, fontWeight: 600, color: '#ffffff', letterSpacing: '-0.025em' }}>Modo Foco</h3>
                <p style={{ fontSize: 14, color: '#6b7280' }}>Refatoração do Sistema de Design</p>
              </div>
              <span style={{
                background: 'rgba(73,75,214,0.1)',
                color: '#494bd6',
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                padding: '4px 12px',
                borderRadius: 9999,
              }}>
                Ativo
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, paddingTop: 32 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <p style={{ fontSize: 30, fontWeight: 700, color: '#ffffff', letterSpacing: '-0.05em' }}>72%</p>
                <p style={{ fontSize: 12, color: '#9ca3af' }}>08:00 — 18:00</p>
              </div>
              <div style={{ height: 6, background: '#2a2a2a', borderRadius: 9999, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: '72%', background: '#ffffff', borderRadius: 9999 }} />
              </div>
            </div>
          </div>

          {/* Pontuação de Eficiência */}
          <div style={{
            background: '#2a2a2a',
            border: '1px solid rgba(71,71,71,0.05)',
            borderRadius: 12,
            padding: 33,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            minHeight: 220,
          }}>
            <Zap size={24} color="#494bd6" />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#9ca3af' }}>
                Pontuação de Eficiência
              </p>
              <p style={{ fontSize: 36, fontWeight: 700, color: '#ffffff', letterSpacing: '-0.05em' }}>A+</p>
            </div>
          </div>
        </section>

        {/* ══ MAIS URGENTE ══════════════════════════════════════ */}
        <section style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h2 style={{ fontSize: 16, fontWeight: 600, color: '#ffffff', letterSpacing: '-0.02em' }}>
              Mais Urgente
            </h2>
            <button style={{
              background: 'none',
              border: 'none',
              color: '#6b7280',
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              cursor: 'pointer',
            }}>
              Ver Todas as Tarefas
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {tarefasUrgentes.map(task => (
              <TaskItemRow key={task.id} task={task} />
            ))}
          </div>
        </section>

        {/* ══ INSIGHTS DE PROJETO ═══════════════════════════════ */}
        <section style={{ paddingTop: 16 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }}>
            {/* Card — Revisão Trimestral */}
            <div style={{
              background: '#0e0e0e',
              borderRadius: 12,
              overflow: 'hidden',
              position: 'relative',
              minHeight: 261,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-end',
              padding: 32,
            }}>
              {/* Background gradient overlay */}
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to top, #131313 0%, transparent 60%)',
                zIndex: 1,
              }} />

              {/* Placeholder image area */}
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(135deg, #2a2a2a 0%, #1c1b1b 100%)',
              }} />

              <div style={{ position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', gap: 4 }}>
                <h3 style={{ fontSize: 20, fontWeight: 700, color: '#ffffff', letterSpacing: '-0.025em' }}>
                  Revisão Trimestral
                </h3>
                <p style={{ fontSize: 14, color: '#d1d5db' }}>Sessão estratégica com stakeholders</p>

                {/* Avatar stack */}
                <div style={{ display: 'flex', alignItems: 'center', paddingTop: 16 }}>
                  {['EX', 'AL', 'MR'].map((initials, i) => (
                    <div key={initials} style={{
                      width: 32,
                      height: 32,
                      borderRadius: 9999,
                      background: i === 0 ? '#494bd6' : '#2a2a2a',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 11,
                      fontWeight: 700,
                      color: '#e5e2e1',
                      marginLeft: i > 0 ? -8 : 0,
                      border: '2px solid #131313',
                    }}>
                      {initials}
                    </div>
                  ))}
                  <div style={{
                    width: 32,
                    height: 32,
                    borderRadius: 9999,
                    background: '#2a2a2a',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 10,
                    fontWeight: 700,
                    color: '#e5e2e1',
                    marginLeft: -8,
                    border: '2px solid #131313',
                  }}>
                    +4
                  </div>
                </div>
              </div>
            </div>

            {/* Card — Insights de Produtividade */}
            <div style={{
              background: '#0e0e0e',
              borderRadius: 12,
              padding: 32,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              gap: 16,
              minHeight: 261,
            }}>
              <div>
                <h3 style={{ fontSize: 24, fontWeight: 700, color: '#ffffff', letterSpacing: '-0.05em', lineHeight: 1.3, marginBottom: 16 }}>
                  Insights de Produtividade
                </h3>
                <p style={{ fontSize: 14, color: '#9ca3af', lineHeight: 1.625 }}>
                  Você concluiu 14% mais tarefas antes das 12h comparado à semana passada. Seu pico de foco está entre 9:00 e 11:30.
                </p>
              </div>

              <button style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                background: 'none',
                border: 'none',
                color: '#494bd6',
                fontSize: 14,
                fontWeight: 700,
                cursor: 'pointer',
                padding: 0,
              }}>
                Ver análises completas
                <ArrowUpRight size={14} />
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
