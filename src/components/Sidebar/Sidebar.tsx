import { NavLink } from 'react-router-dom'
import {
  CalendarDays,
  CheckSquare,
  FolderKanban,
  BarChart2,
  Plus,
} from 'lucide-react'
import NookLogo from '../../public/icon.png'

const navItems = [
  { to: '/dashboard', label: 'Hoje',         icon: CalendarDays },
  { to: '/tasks',     label: 'Tarefas',      icon: CheckSquare  },
  { to: '/projects',  label: 'Projetos',     icon: FolderKanban },
  { to: '/stats',     label: 'Estatísticas', icon: BarChart2    },
]

interface Props {
  onNovaTargefa?: () => void
}

export default function Sidebar({ onNovaTargefa }: Props) {
  return (
    <aside style={{
      width: 256,
      minWidth: 256,
      background: '#1c1b1b',
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      padding: '24px 16px',
      justifyContent: 'space-between',
      flexShrink: 0,
    }}>
      {/* ── Topo ── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
        {/* Marca */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          paddingLeft: 8,
          paddingRight: 8,
          paddingBottom: 40,
        }}>
          <div style={{
            width: 31,
            height: 31,
            borderRadius: 6,
            background: 'linear-gradient(180deg, #5b57ff 0%, #494bd6 100%)',
            boxShadow: '0 8px 18px rgba(73, 75, 214, 0.24)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            overflow: 'hidden',
          }}>
            <img src={NookLogo} alt="Nook" width={18} height={18} style={{ objectFit: 'contain' }} />
          </div>
          <div>
            <p style={{ fontSize: 18, fontWeight: 700, color: '#ffffff', letterSpacing: '-0.025em', lineHeight: '28px' }}>
              Nook
            </p>
            <p style={{ fontSize: 10, fontWeight: 700, color: '#6b7280', letterSpacing: '0.15em', textTransform: 'uppercase', lineHeight: '15px' }}>
              Workspace
            </p>
          </div>
        </div>

        {/* Navegação */}
        <nav style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '8px 12px',
                borderRadius: 6,
                textDecoration: 'none',
                fontSize: 14,
                fontWeight: isActive ? 600 : 500,
                color: isActive ? '#ffffff' : '#9ca3af',
                background: isActive ? '#2a2a2a' : 'transparent',
                transition: 'all 150ms ease-out',
              })}
            >
              {({ isActive }) => (
                <>
                  <Icon size={isActive ? 16 : 15} />
                  {label}
                </>
              )}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* ── Rodapé ── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
        {/* Botão Nova Tarefa */}
        <button
          onClick={onNovaTargefa}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            height: 40,
            fontSize: 14,
            fontWeight: 700,
            color: '#07006c',
            background: '#ffffff',
            border: 'none',
            borderRadius: 8,
            cursor: 'pointer',
            transition: 'opacity 150ms ease',
            marginBottom: 25,
          }}
        >
          <Plus size={8} color="#07006c" />
          Nova Tarefa
        </button>

        {/* Divisor */}
        <div style={{ borderTop: '1px solid rgba(71,71,71,0.1)', paddingTop: 17 }}>
          {/* Usuário */}
          <div style={{ display: 'flex', gap: 12, alignItems: 'center', paddingLeft: 8 }}>
            <div style={{
              width: 32,
              height: 32,
              borderRadius: 9999,
              background: '#494bd6',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 11,
              fontWeight: 700,
              color: '#fff',
              flexShrink: 0,
            }}>
              EX
            </div>
            <div style={{ minWidth: 0 }}>
              <p style={{ fontSize: 12, fontWeight: 700, color: '#ffffff', lineHeight: '16px' }}>Enzo Xavier</p>
              <p style={{ fontSize: 10, color: '#6b7280', lineHeight: '15px' }}>Plano Pro</p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  )
}
