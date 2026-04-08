import { NavLink } from 'react-router-dom'
import {
  CalendarDays,
  CheckSquare,
  FolderKanban,
  BarChart2,
  Plus,
  Settings,
} from 'lucide-react'
import NookLogo from '../../svg/Icon.svg'

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
        padding: '24px 16px',
        gap: 0,
      }}
    >
      {/* ── Logo + User ── */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          paddingLeft: 8,
          paddingRight: 8,
          paddingBottom: 40,
        }}
      >
        <img src={NookLogo} alt="Nook" width={32} height={32} />
        <div>
          <p style={{ fontSize: 14, fontWeight: 600, color: '#ffffff', lineHeight: 1.2 }}>
            Enzo Xavier
          </p>
          <p style={{ fontSize: 11, color: '#6b7280', marginTop: 2 }}>Personal workspace</p>
        </div>
      </div>

      {/* ── Navigation ── */}
      <nav style={{ display: 'flex', flexDirection: 'column', gap: 4, flex: 1 }}>
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
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
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
            borderRadius: 8,
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
