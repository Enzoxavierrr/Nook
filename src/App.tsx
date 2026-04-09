import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useEffect } from 'react'
import Sidebar from './components/Sidebar/Sidebar'
import Dashboard from './pages/Dashboard'
import Tasks from './pages/Tasks'
import TimerPage from './pages/TimerPage'

export default function App() {
  // Load IPC tester in dev mode
  useEffect(() => {
    if (import.meta.env.DEV) {
      import('./utils/ipc-tester').then(({ testAllIPC }) => {
        ;(window as any).testIPC = testAllIPC
        console.log('💡 Dev Mode: Use window.testIPC() no console para testar IPC')
      })
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
          <Route path="/projects"  element={<Tasks />} />
          <Route path="/stats"     element={<TimerPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}
