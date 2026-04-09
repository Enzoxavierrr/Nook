import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useEffect } from 'react'
import Sidebar from './components/Sidebar/Sidebar'
import Dashboard from './pages/Dashboard'
import Tasks from './pages/Tasks'
import TimerPage from './pages/TimerPage'
import Projects from './pages/Projects'
import Stats from './pages/Stats'

export default function App() {
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
    <BrowserRouter>
      <div
        style={{
          display: 'flex',
          height: '100vh',
          width: '100vw',
          background: '#131313',
          overflow: 'hidden',
        }}
      >
        <Sidebar />
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/tasks"     element={<Tasks />} />
          <Route path="/timer"     element={<TimerPage />} />
          <Route path="/projects"  element={<Projects />} />
          <Route path="/stats"     element={<Stats />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}
