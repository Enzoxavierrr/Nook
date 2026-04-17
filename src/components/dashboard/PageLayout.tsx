import { useState } from "react"
import type { ReactNode } from "react"
import { Sidebar, MobileMenu, GuestModeBanner } from "@/components/dashboard"
import { Button } from "@/components/ui/button"
import { Menu } from "lucide-react"

interface PageLayoutProps {
  children: ReactNode
  showRightPanel?: boolean
  rightPanel?: ReactNode
}

export function PageLayout({ children, showRightPanel = false, rightPanel }: PageLayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

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
          {children}
        </main>
        
        {/* Right Panel - oculto no mobile, visível no desktop */}
        {showRightPanel && rightPanel && (
          <div className="hidden xl:block">
            {rightPanel}
          </div>
        )}
      </div>
    </div>
  )
}

