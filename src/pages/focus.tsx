import { PomodoroTimer } from '@/components/pomodoro/pomodoro-timer'
import { TaskSelector } from '@/components/pomodoro/task-selector'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui'

export function FocusPage() {
  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">Modo Foco</h1>
        <p className="text-muted-foreground">
          Use a técnica Pomodoro para manter o foco nas suas tarefas
        </p>
      </div>

      <Card>
        <CardContent className="pt-8 pb-8">
          <PomodoroTimer />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Tarefas</CardTitle>
        </CardHeader>
        <CardContent>
          <TaskSelector />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Como funciona?</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <p>
            <strong className="text-foreground">1. Foco (25 min):</strong> Concentre-se totalmente na tarefa selecionada.
          </p>
          <p>
            <strong className="text-foreground">2. Pausa curta (5 min):</strong> Descanse um pouco após cada ciclo de foco.
          </p>
          <p>
            <strong className="text-foreground">3. Pausa longa (15 min):</strong> Após 4 ciclos, faça uma pausa maior.
          </p>
          <p className="pt-2">
            Cada ciclo completo de foco é contado como um pomodoro na sua tarefa!
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

