import Timer from '../components/Timer/Timer'
import { Clock, TrendingUp } from 'lucide-react'

export default function TimerPage() {
  return (
    <main
      style={{
        flex: 1,
        background: '#131313',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
        overflowY: 'auto',
        gap: 32,
      }}
    >
      {/* Header */}
      <div style={{ textAlign: 'center' }}>
        <h1 style={{ fontSize: 28, fontWeight: 600, color: '#ffffff', marginBottom: 8 }}>
          Sessão de Tempo
        </h1>
        <p style={{ color: '#6b7280', fontSize: 14 }}>
          Monitore o tempo gasto nas suas tarefas
        </p>
      </div>

      {/* Timer Component */}
      <Timer />

      {/* Stats placeholder */}
      <div style={{ display: 'flex', gap: 24, marginTop: 32 }}>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 8,
            padding: '16px 24px',
            background: '#1c1b1b',
            borderRadius: 8,
            border: '1px solid #2a2a2a',
          }}
        >
          <Clock size={20} color="#494bd6" />
          <p style={{ color: '#6b7280', fontSize: 12 }}>Tempo Total</p>
          <p style={{ color: '#ffffff', fontSize: 16, fontWeight: 600 }}>0h 0m</p>
        </div>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 8,
            padding: '16px 24px',
            background: '#1c1b1b',
            borderRadius: 8,
            border: '1px solid #2a2a2a',
          }}
        >
          <TrendingUp size={20} color="#10b981" />
          <p style={{ color: '#6b7280', fontSize: 12 }}>Tarefas Concluídas</p>
          <p style={{ color: '#ffffff', fontSize: 16, fontWeight: 600 }}>0</p>
        </div>
      </div>
    </main>
  )
}
