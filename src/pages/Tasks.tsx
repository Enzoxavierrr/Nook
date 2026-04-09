import { Plus, CheckCircle2, Circle, Trash2 } from 'lucide-react'
import { useTasks } from '../hooks/useTasks'
import { useEffect } from 'react'

export default function Tasks() {
  const { tasks, loading, fetchTasks, deleteTask, completeTask } = useTasks()

  useEffect(() => {
    fetchTasks()
  }, [])

  return (
    <main style={{ flex: 1, padding: 24, background: '#131313', overflowY: 'auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
        <h1 style={{ fontSize: 28, fontWeight: 600, color: '#ffffff' }}>Tarefas</h1>
        <button
          style={{
            padding: '8px 16px',
            background: '#494bd6',
            color: '#fff',
            borderRadius: 6,
            border: 'none',
            cursor: 'pointer',
            fontSize: 14,
            fontWeight: 500,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <Plus size={16} />
          Nova Tarefa
        </button>
      </div>

      {/* Task List */}
      {loading ? (
        <div style={{ color: '#6b7280', fontSize: 14, textAlign: 'center', padding: '40px 0' }}>
          Carregando tarefas...
        </div>
      ) : tasks.length === 0 ? (
        <div style={{ color: '#6b7280', fontSize: 14, textAlign: 'center', padding: '40px 0' }}>
          Nenhuma tarefa criada. Comece adicionando uma nova!
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {tasks.map((task: any) => (
            <div
              key={task.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: 12,
                background: '#1c1b1b',
                borderRadius: 8,
                border: '1px solid #2a2a2a',
              }}
            >
              <button
                onClick={() => completeTask(task.id)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex' }}
              >
                {task.status === 'completed' ? (
                  <CheckCircle2 size={20} color="#10b981" />
                ) : (
                  <Circle size={20} color="#6b7280" />
                )}
              </button>

              <div style={{ flex: 1 }}>
                <p
                  style={{
                    color: task.status === 'completed' ? '#6b7280' : '#ffffff',
                    textDecoration: task.status === 'completed' ? 'line-through' : 'none',
                    fontSize: 14,
                  }}
                >
                  {task.title}
                </p>
                {task.description && (
                  <p style={{ color: '#6b7280', fontSize: 12, marginTop: 4 }}>
                    {task.description}
                  </p>
                )}
              </div>

              <button
                onClick={() => deleteTask(task.id)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex' }}
              >
                <Trash2 size={16} color="#ef4444" />
              </button>
            </div>
          ))}
        </div>
      )}
    </main>
  )
}
