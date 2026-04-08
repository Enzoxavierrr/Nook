import { MoreHorizontal, Check, Flag, Tag } from 'lucide-react'

interface Task {
  id: number
  title: string
  priority: string
  category: string
  time?: string
  status: 'overdue' | 'pending' | 'done'
}

interface TaskItemProps {
  task: Task
  onComplete?: (id: number) => void
}

const statusStyles: Record<Task['status'], React.CSSProperties> = {
  overdue: { color: '#ffb4ab' },
  pending: { color: '#6b7280' },
  done:    { color: '#6ee7a0' },
}

export default function TaskItem({ task, onComplete }: TaskItemProps) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: '#1c1b1b',
        borderRadius: 8,
        padding: '20px 20px',
        height: 79,
        transition: 'background 150ms ease-out',
        cursor: 'pointer',
        animation: 'fade-in 0.2s ease-out',
      }}
      onMouseEnter={e => (e.currentTarget.style.background = '#222121')}
      onMouseLeave={e => (e.currentTarget.style.background = '#1c1b1b')}
    >
      {/* Left: checkbox + title + meta */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
        {/* Checkbox */}
        <button
          onClick={() => onComplete?.(task.id)}
          style={{
            width: 24,
            height: 24,
            borderRadius: 6,
            border: '1.5px solid #2a2a2a',
            background: 'transparent',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            transition: 'border-color 150ms, background 150ms',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.borderColor = '#494bd6'
            e.currentTarget.style.background = 'rgba(73,75,214,0.1)'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.borderColor = '#2a2a2a'
            e.currentTarget.style.background = 'transparent'
          }}
        >
          {task.status === 'done' && <Check size={12} color="#494bd6" strokeWidth={3} />}
        </button>

        {/* Title + meta */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <p
            style={{
              fontSize: 14,
              fontWeight: 500,
              color: task.status === 'done' ? '#6b7280' : '#ffffff',
              textDecoration: task.status === 'done' ? 'line-through' : 'none',
              lineHeight: 1.4,
            }}
          >
            {task.title}
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#6b7280', fontSize: 10 }}>
              <Flag size={8} />
              {task.priority}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#6b7280', fontSize: 10 }}>
              <Tag size={9} />
              {task.category}
            </span>
          </div>
        </div>
      </div>

      {/* Right: time + status + menu */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        {task.time && (
          <span style={{ fontSize: 10, fontWeight: 700, color: '#6b7280', whiteSpace: 'nowrap' }}>
            {task.time}
          </span>
        )}
        {task.status === 'overdue' && (
          <span style={{ fontSize: 10, fontWeight: 700, ...statusStyles.overdue }}>Overdue</span>
        )}
        <button
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
        >
          <MoreHorizontal size={15} color="#4b5563" />
        </button>
      </div>
    </div>
  )
}
