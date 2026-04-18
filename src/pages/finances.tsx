import { useState } from "react"
import { motion } from "framer-motion"
import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sidebar, MobileMenu, GuestModeBanner } from "@/components/dashboard"
import { PDFUpload } from "@/components/finances"

function FinancesPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [rawText, setRawText] = useState<string | null>(null)

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
        <div className="hidden lg:block">
          <Sidebar />
        </div>

        <main className="flex-1 w-full flex flex-col gap-4 sm:gap-6 min-w-0">
          <GuestModeBanner />
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div>
              <h1 className="text-3xl font-bold text-foreground font-[Poppins]">Finanças</h1>
              <p className="text-muted-foreground font-[Poppins] mt-1">
                Controle suas receitas e despesas
              </p>
            </div>

            <PDFUpload onParsed={(text) => setRawText(text)} onReset={() => setRawText(null)} />

            {rawText && (
              <p className="text-xs text-muted-foreground font-[Poppins]">
                {rawText.length} caracteres extraídos — pronto para análise.
              </p>
            )}
          </motion.div>
        </main>
      </div>
    </div>
  )
}

export { FinancesPage }
