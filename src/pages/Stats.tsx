import { ArrowUpRight, Zap, Clock, Sparkles } from 'lucide-react'
import TopNavBar from '../components/TopNavBar/TopNavBar'

// ── Dados das métricas hero ───────────────────────────────────
const metricas = [
  {
    label: 'Horas de Trabalho Profundo',
    valor: '42,8',
    tendencia: '+12% vs semana passada',
    corTendencia: '#494bd6',
    setaUp: true,
  },
  {
    label: 'Taxa de Conclusão',
    valor: '94',
    sufixo: '%',
    tendencia: 'Top 5% dos usuários',
    corTendencia: '#494bd6',
    setaUp: true,
  },
  {
    label: 'Tarefas Concluídas',
    valor: '128',
    descricao: 'Em 14 projetos ativos',
    corDescricao: '#4b5563',
  },
  {
    label: 'Pontuação de Foco',
    valor: '8,2',
    descricao: 'Desempenho máximo atingido',
    corDescricao: '#4b5563',
  },
]

// ── Dados do gráfico de barras ────────────────────────────────
const alocacaoProjeto = [
  { nome: 'Identidade de Marca',  horas: '18,5h', pct: 85 },
  { nome: 'UI App Mobile',        horas: '12,2h', pct: 55 },
  { nome: 'Plataforma Web',       horas: '9,4h',  pct: 42 },
  { nome: 'Pesquisa',             horas: '4,1h',  pct: 18 },
]

// ── Dias da semana (gráfico de linha mock) ────────────────────
const diasSemana = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom']
const valoresMock = [6, 8, 10, 14, 18, 15, 20] // Tasks completed

// ── Tabela de Produtividade ───────────────────────────────────
const tabelaLog = [
  { data: '12 Abr, 2024', categoria: 'Engenharia',          horas: '6,5h', producao: '18 Tarefas', status: 'Ótimo', statusCor: '#14532d', textoCor: '#4ade80' },
  { data: '11 Abr, 2024', categoria: 'Gestão',              horas: '4,2h', producao: '12 Tarefas', status: 'Ótimo', statusCor: '#14532d', textoCor: '#4ade80' },
  { data: '10 Abr, 2024', categoria: 'Design Ops',          horas: '5,8h', producao: '22 Tarefas', status: 'Pico',  statusCor: 'rgba(73,75,214,0.2)', textoCor: '#494bd6' },
  { data: '09 Abr, 2024', categoria: 'Lançamento de Projeto', horas: '8,1h', producao: '31 Tarefas', status: 'Pico', statusCor: 'rgba(73,75,214,0.2)', textoCor: '#494bd6' },
]

export default function Stats() {
  const maxValor = Math.max(...valoresMock)

  return (
    <div style={{ flex: 1, background: '#131313', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <TopNavBar placeholder="Buscar análises..." />

      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: 48,
        display: 'flex',
        flexDirection: 'column',
        gap: 64,
        maxWidth: 1280,
      }}>

        {/* ══ MÉTRICAS HERO ══════════════════════════════════════ */}
        <section style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 48 }}>
          {metricas.map((m, i) => (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 8, alignSelf: 'flex-end' }}>
              <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#6b7280' }}>
                {m.label}
              </p>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: 0 }}>
                <p style={{ fontSize: 56, fontWeight: 700, color: '#ffffff', letterSpacing: '-0.04em', lineHeight: '56px' }}>
                  {m.valor}
                </p>
                {m.sufixo && (
                  <p style={{ fontSize: 24, fontWeight: 700, color: '#6b7280', letterSpacing: '-0.04em', lineHeight: '56px', alignSelf: 'flex-end' }}>
                    {m.sufixo}
                  </p>
                )}
              </div>
              {m.tendencia ? (
                <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                  <span style={{ fontSize: 12, color: m.corTendencia, fontWeight: 500 }}>
                    {m.setaUp ? '↑' : '↓'} {m.tendencia}
                  </span>
                </div>
              ) : (
                <p style={{ fontSize: 12, color: m.corDescricao }}>{m.descricao}</p>
              )}
            </div>
          ))}
        </section>

        {/* ══ VISUALIZAÇÕES PRINCIPAIS ══════════════════════════ */}
        <section style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr', gap: 32, gridTemplateRows: '404px' }}>
          {/* Gráfico de Linha (8/12 colunas) */}
          <div style={{
            gridColumn: '1 / span 8',
            background: '#1c1b1b',
            borderRadius: 12,
            padding: '32px 32px 36px',
            display: 'flex',
            flexDirection: 'column',
            gap: 32,
            overflow: 'hidden',
          }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <h3 style={{ fontSize: 18, fontWeight: 600, color: '#ffffff', letterSpacing: '-0.02em' }}>
                  Tarefas Concluídas ao Longo do Tempo
                </h3>
                <p style={{ fontSize: 12, color: '#6b7280' }}>Rastreamento de velocidade diária</p>
              </div>
              <div style={{
                background: '#2a2a2a',
                borderRadius: 4,
                padding: '4px 8px',
              }}>
                <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', color: '#ffffff' }}>
                  Sprint 04
                </span>
              </div>
            </div>

            {/* Gráfico de linha SVG simples */}
            <div style={{ flex: 1, position: 'relative', borderLeft: '1px solid rgba(71,71,71,0.2)', borderBottom: '1px solid rgba(71,71,71,0.2)', paddingLeft: 8 }}>
              {/* Labels Y */}
              {[20, 15, 10, 5, 0].map((v, i) => (
                <span key={v} style={{
                  position: 'absolute',
                  left: -28,
                  fontSize: 10,
                  color: '#4b5563',
                  fontWeight: 500,
                  top: `${(i / 4) * 100}%`,
                  transform: 'translateY(-50%)',
                }}>
                  {v}
                </span>
              ))}

              <svg width="100%" height="100%" viewBox="0 0 544 230" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#ffffff" stopOpacity="0.15" />
                    <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
                  </linearGradient>
                </defs>
                {/* Área preenchida */}
                <path
                  d={`M ${valoresMock.map((v, i) => `${(i / 6) * 544},${230 - (v / maxValor) * 210}`).join(' L ')} L 544,230 L 0,230 Z`}
                  fill="url(#lineGrad)"
                />
                {/* Linha */}
                <polyline
                  points={valoresMock.map((v, i) => `${(i / 6) * 544},${230 - (v / maxValor) * 210}`).join(' ')}
                  fill="none"
                  stroke="#ffffff"
                  strokeWidth="2"
                  strokeLinejoin="round"
                />
                {/* Pontos */}
                {valoresMock.map((v, i) => (
                  <circle
                    key={i}
                    cx={(i / 6) * 544}
                    cy={230 - (v / maxValor) * 210}
                    r="4"
                    fill="#494bd6"
                  />
                ))}
              </svg>

              {/* Labels X */}
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
                {diasSemana.map(d => (
                  <span key={d} style={{ fontSize: 10, color: '#4b5563', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '-0.05em' }}>
                    {d}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Alocação por Projeto (4/12 colunas) */}
          <div style={{
            gridColumn: '9 / span 4',
            background: '#1c1b1b',
            border: '1px solid rgba(71,71,71,0.1)',
            borderRadius: 12,
            padding: 33,
            display: 'flex',
            flexDirection: 'column',
            gap: 32,
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <h3 style={{ fontSize: 18, fontWeight: 600, color: '#ffffff', letterSpacing: '-0.02em' }}>
                Alocação por Projeto
              </h3>
              <p style={{ fontSize: 12, color: '#6b7280' }}>Total de horas por categoria</p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              {alocacaoProjeto.map(p => (
                <div key={p.nome} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', color: '#9ca3af' }}>
                      {p.nome}
                    </span>
                    <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', color: '#ffffff' }}>
                      {p.horas}
                    </span>
                  </div>
                  <div style={{ height: 6, background: '#2a2a2a', borderRadius: 9999, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${p.pct}%`, background: '#ffffff', borderRadius: 9999 }} />
                  </div>
                </div>
              ))}
            </div>

            <button style={{
              display: 'flex',
              gap: 4,
              alignItems: 'center',
              background: 'none',
              border: 'none',
              color: '#494bd6',
              fontSize: 12,
              fontWeight: 700,
              cursor: 'pointer',
              padding: '16px 0 0',
            }}>
              Ver detalhamento completo
              <ArrowUpRight size={8} />
            </button>
          </div>
        </section>

        {/* ══ CARDS SECUNDÁRIOS ══════════════════════════════════ */}
        <section style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 32 }}>
          {[
            {
              icon: Zap,
              label: 'Pico de Atividade',
              valor: '09:00 — 11:30',
              desc: 'Janela de foco matinal confirmada',
            },
            {
              icon: Clock,
              label: 'Sessão Média',
              valor: '52 Minutos',
              desc: '+4 min desde março',
            },
            {
              icon: Sparkles,
              label: 'Consistência',
              valor: 'Sequência de 12 Dias',
              desc: 'Nível elite de desempenho ativo',
            },
          ].map(card => {
            const Icon = card.icon
            return (
              <div key={card.label} style={{
                background: '#0e0e0e',
                border: '1px solid rgba(71,71,71,0.1)',
                borderRadius: 12,
                padding: 25,
                display: 'flex',
                gap: 16,
                alignItems: 'flex-start',
              }}>
                <div style={{
                  background: '#2a2a2a',
                  borderRadius: 8,
                  width: 40,
                  height: 40,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  <Icon size={18} color="#e5e2e1" />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#6b7280' }}>
                    {card.label}
                  </span>
                  <span style={{ fontSize: 18, fontWeight: 600, color: '#ffffff', marginTop: 2 }}>{card.valor}</span>
                  <span style={{ fontSize: 10, color: '#4b5563', marginTop: 4 }}>{card.desc}</span>
                </div>
              </div>
            )
          })}
        </section>

        {/* ══ TABELA DE PRODUTIVIDADE ════════════════════════════ */}
        <section style={{ borderTop: '1px solid rgba(71,71,71,0.1)', paddingTop: 49, display: 'flex', flexDirection: 'column', gap: 32 }}>
          {/* Cabeçalho da seção */}
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#4b5563' }}>
                Registro de Produtividade
              </span>
              <h3 style={{ fontSize: 20, fontWeight: 700, color: '#ffffff' }}>Últimos 7 Dias</h3>
            </div>
            <button style={{
              background: '#2a2a2a',
              border: 'none',
              borderRadius: 4,
              padding: '8px 16px',
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
              color: '#ffffff',
              cursor: 'pointer',
            }}>
              Exportar CSV
            </button>
          </div>

          {/* Tabela */}
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(71,71,71,0.2)' }}>
                {['Data', 'Categoria', 'Trabalho Profundo', 'Produção', 'Status'].map((col, i) => (
                  <th key={col} style={{
                    padding: '16px 1px',
                    textAlign: i >= 2 ? 'right' : 'left',
                    fontSize: 10,
                    fontWeight: 700,
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                    color: '#6b7280',
                  }}>
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tabelaLog.map((row, i) => (
                <tr key={i} style={{ borderBottom: '1px solid rgba(71,71,71,0.1)' }}>
                  <td style={{ padding: '20px 1px', fontSize: 14, fontWeight: 500, color: '#9ca3af' }}>{row.data}</td>
                  <td style={{ padding: '20px 1px', fontSize: 14, fontWeight: 500, color: '#ffffff' }}>{row.categoria}</td>
                  <td style={{ padding: '20px 1px', fontSize: 14, color: '#d1d5db', textAlign: 'right', fontFamily: 'monospace' }}>{row.horas}</td>
                  <td style={{ padding: '20px 1px', fontSize: 14, color: '#d1d5db', textAlign: 'right', fontFamily: 'monospace' }}>{row.producao}</td>
                  <td style={{ padding: '20px 1px', textAlign: 'right' }}>
                    <span style={{
                      background: row.statusCor,
                      color: row.textoCor,
                      fontSize: 9,
                      fontWeight: 700,
                      letterSpacing: '-0.03em',
                      textTransform: 'uppercase',
                      padding: '3px 8px',
                      borderRadius: 9999,
                    }}>
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* ══ BARRA DE COMANDO FLUTUANTE ════════════════════════ */}
        <div style={{
          position: 'fixed',
          bottom: 48,
          left: '50%',
          transform: 'translateX(-50%)',
        }}>
          <div style={{
            background: 'rgba(53,53,52,0.4)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid rgba(71,71,71,0.2)',
            borderRadius: 12,
            padding: '17px 25px',
            display: 'flex',
            gap: 16,
            alignItems: 'center',
            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
          }}>
            {/* Divisor com ⌘K */}
            <div style={{ display: 'flex', gap: 8, alignItems: 'center', paddingRight: 17, borderRight: '1px solid rgba(71,71,71,0.3)' }}>
              <kbd style={{ fontSize: 10, color: '#ffffff', background: '#353534', borderRadius: 4, padding: '2px 6px', fontFamily: 'monospace' }}>K</kbd>
            </div>
            {/* Botões */}
            {[
              { label: 'Registro Rápido' },
              { label: 'Filtrar'         },
              { label: 'Relatório'       },
            ].map(btn => (
              <button key={btn.label} style={{
                background: 'none',
                border: 'none',
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: '#ffffff',
                cursor: 'pointer',
              }}>
                {btn.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
