import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Sidebar from './components/Sidebar/Sidebar'
import Dashboard from './pages/Dashboard'
import Tasks from './pages/Tasks'
import TimerPage from './pages/TimerPage'

export default function App() {
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
