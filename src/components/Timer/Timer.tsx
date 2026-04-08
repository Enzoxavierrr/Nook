import { useTimer } from '../../hooks/useTimer'

// Timer placeholder — será implementado na fase de UI
export default function Timer() {
  const { formatted, isRunning, start, stop, reset } = useTimer()

  return (
    <div className="flex flex-col items-center gap-4 p-6">
      <p className="text-5xl font-mono text-white tracking-widest">{formatted}</p>
      <div className="flex gap-3">
        {!isRunning ? (
          <button onClick={() => start()} className="text-sm text-accent">Iniciar</button>
        ) : (
          <button onClick={stop} className="text-sm text-red-400">Parar</button>
        )}
        <button onClick={reset} className="text-sm text-muted">Reset</button>
      </div>
    </div>
  )
}
