import { Search, Bell, Settings2 } from 'lucide-react'

export default function TopNavBar() {
  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        width: '100%',
        height: 36,
        background: 'rgba(19, 19, 19, 0.60)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingLeft: 32,
        paddingRight: 32,
      }}
    >
      {/* Search */}
      <div style={{ position: 'relative', width: 448 }}>
        <Search
          size={13}
          color="#6b7280"
          style={{ position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)' }}
        />
        <input
          type="text"
          placeholder="Search tasks..."
          style={{
            width: '100%',
            background: 'transparent',
            border: 'none',
            outline: 'none',
            paddingLeft: 20,
            fontSize: 14,
            color: '#e5e2e1',
            caretColor: '#494bd6',
          }}
        />
      </div>

      {/* Right actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
        {/* Bell with notification dot */}
        <div style={{ position: 'relative' }}>
          <Bell size={16} color="#6b7280" />
          <span
            style={{
              position: 'absolute',
              top: -2,
              right: -2,
              width: 8,
              height: 8,
              borderRadius: 9999,
              background: '#494bd6',
              border: '1.5px solid #131313',
            }}
          />
        </div>
        <Settings2 size={16} color="#6b7280" />
      </div>
    </header>
  )
}
