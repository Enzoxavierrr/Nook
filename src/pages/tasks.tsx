import { useState, useMemo } from "react"
import { useNavigate } from "react-router-dom"
import { format, isToday, isPast, isFuture, parseISO, isWithinInterval, startOfDay, endOfDay } from "date-fns"
import { ptBR } from "date-fns/locale"
import { motion, AnimatePresence } from "framer-motion"
import {
  Plus,
  Search,
  Filter,
  Calendar as CalendarIcon,
  CheckCircle2,
  Circle,
  Clock,
  Target,
  Trash2,
  ChevronDown,
  X,
  Pencil,
  Loader2,
  Menu,
} from "lucide-react"
import { Sidebar, GuestModeBanner, MobileMenu } from "@/components/dashboard"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { DatePicker } from "@/components/ui/date-picker"
import { Slider } from "@/components/ui/slider"
import { cn } from "@/lib/utils"
import { useTasks } from "@/hooks/use-tasks"
import { toast } from "sonner"
import type { Task } from "@/types"

type FilterType = "all" | "today" | "past" | "upcoming" | "completed" | "pending" | "custom"

const filterLabels: Record<FilterType, string> = {
  all: "Todas",
  today: "Hoje",
  past: "Passadas",
  upcoming: "Futuras",
  completed: "Concluídas",
  pending: "Pendentes",
  custom: "Período",
}

function getDifficultyLabel(value: number): string {
  if (value <= 25) return "Fácil"
  if (value <= 50) return "Médio"
  if (value <= 75) return "Difícil"
  return "Expert"
}

function getDifficultyColor(value: number): string {
  if (value <= 25) return "text-green-500"
  if (value <= 50) return "text-yellow-500"
  if (value <= 75) return "text-orange-500"
  return "text-red-500"
}

function formatEstimatedTime(minutes: number): string {
  if (minutes < 60) return `${minutes}min`
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  return mins > 0 ? `${hours}h ${mins}min` : `${hours}h`
}

interface TaskCardProps {
  task: Task
  onToggleComplete: (id: string, completed: boolean) => void
  onDelete: (task: Task) => void
  onEdit: (task: Task) => void
}

function TaskCard({ task, onToggleComplete, onDelete, onEdit }: TaskCardProps) {
  // Usar start_date como a data de realização
  const taskDate = task.start_date || task.deadline
  const isOverdue = taskDate && isPast(parseISO(taskDate)) && !task.completed && !isToday(parseISO(taskDate))
  const isDueToday = taskDate && isToday(parseISO(taskDate))

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className={cn(
        "group bg-sidebar rounded-2xl p-5 transition-all hover:shadow-lg border-l-4",
        task.completed 
          ? "border-l-green-500/50 opacity-70" 
          : isOverdue 
            ? "border-l-red-500" 
            : isDueToday 
              ? "border-l-yellow-500" 
              : "border-l-primary"
      )}
    >
      <div className="flex items-start gap-4">
        {/* Checkbox */}
        <div
          role="button"
          tabIndex={0}
          onClick={() => onToggleComplete(task.id, !task.completed)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              onToggleComplete(task.id, !task.completed)
            }
          }}
          className="mt-1 transition-transform hover:scale-110 flex-shrink-0 cursor-pointer"
          aria-label={task.completed ? "Marcar como pendente" : "Marcar como concluída"}
        >
          {task.completed ? (
            <CheckCircle2 className="w-6 h-6 text-green-500" />
          ) : (
            <Circle className="w-6 h-6 text-muted-foreground hover:text-primary" />
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3 className={cn(
            "font-semibold text-lg font-[Poppins] text-sidebar-foreground",
            task.completed && "line-through text-muted-foreground"
          )}>
            {task.title}
          </h3>
          
          {task.description && (
            <p className="text-sm text-sidebar-foreground/70 mt-1 line-clamp-2 font-[Poppins]">
              {task.description}
            </p>
          )}

          {/* Meta info */}
          <div className="flex flex-wrap items-center gap-4 mt-3">
            {/* Data de Realização */}
            {taskDate && (
              <div className={cn(
                "flex items-center gap-1.5 text-xs font-medium font-[Poppins]",
                isOverdue && !task.completed ? "text-red-500" : isDueToday ? "text-primary" : "text-sidebar-foreground/60"
              )}>
                <CalendarIcon className="w-3.5 h-3.5" />
                <span>
                  {isToday(parseISO(taskDate)) 
                    ? "Hoje" 
                    : format(parseISO(taskDate), "dd MMM", { locale: ptBR })}
                </span>
              </div>
            )}

            {/* Difficulty */}
            <div className={cn("flex items-center gap-1.5 text-xs font-medium font-[Poppins]", getDifficultyColor(task.difficulty))}>
              <Target className="w-3.5 h-3.5" />
              <span>{getDifficultyLabel(task.difficulty)}</span>
            </div>

            {/* Estimated Time */}
            <div className="flex items-center gap-1.5 text-xs font-medium text-sidebar-foreground/60 font-[Poppins]">
              <Clock className="w-3.5 h-3.5" />
              <span>{formatEstimatedTime(task.estimated_time)}</span>
            </div>

            {/* Pomodoros */}
            {task.pomodoros_completed > 0 && (
              <div className="flex items-center gap-1.5 text-xs font-medium text-primary font-[Poppins]">
                🍅 {task.pomodoros_completed}
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onEdit(task)}
            className="p-2 hover:bg-primary/10 rounded-lg transition-colors"
            title="Editar tarefa"
          >
            <Pencil className="w-4 h-4 text-primary" />
          </button>
          <button
            onClick={() => onDelete(task)}
            className="p-2 hover:bg-destructive/10 rounded-lg transition-colors"
            title="Excluir tarefa"
          >
            <Trash2 className="w-4 h-4 text-destructive" />
          </button>
        </div>
      </div>
    </motion.div>
  )
}

// Função auxiliar para obter a data da tarefa
function getTaskDate(task: Task): Date | null {
  if (task.start_date) return parseISO(task.start_date)
  if (task.created_at) return parseISO(task.created_at)
  return null
}

// Componente de formulário de edição
interface EditTaskFormProps {
  task: Task
  onSave: (updates: Partial<Task>) => Promise<void>
  onCancel: () => void
}

function EditTaskForm({ task, onSave, onCancel }: EditTaskFormProps) {
  const [title, setTitle] = useState(task.title)
  const [description, setDescription] = useState(task.description || "")
  const [scheduledDate, setScheduledDate] = useState<Date | undefined>(
    task.start_date ? parseISO(task.start_date) : new Date()
  )
  const [difficulty, setDifficulty] = useState(task.difficulty || 25)
  const [isSaving, setIsSaving] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!title.trim()) {
      toast.error("O nome da tarefa é obrigatório")
      return
    }

    setIsSaving(true)
    try {
      await onSave({
        title,
        description: description || null,
        start_date: scheduledDate?.toISOString() || null,
        difficulty,
      })
      toast.success("Tarefa atualizada!")
    } catch (error) {
      toast.error("Erro ao atualizar tarefa")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 py-4">
      {/* Nome */}
      <div className="space-y-2">
        <Label className="font-[Poppins]">Nome da Tarefa</Label>
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Nome da tarefa"
          className="font-[Poppins]"
          required
        />
      </div>

      {/* Descrição */}
      <div className="space-y-2">
        <Label className="font-[Poppins]">Descrição</Label>
        <Textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Descrição (opcional)"
          className="font-[Poppins] min-h-[80px]"
        />
      </div>

      {/* Data */}
      <div className="space-y-2">
        <Label className="font-[Poppins]">Data para Realizar</Label>
        <DatePicker
          date={scheduledDate}
          onDateChange={setScheduledDate}
          placeholder="Selecione a data"
        />
      </div>

      {/* Dificuldade */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="font-[Poppins]">Dificuldade</Label>
          <span className="text-sm font-semibold text-primary font-[Poppins]">
            {difficulty}%
          </span>
        </div>
        <Slider
          value={[difficulty]}
          onValueChange={(value) => setDifficulty(value[0])}
          max={100}
          step={25}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-muted-foreground font-[Poppins]">
          <span>25%</span>
          <span>50%</span>
          <span>75%</span>
          <span>100%</span>
        </div>
      </div>

      <DialogFooter>
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSaving}
          className="font-[Poppins]"
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          disabled={isSaving}
          className="font-[Poppins]"
        >
          {isSaving ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Salvando...
            </>
          ) : (
            "Salvar"
          )}
        </Button>
      </DialogFooter>
    </form>
  )
}

function TasksPage() {
  const navigate = useNavigate()
  const { tasks, loading, toggleTaskComplete, deleteTask, updateTask } = useTasks()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [activeFilter, setActiveFilter] = useState<FilterType>("all")
  const [customDateRange, setCustomDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: undefined,
    to: undefined,
  })
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  // Filtered tasks
  const filteredTasks = useMemo(() => {
    let result = [...tasks]

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (task) =>
          task.title.toLowerCase().includes(query) ||
          task.description?.toLowerCase().includes(query)
      )
    }

    // Type filter
    switch (activeFilter) {
      case "today":
        result = result.filter((task) => {
          const taskDate = getTaskDate(task)
          return taskDate && isToday(taskDate)
        })
        break
      case "past":
        result = result.filter((task) => {
          const taskDate = getTaskDate(task)
          return taskDate && isPast(taskDate) && !isToday(taskDate)
        })
        break
      case "upcoming":
        result = result.filter((task) => {
          const taskDate = getTaskDate(task)
          return taskDate && isFuture(taskDate) && !isToday(taskDate)
        })
        break
      case "completed":
        result = result.filter((task) => task.completed)
        break
      case "pending":
        result = result.filter((task) => !task.completed)
        break
      case "custom":
        if (customDateRange.from && customDateRange.to) {
          result = result.filter((task) => {
            const taskDate = getTaskDate(task)
            if (!taskDate) return false
            return isWithinInterval(taskDate, {
              start: startOfDay(customDateRange.from!),
              end: endOfDay(customDateRange.to!),
            })
          })
        }
        break
    }

    return result
  }, [tasks, searchQuery, activeFilter, customDateRange])

  // Stats
  const stats = useMemo(() => {
    const today = tasks.filter((t) => {
      const taskDate = getTaskDate(t)
      return taskDate && isToday(taskDate)
    }).length
    
    const overdue = tasks.filter((t) => {
      const taskDate = getTaskDate(t)
      return taskDate && isPast(taskDate) && !t.completed && !isToday(taskDate)
    }).length
    
    const completed = tasks.filter((t) => t.completed).length
    const pending = tasks.filter((t) => !t.completed).length

    return { today, overdue, completed, pending, total: tasks.length }
  }, [tasks])

  const handleToggleComplete = async (id: string, completed: boolean) => {
    await toggleTaskComplete(id, completed)
  }

  const handleDelete = (task: Task) => {
    setTaskToDelete(task)
  }

  const handleConfirmDelete = async () => {
    if (!taskToDelete) return
    
    setIsDeleting(true)
    try {
      await deleteTask(taskToDelete.id)
      setTaskToDelete(null)
    } finally {
      setIsDeleting(false)
    }
  }

  const handleCancelDelete = () => {
    setTaskToDelete(null)
  }

  const handleEdit = (task: Task) => {
    setEditingTask(task)
  }

  const handleSaveEdit = async (updatedTask: Partial<Task>) => {
    if (!editingTask) return
    await updateTask(editingTask.id, updatedTask)
    setEditingTask(null)
  }

  const clearDateRange = () => {
    setCustomDateRange({ from: undefined, to: undefined })
    setActiveFilter("all")
  }

  return (
    <div className="min-h-screen bg-background p-2 sm:p-4">
      {/* Mobile Menu Button */}
      <div className="lg:hidden mb-4 flex items-center justify-between">
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
        
        <main className="flex-1 w-full flex flex-col gap-4 sm:gap-6 min-w-0 max-w-5xl">
          <GuestModeBanner />
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground font-[Poppins]">Task's</h1>
              <p className="text-muted-foreground font-[Poppins] mt-1 text-sm sm:text-base">
                Gerencie todas as suas tarefas
              </p>
            </div>
            <Button
              onClick={() => navigate("/tasks/new")}
              className="gap-2 font-[Poppins] w-full sm:w-auto"
            >
              <Plus className="w-4 h-4" />
              Nova Tarefa
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-sidebar rounded-2xl p-4 cursor-pointer"
            onClick={() => setActiveFilter("today")}
          >
            <p className="text-3xl font-bold text-primary font-[Poppins]">{stats.today}</p>
            <p className="text-sm text-sidebar-foreground/70 font-[Poppins]">Para Hoje</p>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-sidebar rounded-2xl p-4 cursor-pointer"
            onClick={() => setActiveFilter("past")}
          >
            <p className="text-3xl font-bold text-red-500 font-[Poppins]">{stats.overdue}</p>
            <p className="text-sm text-sidebar-foreground/70 font-[Poppins]">Atrasadas</p>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-sidebar rounded-2xl p-4 cursor-pointer"
            onClick={() => setActiveFilter("completed")}
          >
            <p className="text-3xl font-bold text-green-500 font-[Poppins]">{stats.completed}</p>
            <p className="text-sm text-sidebar-foreground/70 font-[Poppins]">Concluídas</p>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-sidebar rounded-2xl p-4 cursor-pointer"
            onClick={() => setActiveFilter("pending")}
          >
            <p className="text-3xl font-bold text-yellow-500 font-[Poppins]">{stats.pending}</p>
            <p className="text-sm text-sidebar-foreground/70 font-[Poppins]">Pendentes</p>
          </motion.div>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
          {/* Search */}
          <div className="relative flex-1 min-w-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Buscar tarefas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 font-[Poppins] w-full"
            />
          </div>

          {/* Filter Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2 font-[Poppins] w-full sm:w-auto">
                <Filter className="w-4 h-4" />
                <span className="hidden sm:inline">{filterLabels[activeFilter]}</span>
                <span className="sm:hidden">Filtro</span>
                <ChevronDown className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              {(Object.keys(filterLabels) as FilterType[]).map((filter) => (
                filter !== "custom" && (
                  <DropdownMenuItem
                    key={filter}
                    onClick={() => setActiveFilter(filter)}
                    className={cn(
                      "font-[Poppins]",
                      activeFilter === filter && "bg-accent"
                    )}
                  >
                    {filterLabels[filter]}
                  </DropdownMenuItem>
                )
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => setIsDatePickerOpen(true)}
                className="font-[Poppins]"
              >
                <CalendarIcon className="w-4 h-4 mr-2" />
                Selecionar período
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Date Range Picker */}
          <Popover open={isDatePickerOpen} onOpenChange={setIsDatePickerOpen}>
            <PopoverTrigger asChild>
              <div />
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar
                mode="range"
                selected={{ from: customDateRange.from, to: customDateRange.to }}
                onSelect={(range) => {
                  setCustomDateRange({ from: range?.from, to: range?.to })
                  if (range?.from && range?.to) {
                    setActiveFilter("custom")
                    setIsDatePickerOpen(false)
                  }
                }}
                locale={ptBR}
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Active Date Range Badge */}
        {activeFilter === "custom" && customDateRange.from && customDateRange.to && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground font-[Poppins]">
              Filtrando por:
            </span>
            <div className="flex items-center gap-2 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium font-[Poppins]">
              {format(customDateRange.from, "dd MMM", { locale: ptBR })} - {format(customDateRange.to, "dd MMM", { locale: ptBR })}
              <button onClick={clearDateRange} className="hover:bg-primary/20 rounded-full p-0.5">
                <X className="w-3 h-3" />
              </button>
            </div>
          </div>
        )}

        {/* Tasks List */}
        <div className="flex-1 space-y-3 overflow-y-auto pb-4">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
            </div>
          ) : filteredTasks.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-16 text-center"
            >
              <div className="w-20 h-20 rounded-full bg-sidebar flex items-center justify-center mb-4">
                <CheckCircle2 className="w-10 h-10 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-foreground font-[Poppins]">
                {searchQuery ? "Nenhuma tarefa encontrada" : "Nenhuma tarefa"}
              </h3>
              <p className="text-muted-foreground font-[Poppins] mt-1">
                {searchQuery 
                  ? "Tente buscar por outro termo" 
                  : "Crie sua primeira tarefa para começar"}
              </p>
              {!searchQuery && (
                <Button
                  onClick={() => navigate("/tasks/new")}
                  className="mt-4 gap-2 font-[Poppins]"
                >
                  <Plus className="w-4 h-4" />
                  Criar Tarefa
                </Button>
              )}
            </motion.div>
          ) : (
            <AnimatePresence mode="popLayout">
              {filteredTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onToggleComplete={handleToggleComplete}
                  onDelete={handleDelete}
                  onEdit={handleEdit}
                />
              ))}
            </AnimatePresence>
          )}
        </div>

        {/* Results Count */}
        {!loading && filteredTasks.length > 0 && (
          <div className="text-sm text-muted-foreground font-[Poppins] text-center pb-2">
            {filteredTasks.length} {filteredTasks.length === 1 ? "tarefa" : "tarefas"} encontrada{filteredTasks.length !== 1 && "s"}
          </div>
        )}
      </main>

      {/* Modal de Edição de Tarefa */}
      <Dialog open={!!editingTask} onOpenChange={() => setEditingTask(null)}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="font-[Poppins] flex items-center gap-2">
              <Pencil className="w-5 h-5 text-primary" />
              Editar Tarefa
            </DialogTitle>
          </DialogHeader>
          
          {editingTask && (
            <EditTaskForm
              task={editingTask}
              onSave={handleSaveEdit}
              onCancel={() => setEditingTask(null)}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Modal de Confirmação de Exclusão */}
      <Dialog open={!!taskToDelete} onOpenChange={handleCancelDelete}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="font-[Poppins] flex items-center gap-2">
              <Trash2 className="w-5 h-5 text-destructive" />
              Confirmar Exclusão
            </DialogTitle>
          </DialogHeader>
          
          <div className="py-4">
            <p className="text-sm text-muted-foreground font-[Poppins] mb-4">
              Tem certeza que deseja excluir a tarefa <strong className="text-foreground">"{taskToDelete?.title}"</strong>?
            </p>
            <p className="text-xs text-muted-foreground/70 font-[Poppins]">
              Esta ação não pode ser desfeita.
            </p>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={handleCancelDelete}
              disabled={isDeleting}
              className="font-[Poppins]"
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmDelete}
              disabled={isDeleting}
              className="font-[Poppins]"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Excluindo...
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4 mr-2" />
                  Excluir
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      </div>
    </div>
  )
}

export { TasksPage }

