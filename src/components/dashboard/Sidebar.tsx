import { useNavigate, useLocation } from "react-router-dom"
import { motion } from "framer-motion"
import {
  Home,
  CheckSquare,
  Calendar,
  Timer,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  CreditCard,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useAuth } from "@/hooks/use-auth"
import { useSidebarStore } from "@/stores/sidebar-store"
import { toast } from "sonner"

interface NavItem {
  icon: React.ElementType
  label: string
  href: string
}

const navItems: NavItem[] = [
  { icon: Home, label: "Início", href: "/" },
  { icon: CheckSquare, label: "Task's", href: "/tasks" },
  { icon: Calendar, label: "Calendário", href: "/calendar" },
  { icon: Timer, label: "Timer", href: "/timer" },
  { icon: CreditCard, label: "Finanças", href: "/finances" },
  { icon: Settings, label: "Configurações", href: "/settings" },
]

function Sidebar() {
  const { signOut } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const { isCollapsed, toggle } = useSidebarStore()

  const handleLogout = async () => {
    try {
      await signOut()
      toast.success("Você saiu da sua conta")
    } catch (err) {
      // Ignora erros - o logout sempre funciona
    } finally {
      // Sempre redireciona, independente de erros
      navigate("/auth", { replace: true })
    }
  }

  const isActive = (href: string) => {
    if (href === "/") {
      return location.pathname === "/"
    }
    return location.pathname.startsWith(href)
  }

  return (
    <motion.aside 
      className={cn(
        "flex flex-col h-fit sticky top-4 bg-sidebar text-sidebar-foreground rounded-3xl p-4 transition-all duration-300",
        isCollapsed ? "w-[72px]" : "w-[220px]"
      )}
      layout
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      {/* Toggle Button */}
      <button
        type="button"
        onClick={toggle}
        className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform z-10"
      >
        {isCollapsed ? (
          <ChevronRight className="w-4 h-4" />
        ) : (
          <ChevronLeft className="w-4 h-4" />
        )}
      </button>

      {/* Logo */}
      <div className={cn(
        "mb-8 overflow-hidden transition-all duration-300",
        isCollapsed ? "px-0" : "px-2"
      )}>
        {isCollapsed ? (
          <motion.div 
            className="flex justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            <span className="text-2xl font-bold text-primary">F</span>
          </motion.div>
        ) : (
          <motion.h1 
            className="text-2xl font-bold tracking-tight font-[Poppins] whitespace-nowrap"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            No<span className="text-primary">ok</span>
          </motion.h1>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-2">
        {navItems.map((item) => (
          <button
            key={item.href}
            onClick={() => navigate(item.href)}
            title={isCollapsed ? item.label : undefined}
            className={cn(
              "flex items-center gap-3 rounded-xl text-sm font-medium transition-all w-full font-[Poppins] group",
              isCollapsed 
                ? "px-0 py-3 justify-center" 
                : "px-4 py-3 text-left",
              isActive(item.href)
                ? "bg-sidebar-accent text-sidebar-accent-foreground"
                : "text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
            )}
          >
            <item.icon className={cn(
              "w-5 h-5 flex-shrink-0 transition-transform",
              isCollapsed && "group-hover:scale-110"
            )} />
            {!isCollapsed && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                className="whitespace-nowrap overflow-hidden"
              >
                {item.label}
              </motion.span>
            )}
          </button>
        ))}
      </nav>

      {/* Divider */}
      <div className={cn(
        "my-4 border-t border-sidebar-border",
        isCollapsed ? "mx-2" : "mx-2"
      )} />

      {/* Logout */}
      <button 
        type="button"
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          handleLogout()
        }}
        title={isCollapsed ? "Sair" : undefined}
        className={cn(
          "flex items-center gap-3 rounded-xl text-sm font-medium text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50 transition-all font-[Poppins] w-full group",
          isCollapsed 
            ? "px-0 py-3 justify-center" 
            : "px-4 py-3 text-left"
        )}
      >
        <LogOut className={cn(
          "w-5 h-5 flex-shrink-0 transition-transform",
          isCollapsed && "group-hover:scale-110"
        )} />
        {!isCollapsed && (
          <motion.span
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: "auto" }}
            exit={{ opacity: 0, width: 0 }}
            className="whitespace-nowrap overflow-hidden"
          >
            Sair
          </motion.span>
        )}
      </button>
    </motion.aside>
  )
}

export { Sidebar }
