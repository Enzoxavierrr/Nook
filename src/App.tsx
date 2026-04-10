import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { useEffect, useState, useCallback } from 'react'
import Sidebar from './components/Sidebar/Sidebar'
import NewTaskModal from './components/NewTaskModal/NewTaskModal'
import Dashboard from './pages/Dashboard'
import Tasks from './pages/Tasks'
import TimerPage from './pages/TimerPage'
import Projects from './pages/Projects'
import Stats from './pages/Stats'
import { TaskProvider } from './contexts/TaskContext'
import { useTaskContext } from './contexts/TaskContext'

function AppInner() {
  const [modalAberto, setModalAberto] = useState(false)
  const { pathname } = useLocation()
  const { createTask } = useTaskContext()

  // Atalho de teclado global: ⌘+N abre o modal
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'n') {
        e.preventDefault()
        setModalAberto(true)
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  const abrirModal  = useCallback(() => setModalAberto(true),  [])
  const fecharModal = useCallback(() => setModalAberto(false), [])

  // Load dev tools in development mode
  useEffect(() => {
    if (import.meta.env.DEV) {
      Promise.all([
        import('./utils/ipc-tester').then(({ testAllIPC }) => {
          ;(window as any).testIPC = testAllIPC
          console.log('💡 Dev Mode: Use window.testIPC() para testar IPC')
        }),
        import('./utils/ui-tester').then(({ testUI }) => {
          ;(window as any).testUI = testUI
          console.log('💡 Dev Mode: Use window.testUI() para testar UI Base')
        }),
      ])
    }
  }, [])

  return (
    <div style={{
      display: 'flex',
      height: '100vh',
      width: '100vw',
      background: '#131313',
      overflow: 'hidden',
    }}>
      <Sidebar onNovaTargefa={abrirModal} />

      {/* key={pathname} reinicia o componente a cada troca de rota → dispara animate-fade-in */}
      <div
        key={pathname}
        className="animate-fade-in"
        style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}
      >
        <Routes>
          <Route path="/"          element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/tasks"     element={<Tasks />} />
          <Route path="/timer"     element={<TimerPage />} />
          <Route path="/projects"  element={<Projects />} />
          <Route path="/stats"     element={<Stats />} />
        </Routes>
      </div>

      {/* Modal usa o TaskContext internamente */}
      <NewTaskModal
        open={modalAberto}
        onClose={fecharModal}
        onCreateTask={(title) => {
          void createTask({ title })
        }}
      />
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <TaskProvider>
        <AppInner />
      </TaskProvider>
    </BrowserRouter>
  )
}
