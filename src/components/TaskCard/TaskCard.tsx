import type { Task } from '../../types'

interface TaskCardProps {
  task: Task
  onComplete?: (id: number) => void
  onDelete?: (id: number) => void
}

// TaskCard placeholder — será implementado na fase de UI
export default function TaskCard({ task, onComplete, onDelete }: TaskCardProps) {
  return (
    <div className="rounded-lg border border-border bg-surface-2 p-4">
      <p className="text-sm font-medium text-white">{task.title}</p>
      <p className="text-xs text-muted mt-1">{task.status}</p>
      <div className="flex gap-2 mt-3">
        <button onClick={() => onComplete?.(task.id)} className="text-xs text-accent">
          Concluir
        </button>
        <button onClick={() => onDelete?.(task.id)} className="text-xs text-red-400">
          Excluir
        </button>
      </div>
    </div>
  )
}
