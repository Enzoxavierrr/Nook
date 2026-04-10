import { useState, useEffect, useRef } from 'react'
import { Settings, ArrowLeft, Square, Pause, Check, Music } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const SEGUNDOS_INICIAIS = 24 * 60 + 52 // 24:52

function formatarTempo(seg: number) {
  const m = Math.floor(seg / 60)
  const s = seg % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

export default function TimerPage() {
  const navigate = useNavigate()
  const [segundosRestantes, setSegundosRestantes] = useState(SEGUNDOS_INICIAIS)
  const [emExecucao, setEmExecucao] = useState(false)
  const intervaloRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const totalSegundos = SEGUNDOS_INICIAIS
  const pctConcluido = 1 - segundosRestantes / totalSegundos

  useEffect(() => {
    if (emExecucao) {
      intervaloRef.current = setInterval(() => {
        setSegundosRestantes(s => {
          if (s <= 0) {
            clearInterval(intervaloRef.current!)
            setEmExecucao(false)
            return 0
          }
          return s - 1
        })
      }, 1000)
    } else {
      clearInterval(intervaloRef.current!)
    }
    return () => clearInterval(intervaloRef.current!)
  }, [emExecucao])

  function pausar() { setEmExecucao(false) }
  function parar()  { setEmExecucao(false); setSegundosRestantes(SEGUNDOS_INICIAIS) }
  function concluir() { setEmExecucao(false); setSegundosRestantes(0) }
  function iniciar() { setEmExecucao(true) }

  return (
    <div style={{
      flex: 1,
      background: '#131313',
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
    }}>
      {/* Gradiente topo */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 256,
        background: 'linear-gradient(to bottom, #131313, transparent)',
        zIndex: 1,
        pointerEvents: 'none',
      }} />

      {/* Gradiente rodapé */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 256,
        background: 'linear-gradient(to top, #131313, transparent)',
        zIndex: 1,
        pointerEvents: 'none',
      }} />

      {/* Glow central */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 500,
        height: 300,
        borderRadius: 9999,
        background: '#494bd6',
        opacity: 0.08,
        filter: 'blur(80px)',
        pointerEvents: 'none',
      }} />

      {/* ══ HEADER ═══════════════════════════════════════════════ */}
      <header style={{
        position: 'relative',
        zIndex: 10,
        height: 56,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingLeft: 32,
        paddingRight: 32,
      }}>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <button
            onClick={() => navigate('/dashboard')}
            style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
          >
            <ArrowLeft size={19} color="#919191" />
          </button>
          <span style={{
            fontSize: 14,
            fontWeight: 400,
            color: '#919191',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
          }}>
            Foco Profundo
          </span>
        </div>
        <button style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
          <Settings size={20} color="#919191" />
        </button>
      </header>

      {/* ══ CONTEÚDO CENTRAL ══════════════════════════════════════ */}
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        zIndex: 5,
      }}>
        <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', width: 720 }}>

          {/* Temporizador + barra de progresso lateral */}
          <div style={{ position: 'relative', width: '100%', display: 'flex', justifyContent: 'center' }}>
            <h1 style={{
              fontSize: 'clamp(120px, 15vw, 256px)',
              fontWeight: 700,
              color: '#ffffff',
              letterSpacing: '-0.05em',
              lineHeight: 1,
              textShadow: '0 0 80px rgba(73,75,214,0.1), 0 0 40px rgba(255,255,255,0.15)',
              cursor: emExecucao ? 'default' : 'pointer',
              userSelect: 'none',
            }}
              onClick={() => !emExecucao && iniciar()}
            >
              {formatarTempo(segundosRestantes)}
            </h1>

            {/* Barra de progresso vertical */}
            <div style={{
              position: 'absolute',
              right: -48,
              top: '50%',
              transform: 'translateY(-50%)',
              width: 2,
              height: 192,
              background: '#353534',
              borderRadius: 9999,
            }}>
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: `${pctConcluido * 100}%`,
                background: '#494bd6',
                borderRadius: 9999,
                boxShadow: '0 0 10px rgba(73,75,214,0.5)',
                transition: 'height 1s linear',
              }} />
            </div>
          </div>

          {/* Identidade da tarefa */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, paddingTop: 32 }}>
            <span style={{
              fontSize: 12,
              fontWeight: 400,
              color: '#919191',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
            }}>
              Em Execução
            </span>
            <p style={{
              fontSize: 30,
              fontWeight: 500,
              color: '#c6c6c6',
              letterSpacing: '-0.025em',
              textAlign: 'center',
            }}>
              Redesenhando Arquitetura do Hub de Comandos
            </p>
          </div>

          {/* Controles */}
          <div style={{
            display: 'flex',
            gap: 32,
            alignItems: 'center',
            paddingTop: 80,
          }}>
            {/* Parar */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'center' }}>
              <button
                onClick={parar}
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: 9999,
                  border: '1px solid #474747',
                  background: 'transparent',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'border-color 150ms ease, background 150ms ease',
                }}
              >
                <Square size={12} color="#919191" />
              </button>
              <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#919191' }}>
                Parar
              </span>
            </div>

            {/* Concluir (central, maior) */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'center' }}>
              <button
                onClick={emExecucao ? concluir : iniciar}
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: 9999,
                  background: '#ffffff',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  boxShadow: '0 20px 25px -5px rgba(255,255,255,0.05)',
                  transition: 'transform 150ms ease, box-shadow 150ms ease',
                }}
              >
                <Check size={16} color="#131313" strokeWidth={3} />
              </button>
              <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#ffffff' }}>
                {emExecucao ? 'Concluir' : 'Iniciar'}
              </span>
            </div>

            {/* Pausar */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'center' }}>
              <button
                onClick={pausar}
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: 9999,
                  border: '1px solid #474747',
                  background: 'transparent',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'border-color 150ms ease, background 150ms ease',
                }}
              >
                <Pause size={14} color="#919191" />
              </button>
              <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#919191' }}>
                Pausar
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ══ RODAPÉ ═══════════════════════════════════════════════ */}
      <footer style={{
        position: 'relative',
        zIndex: 10,
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        paddingLeft: 48,
        paddingRight: 48,
        paddingBottom: 32,
      }}>
        {/* Ambiente sonoro */}
        <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
          <div style={{
            background: '#1c1b1b',
            border: '1px solid rgba(71,71,71,0.1)',
            borderRadius: 8,
            width: 48,
            height: 48,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <Music size={18} color="#919191" />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', color: '#919191' }}>
              Ambiente Sonoro
            </span>
            <span style={{ fontSize: 14, color: '#c6c6c6', marginTop: 2 }}>Chuva da Meia-Noite & Ruído Marrom</span>
          </div>
        </div>

        {/* Indicador de sessão */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'flex-end' }}>
          <div style={{ display: 'flex', gap: 4 }}>
            {[1, 2, 3, 4].map(n => (
              <div key={n} style={{
                width: 8,
                height: 8,
                borderRadius: 9999,
                background: n <= 2 ? '#494bd6' : '#353534',
              }} />
            ))}
          </div>
          <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#919191' }}>
            Sessão 2 de 4
          </span>
        </div>
      </footer>
    </div>
  )
}
