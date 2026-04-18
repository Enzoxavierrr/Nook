import { useState, useMemo, useCallback } from "react"
import { useNavigate } from "react-router-dom"
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  addMonths,
  subMonths,
  isSameMonth,
  isSameDay,
  isToday,
  parseISO,
} from "date-fns"
import { ptBR } from "date-fns/locale"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight, Plus, Circle, X, Clock, GripVertical, Menu } from "lucide-react"
import { Sidebar, GuestModeBanner, MobileMenu } from "@/components/dashboard"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useTasks } from "@/hooks/use-tasks"
import type { Task } from "@/types"

const WEEKDAYS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"]

// Horários do dia (6h às 23h)
const HOURS = Array.from({ length: 18 }, (_, i) => i + 6)

function getDifficultyColor(value: number): string {
  if (value <= 25) return "bg-green-500"
  if (value <= 50) return "bg-yellow-500"
  if (value <= 75) return "bg-orange-500"
  return "bg-red-500"
}

function getDifficultyColorLight(value: number): string {
  if (value <= 25) return "bg-green-500/30 border-green-500"
  if (value <= 50) return "bg-yellow-500/30 border-yellow-500"
  if (value <= 75) return "bg-orange-500/30 border-orange-500"
  return "bg-red-500/30 border-red-500"
}

// Helper para obter a data da tarefa
function getTaskDate(task: Task): string {
  return task.start_date || task.created_at
}

interface DayCellProps {
  day: Date
  currentMonth: Date
  tasks: Task[]
  selectedDate: Date | null
  onSelectDate: (date: Date) => void
}

function DayCell({ day, currentMonth, tasks, selectedDate, onSelectDate }: DayCellProps) {
  const isCurrentMonth = isSameMonth(day, currentMonth)
  const isSelected = selectedDate && isSameDay(day, selectedDate)
  const isTodayDate = isToday(day)
  
  const dayTasks = tasks.filter((task) => {
    const taskDate = getTaskDate(task)
    return isSameDay(parseISO(taskDate), day)
  })

  const completedTasks = dayTasks.filter((t) => t.completed).length
  const pendingTasks = dayTasks.filter((t) => !t.completed).length

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onSelectDate(day)}
      className={cn(
        "relative flex flex-col items-start p-2 min-h-[100px] rounded-2xl transition-all border border-transparent",
        isCurrentMonth 
          ? "bg-sidebar hover:bg-sidebar-accent/30" 
          : "bg-sidebar/30 opacity-40",
        isSelected && "ring-2 ring-primary border-primary",
        isTodayDate && !isSelected && "border-primary/50"
      )}
    >
      <div className={cn(
        "w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold font-[Poppins] mb-1",
        isTodayDate 
          ? "bg-primary text-primary-foreground" 
          : isCurrentMonth 
            ? "text-foreground" 
            : "text-muted-foreground"
      )}>
        {format(day, "d")}
      </div>

      <div className="flex-1 w-full space-y-1 overflow-hidden">
        {dayTasks.slice(0, 3).map((task) => (
          <div
            key={task.id}
            className={cn(
              "flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs font-medium truncate",
              task.completed 
                ? "bg-green-500/20 text-green-400 line-through" 
                : "bg-primary/20 text-primary"
            )}
          >
            <div className={cn(
              "w-1.5 h-1.5 rounded-full flex-shrink-0",
              task.completed ? "bg-green-500" : getDifficultyColor(task.difficulty)
            )} />
            <span className="truncate">{task.title}</span>
          </div>
        ))}
        
        {dayTasks.length > 3 && (
          <p className="text-xs text-muted-foreground font-[Poppins] px-2">
            +{dayTasks.length - 3} mais
          </p>
        )}
      </div>

      {dayTasks.length > 0 && (
        <div className="absolute bottom-2 right-2 flex gap-1">
          {pendingTasks > 0 && (
            <div className="flex items-center gap-0.5 text-xs text-primary">
              <Circle className="w-2 h-2 fill-primary" />
              <span className="font-medium">{pendingTasks}</span>
            </div>
          )}
          {completedTasks > 0 && (
            <div className="flex items-center gap-0.5 text-xs text-green-500">
              <Circle className="w-2 h-2 fill-green-500" />
              <span className="font-medium">{completedTasks}</span>
            </div>
          )}
        </div>
      )}
    </motion.button>
  )
}

// Componente de visualização de horários do dia
interface DayScheduleProps {
  date: Date
  tasks: Task[]
  scheduledTasks: Map<string, number>
  onScheduleTask: (taskId: string, hour: number) => void
  onUnscheduleTask: (taskId: string) => void
  onClose: () => void
}

function DaySchedule({ date, tasks, scheduledTasks, onScheduleTask, onUnscheduleTask, onClose }: DayScheduleProps) {
  const [draggedTask, setDraggedTask] = useState<Task | null>(null)
  const [hoveredHour, setHoveredHour] = useState<number | null>(null)

  // Tarefas não agendadas (disponíveis para arrastar)
  const unscheduledTasks = tasks.filter(t => !scheduledTasks.has(t.id) && !t.completed)

  // Calcular blocos ocupados
  const getTaskAtHour = (hour: number): { task: Task; isStart: boolean; blocksCount: number } | null => {
    for (const [taskId, startHour] of scheduledTasks.entries()) {
      const task = tasks.find(t => t.id === taskId)
      if (!task) continue
      
      const durationHours = Math.ceil(task.estimated_time / 60)
      const endHour = startHour + durationHours
      
      if (hour >= startHour && hour < endHour) {
        return {
          task,
          isStart: hour === startHour,
          blocksCount: durationHours
        }
      }
    }
    return null
  }

  const handleDragStart = (task: Task) => {
    setDraggedTask(task)
  }

  const handleDragEnd = () => {
    if (draggedTask && hoveredHour !== null) {
      onScheduleTask(draggedTask.id, hoveredHour)
    }
    setDraggedTask(null)
    setHoveredHour(null)
  }

  const handleDrop = (hour: number) => {
    if (draggedTask) {
      onScheduleTask(draggedTask.id, hour)
      setDraggedTask(null)
      setHoveredHour(null)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ y: 20 }}
        animate={{ y: 0 }}
        className="bg-background rounded-3xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h2 className="text-2xl font-bold text-foreground font-[Poppins]">
              {format(date, "EEEE, d 'de' MMMM", { locale: ptBR })}
            </h2>
            <p className="text-muted-foreground font-[Poppins]">
              Arraste as tarefas para os horários desejados
            </p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full">
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="flex-1 flex overflow-hidden">
          {/* Tarefas disponíveis */}
          <div className="w-[280px] border-r border-border p-4 overflow-y-auto">
            <h3 className="text-sm font-semibold text-muted-foreground font-[Poppins] mb-3 flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Tarefas para agendar
            </h3>
            
            {unscheduledTasks.length === 0 ? (
              <p className="text-sm text-muted-foreground/60 font-[Poppins] text-center py-8">
                Todas as tarefas foram agendadas!
              </p>
            ) : (
              <div className="space-y-2">
                {unscheduledTasks.map((task) => (
                  <motion.div
                    key={task.id}
                    draggable
                    onDragStart={() => handleDragStart(task)}
                    onDragEnd={handleDragEnd}
                    whileHover={{ scale: 1.02 }}
                    whileDrag={{ scale: 1.05, zIndex: 100 }}
                    className={cn(
                      "p-3 rounded-xl border-2 cursor-grab active:cursor-grabbing transition-all",
                      getDifficultyColorLight(task.difficulty)
                    )}
                  >
                    <div className="flex items-start gap-2">
                      <GripVertical className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-foreground font-[Poppins] text-sm truncate">
                          {task.title}
                        </p>
                        <p className="text-xs text-muted-foreground font-[Poppins] mt-1">
                          <Clock className="w-3 h-3 inline mr-1" />{task.estimated_time < 60
                            ? `${task.estimated_time}min`
                            : `${Math.floor(task.estimated_time / 60)}h ${task.estimated_time % 60 > 0 ? `${task.estimated_time % 60}min` : ''}`}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Grade de horários */}
          <div className="flex-1 overflow-y-auto p-4">
            <div className="space-y-0">
              {HOURS.map((hour) => {
                const taskAtHour = getTaskAtHour(hour)
                const isOccupied = taskAtHour !== null
                const isHovered = hoveredHour === hour && draggedTask
                const canDrop = draggedTask && !isOccupied

                // Se não é o início de uma tarefa agendada, pular renderização do bloco
                if (isOccupied && !taskAtHour.isStart) {
                  return null
                }

                return (
                  <div
                    key={hour}
                    className="flex items-stretch min-h-[60px]"
                    onDragOver={(e) => {
                      e.preventDefault()
                      if (canDrop) setHoveredHour(hour)
                    }}
                    onDragLeave={() => setHoveredHour(null)}
                    onDrop={() => handleDrop(hour)}
                  >
                    {/* Hora */}
                    <div className="w-16 flex-shrink-0 text-right pr-4 pt-1">
                      <span className="text-sm font-medium text-muted-foreground font-[Poppins]">
                        {hour.toString().padStart(2, '0')}:00
                      </span>
                    </div>

                    {/* Slot */}
                    <div
                      className={cn(
                        "flex-1 border-t border-border relative transition-all",
                        isHovered && "bg-primary/20 border-primary",
                        canDrop && "hover:bg-primary/10"
                      )}
                      style={isOccupied && taskAtHour ? { 
                        minHeight: `${taskAtHour.blocksCount * 60}px` 
                      } : undefined}
                    >
                      {isOccupied && taskAtHour?.isStart && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className={cn(
                            "absolute inset-x-0 top-0 mx-2 my-1 p-3 rounded-xl border-2 border-l-4",
                            getDifficultyColorLight(taskAtHour.task.difficulty)
                          )}
                          style={{ height: `calc(${taskAtHour.blocksCount * 60}px - 8px)` }}
                        >
                          <div className="flex items-start justify-between h-full">
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-foreground font-[Poppins] text-sm">
                                {taskAtHour.task.title}
                              </p>
                              <p className="text-xs text-muted-foreground font-[Poppins] mt-1">
                                {hour.toString().padStart(2, '0')}:00 - {(hour + taskAtHour.blocksCount).toString().padStart(2, '0')}:00
                              </p>
                              {taskAtHour.task.description && taskAtHour.blocksCount > 1 && (
                                <p className="text-xs text-muted-foreground/70 font-[Poppins] mt-2 line-clamp-2">
                                  {taskAtHour.task.description}
                                </p>
                              )}
                            </div>
                            <button
                              onClick={() => onUnscheduleTask(taskAtHour.task.id)}
                              className="p-1 hover:bg-black/10 rounded-lg transition-colors"
                            >
                              <X className="w-4 h-4 text-muted-foreground" />
                            </button>
                          </div>
                        </motion.div>
                      )}

                      {/* Indicador de drop */}
                      {isHovered && draggedTask && (
                        <div className="absolute inset-x-0 top-0 mx-2 my-1 border-2 border-dashed border-primary rounded-xl bg-primary/10 flex items-center justify-center"
                          style={{ height: `calc(${Math.ceil(draggedTask.estimated_time / 60) * 60}px - 8px)` }}
                        >
                          <p className="text-sm font-medium text-primary font-[Poppins]">
                            Soltar aqui
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border flex items-center justify-between">
          <p className="text-sm text-muted-foreground font-[Poppins]">
            {scheduledTasks.size} tarefas agendadas • {unscheduledTasks.length} pendentes
          </p>
          <Button onClick={onClose} className="font-[Poppins]">
            Concluir
          </Button>
        </div>
      </motion.div>
    </motion.div>
  )
}

function CalendarPage() {
  const navigate = useNavigate()
  const { tasks, scheduleTask } = useTasks()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date())
  const [direction, setDirection] = useState(0)
  const [showDaySchedule, setShowDaySchedule] = useState(false)
  
  // Mapa de tarefas agendadas derivado dos dados do banco
  const scheduledTasks = useMemo(() => {
    const map = new Map<string, number>()
    tasks.forEach(task => {
      if (task.scheduled_time !== null && task.scheduled_time !== undefined) {
        map.set(task.id, task.scheduled_time)
      }
    })
    return map
  }, [tasks])

  const calendarDays = useMemo(() => {
    const monthStart = startOfMonth(currentMonth)
    const monthEnd = endOfMonth(monthStart)
    const startDate = startOfWeek(monthStart, { locale: ptBR })
    const endDate = endOfWeek(monthEnd, { locale: ptBR })

    const days: Date[] = []
    let day = startDate

    while (day <= endDate) {
      days.push(day)
      day = addDays(day, 1)
    }

    return days
  }, [currentMonth])

  const selectedDayTasks = useMemo(() => {
    if (!selectedDate) return []
    return tasks.filter((task) => {
      const taskDate = getTaskDate(task)
      return isSameDay(parseISO(taskDate), selectedDate)
    })
  }, [tasks, selectedDate])

  const goToPreviousMonth = () => {
    setDirection(-1)
    setCurrentMonth(subMonths(currentMonth, 1))
  }

  const goToNextMonth = () => {
    setDirection(1)
    setCurrentMonth(addMonths(currentMonth, 1))
  }

  const goToToday = () => {
    setDirection(0)
    setCurrentMonth(new Date())
    setSelectedDate(new Date())
  }

  const handleSelectDate = (date: Date) => {
    setSelectedDate(date)
    setShowDaySchedule(true)
  }

  const handleScheduleTask = useCallback(async (taskId: string, hour: number) => {
    await scheduleTask(taskId, hour)
  }, [scheduleTask])

  const handleUnscheduleTask = useCallback(async (taskId: string) => {
    await scheduleTask(taskId, null)
  }, [scheduleTask])

  const monthStats = useMemo(() => {
    const monthStart = startOfMonth(currentMonth)
    const monthEnd = endOfMonth(currentMonth)
    
    const monthTasks = tasks.filter((task) => {
      const taskDate = parseISO(getTaskDate(task))
      return taskDate >= monthStart && taskDate <= monthEnd
    })

    return {
      total: monthTasks.length,
      completed: monthTasks.filter((t) => t.completed).length,
      pending: monthTasks.filter((t) => !t.completed).length,
    }
  }, [tasks, currentMonth])

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
        <div className="w-10" />
      </div>

      <MobileMenu open={mobileMenuOpen} onOpenChange={setMobileMenuOpen} />

      <div className="flex flex-col lg:flex-row gap-4 lg:gap-6 items-start">
        {/* Sidebar - oculta no mobile */}
        <div className="hidden lg:block">
          <Sidebar />
        </div>
        
        <main className="flex-1 w-full flex flex-col gap-4 sm:gap-6 min-w-0">
          <GuestModeBanner />
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <motion.h1 
                key={currentMonth.toISOString()}
                initial={{ opacity: 0, x: direction * 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground font-[Poppins] capitalize"
              >
                {format(currentMonth, "MMMM yyyy", { locale: ptBR })}
              </motion.h1>
              <p className="text-muted-foreground font-[Poppins] mt-1 text-sm sm:text-base">
                {monthStats.total} tarefas • {monthStats.completed} concluídas • {monthStats.pending} pendentes
              </p>
            </div>

            <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
            <Button
              variant="outline"
              onClick={goToToday}
              className="font-[Poppins]"
            >
              Hoje
            </Button>
            
            <div className="flex items-center gap-1 bg-sidebar rounded-xl p-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={goToPreviousMonth}
                className="rounded-lg hover:bg-sidebar-accent"
              >
                <ChevronLeft className="w-5 h-5 text-sidebar-foreground" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={goToNextMonth}
                className="rounded-lg hover:bg-sidebar-accent"
              >
                <ChevronRight className="w-5 h-5 text-sidebar-foreground" />
              </Button>
            </div>

            <Button
              onClick={() => navigate("/tasks/new")}
              className="gap-2 font-[Poppins]"
            >
              <Plus className="w-4 h-4" />
              Nova Tarefa
            </Button>
          </div>
        </div>

        {/* Calendário */}
        <div className="flex-1 flex flex-col bg-sidebar/30 rounded-2xl sm:rounded-3xl p-3 sm:p-4 overflow-hidden">
          {/* Cabeçalho dos dias da semana */}
          <div className="grid grid-cols-7 gap-1 sm:gap-2 mb-2">
            {WEEKDAYS.map((day) => (
              <div
                key={day}
                className="text-center text-xs sm:text-sm font-semibold text-muted-foreground font-[Poppins] py-2 sm:py-3"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Grid do calendário */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentMonth.toISOString()}
              initial={{ opacity: 0, x: direction * 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: direction * -50 }}
              transition={{ duration: 0.2 }}
              className="flex-1 grid grid-cols-7 gap-2"
            >
              {calendarDays.map((day) => (
                <DayCell
                  key={day.toISOString()}
                  day={day}
                  currentMonth={currentMonth}
                  tasks={tasks}
                  selectedDate={selectedDate}
                  onSelectDate={handleSelectDate}
                />
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* Painel lateral - Tarefas do dia selecionado - oculto no mobile */}
      <aside className="hidden xl:flex w-[320px] flex-col gap-4">
        {/* Data selecionada */}
        <div className="bg-sidebar rounded-3xl p-6">
          <div className="text-center">
            <p className="text-sm text-muted-foreground font-[Poppins] uppercase tracking-wider">
              {selectedDate && format(selectedDate, "EEEE", { locale: ptBR })}
            </p>
            <p className="text-6xl font-bold text-foreground font-[Poppins] my-2">
              {selectedDate && format(selectedDate, "d")}
            </p>
            <p className="text-sm text-muted-foreground font-[Poppins]">
              {selectedDate && format(selectedDate, "MMMM yyyy", { locale: ptBR })}
            </p>
          </div>
          
          {/* Botão para abrir agenda do dia */}
          <Button 
            onClick={() => setShowDaySchedule(true)}
            variant="outline" 
            className="w-full mt-4 font-[Poppins] gap-2"
          >
            <Clock className="w-4 h-4" />
            Ver horários do dia
          </Button>
        </div>

        {/* Tarefas do dia */}
        <div className="flex-1 bg-sidebar rounded-3xl p-6 overflow-hidden flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground font-[Poppins]">
              Tarefas do Dia
            </h3>
            <span className="text-sm text-muted-foreground font-[Poppins]">
              {selectedDayTasks.length}
            </span>
          </div>

          <div className="flex-1 overflow-y-auto space-y-3">
            {selectedDayTasks.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <div className="w-16 h-16 rounded-full bg-sidebar-accent/50 flex items-center justify-center mb-4">
                  <Plus className="w-8 h-8 text-muted-foreground" />
                </div>
                <p className="text-sm text-muted-foreground font-[Poppins]">
                  Nenhuma tarefa para este dia
                </p>
                <Button
                  variant="link"
                  onClick={() => navigate("/tasks/new")}
                  className="mt-2 font-[Poppins]"
                >
                  Criar tarefa
                </Button>
              </div>
            ) : (
              selectedDayTasks.map((task) => {
                const scheduledHour = scheduledTasks.get(task.id)
                return (
                  <motion.div
                    key={task.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={cn(
                      "p-4 rounded-2xl border-l-4 transition-all",
                      task.completed 
                        ? "bg-green-500/10 border-l-green-500" 
                        : "bg-sidebar-accent/30 border-l-primary"
                    )}
                  >
                    <h4 className={cn(
                      "font-semibold text-foreground font-[Poppins]",
                      task.completed && "line-through text-muted-foreground"
                    )}>
                      {task.title}
                    </h4>
                    {scheduledHour !== undefined && (
                      <p className="text-xs text-primary font-[Poppins] mt-1">
                        <Clock className="w-3 h-3 inline mr-1" />{scheduledHour.toString().padStart(2, '0')}:00 – {(scheduledHour + Math.ceil(task.estimated_time / 60)).toString().padStart(2, '0')}:00
                      </p>
                    )}
                    {task.description && (
                      <p className="text-sm text-muted-foreground font-[Poppins] mt-1 line-clamp-2">
                        {task.description}
                      </p>
                    )}
                    <div className="flex items-center gap-3 mt-3">
                      <div className={cn(
                        "px-2 py-1 rounded-full text-xs font-medium",
                        task.difficulty <= 25 && "bg-green-500/20 text-green-400",
                        task.difficulty > 25 && task.difficulty <= 50 && "bg-yellow-500/20 text-yellow-400",
                        task.difficulty > 50 && task.difficulty <= 75 && "bg-orange-500/20 text-orange-400",
                        task.difficulty > 75 && "bg-red-500/20 text-red-400"
                      )}>
                        {task.difficulty <= 25 ? "Fácil" : task.difficulty <= 50 ? "Médio" : task.difficulty <= 75 ? "Difícil" : "Expert"}
                      </div>
                      <span className="text-xs text-muted-foreground font-[Poppins]">
                        {task.estimated_time < 60 
                          ? `${task.estimated_time}min` 
                          : `${Math.floor(task.estimated_time / 60)}h`}
                      </span>
                    </div>
                  </motion.div>
                )
              })
            )}
          </div>
        </div>

        {/* Mini legenda */}
        <div className="bg-sidebar rounded-3xl p-4">
          <p className="text-xs text-muted-foreground font-[Poppins] mb-3">Legenda</p>
          <div className="grid grid-cols-2 gap-2">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <span className="text-xs text-muted-foreground">Fácil</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <span className="text-xs text-muted-foreground">Médio</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-orange-500" />
              <span className="text-xs text-muted-foreground">Difícil</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <span className="text-xs text-muted-foreground">Expert</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Modal de agendamento do dia */}
      <AnimatePresence>
        {showDaySchedule && selectedDate && (
          <DaySchedule
            date={selectedDate}
            tasks={selectedDayTasks}
            scheduledTasks={scheduledTasks}
            onScheduleTask={handleScheduleTask}
            onUnscheduleTask={handleUnscheduleTask}
            onClose={() => setShowDaySchedule(false)}
          />
        )}
      </AnimatePresence>
      </div>
    </div>
  )
}

export { CalendarPage }
