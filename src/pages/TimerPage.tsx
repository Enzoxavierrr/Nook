import Timer from '../components/Timer/Timer'

// TimerPage — tela dedicada ao controle de tempo
export default function TimerPage() {
  return (
    <main className="flex-1 flex items-center justify-center p-6">
      <div className="text-center">
        <h1 className="text-lg font-semibold text-white mb-6">Timer</h1>
        <Timer />
      </div>
    </main>
  )
}
