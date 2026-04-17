import { motion, AnimatePresence } from 'framer-motion'
import { AlertCircle } from 'lucide-react'
import { useAuth } from '@/hooks/use-auth'
import { useGuestStore } from '@/stores/guest-store'
import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router-dom'

export function GuestModeBanner() {
  const { isGuestMode } = useAuth()
  const { isGuestMode: guestMode } = useGuestStore()
  const navigate = useNavigate()

  const isVisible = isGuestMode || guestMode

  if (!isVisible) return null

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 mb-6 flex items-center justify-between gap-4"
        >
          <div className="flex items-center gap-3 flex-1">
            <AlertCircle className="h-5 w-5 text-amber-500 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground">
                Modo Demonstração
              </p>
              <p className="text-xs text-muted-foreground">
                Seus dados são salvos por 20 minutos. Crie uma conta para salvar permanentemente.
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/auth')}
            className="border-amber-500/30 hover:bg-amber-500/10"
          >
            Criar conta
          </Button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

