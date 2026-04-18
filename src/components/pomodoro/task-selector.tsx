import { Check, Clock } from 'lucide-react'
import { Button } from '@/components/ui'
import { useTasks } from '@/hooks/use-tasks'
import { usePomodoroStore } from '@/stores/pomodoro-store'
import { cn } from '@/lib/utils'

export function TaskSelector() {
  const { tasks } = useTasks()
  const { currentTaskId, setCurrentTask } = usePomodoroStore()

  const incompleteTasks = tasks.filter((t) => !t.completed)

  if (incompleteTasks.length === 0) {
    return (
      <div className="text-center py-4">
        <p className="text-muted-foreground text-sm">
          Nenhuma tarefa pendente. Crie uma tarefa para começar!
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium text-muted-foreground mb-3">
        Selecione uma tarefa para focar:
      </h3>
      <div className="space-y-1 max-h-60 overflow-y-auto">
        {incompleteTasks.map((task) => (
          <button
            key={task.id}
            onClick={() => setCurrentTask(task.id === currentTaskId ? null : task.id)}
            className={cn(
              'flex items-center gap-3 w-full px-3 py-2 rounded-lg text-left text-sm transition-colors',
              task.id === currentTaskId
                ? 'bg-primary/10 text-primary'
                : 'hover:bg-accent'
            )}
          >
            <div
              className={cn(
                'h-5 w-5 rounded-full border-2 flex items-center justify-center shrink-0',
                task.id === currentTaskId
                  ? 'border-primary bg-primary'
                  : 'border-muted-foreground/30'
              )}
            >
              {task.id === currentTaskId && (
                <Check className="h-3 w-3 text-primary-foreground" />
              )}
            </div>
            <span className="truncate">{task.title}</span>
            {task.pomodoros_completed > 0 && (
              <span className="ml-auto flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="w-3 h-3" />
                {task.pomodoros_completed}
              </span>
            )}
          </button>
        ))}
      </div>
      {currentTaskId && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCurrentTask(null)}
          className="w-full mt-2"
        >
          Limpar seleção
        </Button>
      )}
    </div>
  )
}

