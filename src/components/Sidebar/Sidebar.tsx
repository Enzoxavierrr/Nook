import { NavLink } from 'react-router-dom'
import {
  CalendarDays,
  CheckSquare,
  FolderKanban,
  BarChart2,
  Plus,
  Settings,
} from 'lucide-react'
import NookLogo from '../../public/icon.png'

const navItems = [
  { to: '/dashboard', label: 'Today',    icon: CalendarDays },
  { to: '/tasks',     label: 'Tasks',    icon: CheckSquare  },
  { to: '/projects',  label: 'Projects', icon: FolderKanban },
  { to: '/stats',     label: 'Stats',    icon: BarChart2    },
]

export default function Sidebar() {
  return (
    <aside
      className="sidebar"
      style={{
        width: 256,
        minWidth: 256,
        background: '#1c1b1b',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        padding: '32px 18px 24px',
        gap: 14,
      }}
    >
      {/* ── Brand ── */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 14,
          paddingLeft: 8,
          paddingRight: 8,
          paddingBottom: 22,
          marginTop: 2,
        }}
      >
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: 12,
            background: 'linear-gradient(180deg, #5b57ff 0%, #494bd6 100%)',
            boxShadow: '0 10px 22px rgba(73, 75, 214, 0.24)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            overflow: 'hidden',
          }}
        >
          <img src={NookLogo} alt="Nook" width={22} height={22} style={{ objectFit: 'contain' }} />
        </div>
        <div>
          <p style={{ fontSize: 18, fontWeight: 700, color: '#ffffff', lineHeight: 1.1 }}>
            Nook
          </p>
          <p
            style={{
              fontSize: 11,
              color: '#8b8f98',
              marginTop: 4,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
            }}
          >
            Personal workspace
          </p>
        </div>
      </div>

      {/* ── User ── */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 14,
          padding: '0 8px 18px',
        }}
      >
        <div
          style={{
            width: 28,
            height: 28,
            borderRadius: 9999,
            background: '#494bd6',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 11,
            fontWeight: 700,
            color: '#fff',
            flexShrink: 0,
          }}
        >
          EX
        </div>
        <div style={{ minWidth: 0 }}>
          <p style={{ fontSize: 14, fontWeight: 600, color: '#ffffff', lineHeight: 1.2 }}>
            Enzo Xavier
          </p>
          <p style={{ fontSize: 11, color: '#6b7280', marginTop: 2 }}>Workspace owner</p>
        </div>
      </div>

      {/* ── Navigation ── */}
      <nav style={{ display: 'flex', flexDirection: 'column', gap: 6, flex: 1, paddingTop: 2 }}>
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: '10px 12px',
              borderRadius: 8,
              textDecoration: 'none',
              fontSize: 14,
              fontWeight: isActive ? 500 : 400,
              color: isActive ? '#ffffff' : '#6b7280',
              background: isActive ? '#2a2a2a' : 'transparent',
              transition: 'all 150ms ease-out',
            })}
          >
            <Icon size={16} />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* ── Bottom actions ── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 18, marginTop: 'auto', paddingTop: 18 }}>
        {/* New Task button */}
        <button
          className="btn-primary"
          style={{
            width: '100%',
            justifyContent: 'center',
            gap: 8,
            height: 40,
            fontSize: 14,
            fontWeight: 600,
            borderRadius: 10,
          }}
        >
          <Plus size={16} />
          New Task
        </button>

        {/* Settings row */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            paddingLeft: 8,
            paddingRight: 8,
            cursor: 'pointer',
          }}
        >
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: 9999,
              background: '#494bd6',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 11,
              fontWeight: 700,
              color: '#fff',
              flexShrink: 0,
            }}
          >
            EX
          </div>
          <Settings size={14} color="#6b7280" style={{ marginLeft: 'auto' }} />
        </div>
      </div>
    </aside>
  )
}
