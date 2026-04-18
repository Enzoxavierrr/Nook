import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'sonner'
import { useAuth } from '@/hooks/use-auth'
import { useTasks } from '@/hooks/use-tasks'
import { usePomodoroStore } from '@/stores/pomodoro-store'
import { useGuestStore } from '@/stores/guest-store'
import { isSupabaseConfigured } from '@/lib/supabase'
import { AuthPage } from '@/pages/auth'
import { SetupPage } from '@/pages/setup'
import { CreateTaskPage } from '@/pages/create-task'
import { TasksPage } from '@/pages/tasks'
import { TimerPage } from '@/pages/timer'
import { CalendarPage } from '@/pages/calendar'
import { SettingsPage } from '@/pages/settings'
import { ResetPasswordPage } from '@/pages/reset-password'
import { FinancesPage } from '@/pages/finances'
import {
  Sidebar,
  WelcomeHeader,
  StatsCard,
  StatisticsChart,
  RightPanel,
  GuestModeBanner,
} from "@/components/dashboard"
import { MobileMenu } from "@/components/dashboard/MobileMenu"
import { SmoothCursor } from '@/components/ui/smooth-cursor'
import { PomodoroBackground } from '@/components/pomodoro/pomodoro-background'
import { Loader2, Menu } from 'lucide-react'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { useState } from 'react'
import { Button } from '@/components/ui/button'

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  // Todos os hooks devem ser chamados antes de qualquer lógica condicional
  const { isGuestMode: guestModeFromStore } = useGuestStore()
  const { user, loading, isGuestMode } = useAuth()
  
  // Prioridade 1: Se estiver em modo guest, permite acesso imediatamente
  if (guestModeFromStore || isGuestMode) {
    return <>{children}</>
  }

  // Prioridade 2: Se estiver carregando, mostra loading
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  // Prioridade 3: Se não houver usuário, redireciona para login
  if (!user) {
    return <Navigate to="/auth" replace />
  }

  return <>{children}</>
}

function Dashboard() {
  const { getUserName } = useAuth()
  const userName = getUserName()
  const { tasks } = useTasks()
  const cyclesCompleted = usePomodoroStore((state) => state.cyclesCompleted)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // Calcular estatísticas
  const completedTasks = tasks.filter(t => t.completed).length
  const totalPomodoros = tasks.reduce((sum, task) => sum + task.pomodoros_completed, 0) + cyclesCompleted
  const hoursWorked = Math.round((totalPomodoros * 25) / 60 * 10) / 10 // Cada pomodoro = 25min

  return (
    <div className="min-h-screen bg-background p-2 sm:p-4 pt-16 lg:pt-4">
      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-30 flex items-center justify-between bg-background/95 backdrop-blur border-b border-border px-4 h-14">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setMobileMenuOpen(true)}
          className="lg:hidden"
        >
          <Menu className="h-6 w-6" />
        </Button>
        <h1 className="text-xl font-bold font-[Poppins]">
          No<span className="text-primary">ok</span>
        </h1>
        <div className="w-10" /> {/* Spacer para centralizar */}
      </div>

      <MobileMenu open={mobileMenuOpen} onOpenChange={setMobileMenuOpen} />

      <div className="flex flex-col lg:flex-row gap-4 lg:gap-6 items-start">
        {/* Sidebar - oculta no mobile, visível no desktop */}
        <div className="hidden lg:block">
          <Sidebar />
        </div>
        
        {/* Main Content */}
        <main className="flex-1 w-full flex flex-col gap-4 sm:gap-6 min-w-0">
          <GuestModeBanner />
          <WelcomeHeader userName={userName} />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            <StatsCard value={hoursWorked.toString()} label="Horas Trabalhadas" />
            <StatsCard value={totalPomodoros.toString()} label="Pomodoros" />
            <StatsCard value={completedTasks.toString()} label="Tarefas Feitas" />
          </div>
          <StatisticsChart />
        </main>
        
        {/* Right Panel - oculto no mobile, visível no desktop */}
        <div className="hidden xl:block">
          <RightPanel />
        </div>
      </div>
    </div>
  )
}

function App() {
  return (
    <ErrorBoundary>
      <div className="cursor-none">
        <SmoothCursor />
        <PomodoroBackground />
        <BrowserRouter>
          <Routes>
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          {!isSupabaseConfigured && <Route path="/setup" element={<SetupPage />} />}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/tasks"
            element={
              <ProtectedRoute>
                <TasksPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/tasks/new"
            element={
              <ProtectedRoute>
                <CreateTaskPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/timer"
            element={
              <ProtectedRoute>
                <TimerPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/calendar"
            element={
              <ProtectedRoute>
                <CalendarPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <SettingsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/finances"
            element={
              <ProtectedRoute>
                <FinancesPage />
              </ProtectedRoute>
            }
          />
          </Routes>
          <Toaster position="bottom-right" richColors toastOptions={{ className: 'cursor-none' }} />
        </BrowserRouter>
      </div>
    </ErrorBoundary>
  )
}

export default App
