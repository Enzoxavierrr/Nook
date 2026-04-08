import TopNavBar from '../components/TopNavBar/TopNavBar'
import TaskItem from '../components/TaskItem/TaskItem'
import { ArrowUpRight, Zap, Trophy } from 'lucide-react'

// ── Mock data (from Figma texts) ──────────────────────────────
const urgentTasks = [
  { id: 1, title: 'Finalize Q4 Revenue Projections',          priority: 'Priority 1', category: 'Finance',  time: undefined,     status: 'overdue' as const },
  { id: 2, title: 'Review branding guidelines for Monolith',  priority: 'Priority 1', category: 'Design',   time: '14:00 Today', status: 'pending' as const },
  { id: 3, title: 'Prepare board meeting slides',             priority: 'Priority 2', category: 'Strategy', time: '17:30 Today', status: 'pending' as const },
]

// ── Today's date greeting ─────────────────────────────────────
function getGreeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 18) return 'Good afternoon'
  return 'Good evening'
}

function getTodayLabel() {
  return new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
}

export default function Dashboard() {
  return (
    <div style={{ flex: 1, background: '#131313', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <TopNavBar />

      {/* ── Scrollable canvas ── */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          paddingTop: 48,
          paddingBottom: 96,
          paddingLeft: 32,
          paddingRight: 32,
          display: 'flex',
          flexDirection: 'column',
          gap: 64,
        }}
      >

        {/* ══ HERO SECTION ══════════════════════════════════════ */}
        <section
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#6b7280', marginBottom: 8 }}>
              {getTodayLabel()}
            </p>
            <h1 style={{ fontSize: '3.5rem', fontWeight: 700, letterSpacing: '-0.04em', color: '#ffffff', lineHeight: 1.1 }}>
              {getGreeting()},<br />Enzo.
            </h1>
          </div>

          <div style={{ textAlign: 'right', paddingTop: 8 }}>
            <p style={{ fontSize: 12, color: '#6b7280', marginBottom: 4 }}>Tasks completed today</p>
            <p style={{ fontSize: '2rem', fontWeight: 700, color: '#ffffff', letterSpacing: '-0.02em' }}>3 / 8</p>
          </div>
        </section>

        {/* ══ BENTO GRID — At a Glance ══════════════════════════ */}
        <section>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr 304px',
              gap: 16,
            }}
          >
            {/* Card 1 — Focus Mode (large) */}
            <div
              style={{
                background: '#0e0e0e',
                borderRadius: 12,
                padding: '32px 32px',
                display: 'flex',
                flexDirection: 'column',
                gap: 32,
                gridColumn: 'span 1',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <p style={{ fontSize: 18, fontWeight: 600, color: '#ffffff' }}>Focus Mode</p>
                  <p style={{ fontSize: 14, color: '#6b7280', marginTop: 4 }}>Design System Refactoring</p>
                </div>
                <span
                  style={{
                    background: 'rgba(73,75,214,0.10)',
                    color: '#494bd6',
                    fontSize: 10,
                    fontWeight: 700,
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                    padding: '4px 12px',
                    borderRadius: 9999,
                  }}
                >
                  Active
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <p style={{ fontSize: 30, fontWeight: 700, color: '#ffffff', letterSpacing: '-0.02em' }}>72%</p>
                  <p style={{ fontSize: 12, color: '#9ca3af' }}>08:00 — 18:00</p>
                </div>
                {/* Progress bar */}
                <div style={{ height: 6, background: '#2a2a2a', borderRadius: 9999, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: '72%', background: '#ffffff', borderRadius: 9999 }} />
                </div>
              </div>
            </div>

            {/* Card 2 — Precision Noir Insights */}
            <div
              style={{
                background: '#0e0e0e',
                borderRadius: 12,
                padding: '32px 32px',
                display: 'flex',
                flexDirection: 'column',
                gap: 20,
              }}
            >
              <p style={{ fontSize: 24, fontWeight: 700, color: '#ffffff', letterSpacing: '-0.02em', lineHeight: 1.2 }}>
                Precision Noir<br />Insights
              </p>
              <p style={{ fontSize: 14, color: '#9ca3af', lineHeight: 1.6 }}>
                You have completed 14% more tasks before 12 PM compared to last week. Your peak focus hours are currently between 9:00 AM and 11:30 AM.
              </p>
              <button
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  background: 'none',
                  border: 'none',
                  color: '#494bd6',
                  fontSize: 14,
                  fontWeight: 700,
                  cursor: 'pointer',
                  padding: 0,
                }}
              >
                View full analytics
                <ArrowUpRight size={14} />
              </button>
            </div>

            {/* Card 3 — Efficiency Score (small) */}
            <div
              style={{
                background: '#2a2a2a',
                borderRadius: 12,
                padding: '32px 32px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <Zap size={24} color="#494bd6" />
              <div>
                <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#9ca3af', marginBottom: 4 }}>
                  Efficiency Score
                </p>
                <p style={{ fontSize: 36, fontWeight: 700, color: '#ffffff', letterSpacing: '-0.04em' }}>A+</p>
              </div>
            </div>
          </div>
        </section>

        {/* ══ URGENT TASKS ══════════════════════════════════════ */}
        <section style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h2 style={{ fontSize: 16, fontWeight: 600, color: '#ffffff' }}>Most Urgent</h2>
            <button
              style={{
                background: 'none',
                border: 'none',
                color: '#6b7280',
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                cursor: 'pointer',
              }}
            >
              View All Tasks
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {urgentTasks.map(task => (
              <TaskItem key={task.id} task={task} />
            ))}
          </div>
        </section>

        {/* ══ PROJECT INSIGHTS ══════════════════════════════════ */}
        <section>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 16,
              paddingTop: 16,
            }}
          >
            {/* Quarterly Review card */}
            <div
              style={{
                background: '#1c1b1b',
                borderRadius: 12,
                padding: '32px 32px',
                display: 'flex',
                flexDirection: 'column',
                gap: 16,
              }}
            >
              <div>
                <p style={{ fontSize: 20, fontWeight: 700, color: '#ffffff', letterSpacing: '-0.02em' }}>
                  Quarterly Review
                </p>
                <p style={{ fontSize: 14, color: '#d1d5db', marginTop: 4 }}>
                  Strategy session with stakeholders
                </p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 16 }}>
                {/* Avatar stack */}
                {['EX', 'AL', 'MR'].map((initials, i) => (
                  <div
                    key={initials}
                    style={{
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
                      border: '2px solid #1c1b1b',
                    }}
                  >
                    {initials}
                  </div>
                ))}
                <div
                  style={{
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
                    border: '2px solid #1c1b1b',
                  }}
                >
                  +4
                </div>
              </div>
            </div>

            {/* Precision Noir Insights extended */}
            <div
              style={{
                background: '#0e0e0e',
                borderRadius: 12,
                padding: '32px 32px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Trophy size={18} color="#494bd6" />
                <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#6b7280' }}>
                  This week
                </p>
              </div>
              <div>
                <p style={{ fontSize: '2.5rem', fontWeight: 700, color: '#ffffff', letterSpacing: '-0.04em' }}>
                  24
                </p>
                <p style={{ fontSize: 14, color: '#9ca3af', marginTop: 4 }}>tasks completed</p>
              </div>
              <div style={{ height: 6, background: '#2a2a2a', borderRadius: 9999, overflow: 'hidden', marginTop: 8 }}>
                <div style={{ height: '100%', width: '68%', background: '#494bd6', borderRadius: 9999 }} />
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
