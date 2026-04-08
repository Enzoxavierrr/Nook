import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Sidebar from './components/Sidebar/Sidebar'
import Dashboard from './pages/Dashboard'
import Tasks from './pages/Tasks'
import TimerPage from './pages/TimerPage'

export default function App() {
  return (
    <BrowserRouter>
      <div className="flex h-screen bg-surface text-white overflow-hidden">
        <Sidebar />
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/timer" element={<TimerPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}
