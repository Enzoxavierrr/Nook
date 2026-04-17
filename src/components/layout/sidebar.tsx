import { useState } from 'react'
import { Plus, List, LogOut, Timer, ChevronLeft, ChevronRight } from 'lucide-react'
import { NavLink, useNavigate } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui'
import { useAuth } from '@/hooks/use-auth'
import { useLists } from '@/hooks/use-lists'
import { ListDialog } from '@/components/tasks/list-dialog'
import type { List as ListType } from '@/types'

interface SidebarProps {
  collapsed: boolean
  onToggle: () => void
}

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const { signOut } = useAuth()
  const { lists } = useLists()
  const navigate = useNavigate()
  const [listDialogOpen, setListDialogOpen] = useState(false)

  const handleSignOut = async () => {
    await signOut()
    navigate('/auth')
  }

  return (
    <>
      <aside
        className={cn(
          'fixed left-0 top-0 z-40 h-screen bg-sidebar border-r border-sidebar-border transition-all duration-300',
          collapsed ? 'w-16' : 'w-64'
        )}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
            {!collapsed && (
              <h1 className="text-xl font-bold text-sidebar-foreground">No<span className="text-primary">ok</span></h1>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggle}
              className="ml-auto"
            >
              {collapsed ? (
                <ChevronRight className="h-4 w-4" />
              ) : (
                <ChevronLeft className="h-4 w-4" />
              )}
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                    : 'text-sidebar-foreground hover:bg-sidebar-accent/50'
                )
              }
            >
              <List className="h-5 w-5 shrink-0" />
              {!collapsed && <span>Todas as tarefas</span>}
            </NavLink>

            <NavLink
              to="/focus"
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                    : 'text-sidebar-foreground hover:bg-sidebar-accent/50'
                )
              }
            >
              <Timer className="h-5 w-5 shrink-0" />
              {!collapsed && <span>Modo Foco</span>}
            </NavLink>

            {/* Lists Section */}
            {!collapsed && (
              <div className="pt-4">
                <div className="flex items-center justify-between px-3 mb-2">
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Listas
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => setListDialogOpen(true)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="space-y-1">
                  {lists.map((list: ListType) => (
                    <NavLink
                      key={list.id}
                      to={`/list/${list.id}`}
                      className={({ isActive }) =>
                        cn(
                          'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                          isActive
                            ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                            : 'text-sidebar-foreground hover:bg-sidebar-accent/50'
                        )
                      }
                    >
                      <div
                        className="h-3 w-3 rounded-full shrink-0"
                        style={{ backgroundColor: list.color || '#3b82f6' }}
                      />
                      <span className="truncate">{list.name}</span>
                    </NavLink>
                  ))}
                </div>
              </div>
            )}
          </nav>

          {/* Footer */}
          <div className="p-2 border-t border-sidebar-border">
            <Button
              variant="ghost"
              className={cn(
                'w-full justify-start gap-3',
                collapsed && 'justify-center'
              )}
              onClick={handleSignOut}
            >
              <LogOut className="h-5 w-5 shrink-0" />
              {!collapsed && <span>Sair</span>}
            </Button>
          </div>
        </div>
      </aside>

      <ListDialog open={listDialogOpen} onOpenChange={setListDialogOpen} />
    </>
  )
}

