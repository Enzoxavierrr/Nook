import { useNavigate, useLocation } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { X, Home, CheckSquare, Calendar, Timer, Settings, LogOut } from "lucide-react"
import { cn } from "@/lib/utils"
import { useAuth } from "@/hooks/use-auth"
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
  { icon: Settings, label: "Configurações", href: "/settings" },
]

interface MobileMenuProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function MobileMenu({ open, onOpenChange }: MobileMenuProps) {
  const navigate = useNavigate()
  const location = useLocation()
  const { signOut } = useAuth()

  const handleLogout = async () => {
    try {
      await signOut()
      toast.success("Você saiu da sua conta")
      onOpenChange(false)
    } catch (err) {
      // Ignora erros
    } finally {
      navigate("/auth", { replace: true })
    }
  }

  const isActive = (href: string) => {
    if (href === "/") {
      return location.pathname === "/"
    }
    return location.pathname.startsWith(href)
  }

  const handleNavigate = (href: string) => {
    navigate(href)
    onOpenChange(false)
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => onOpenChange(false)}
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
          />
          
          {/* Menu */}
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed left-0 top-0 z-50 h-full w-[280px] bg-sidebar border-r border-sidebar-border shadow-xl lg:hidden"
          >
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
                <h1 className="text-2xl font-bold font-[Poppins]">
                  No<span className="text-primary">ok</span>
                </h1>
                <button
                  onClick={() => onOpenChange(false)}
                  className="p-2 rounded-lg hover:bg-sidebar-accent transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Navigation */}
              <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                {navItems.map((item) => {
                  const Icon = item.icon
                  const active = isActive(item.href)
                  
                  return (
                    <button
                      key={item.href}
                      onClick={() => handleNavigate(item.href)}
                      className={cn(
                        "flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium transition-all font-[Poppins]",
                        active
                          ? "bg-sidebar-accent text-sidebar-accent-foreground"
                          : "text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
                      )}
                    >
                      <Icon className="w-5 h-5 shrink-0" />
                      <span>{item.label}</span>
                    </button>
                  )
                })}
              </nav>

              {/* Footer */}
              <div className="p-4 border-t border-sidebar-border">
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50 transition-all font-[Poppins]"
                >
                  <LogOut className="w-5 h-5 shrink-0" />
                  <span>Sair</span>
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

