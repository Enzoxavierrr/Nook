import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '@/hooks/use-auth'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import { Loader2, KeyRound, AlertCircle } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { DotPattern } from '@/components/ui/dot-pattern'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

export function ResetPasswordPage() {
  const { updatePassword } = useAuth()
  const navigate = useNavigate()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isValidSession, setIsValidSession] = useState(false)
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) {
      setIsChecking(false)
      return
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') {
        setIsValidSession(true)
        setIsChecking(false)
      }
    })

    // Verifica se já há sessão ativa (caso a página seja carregada após o redirect)
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setIsValidSession(true)
      }
      setIsChecking(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (password !== confirmPassword) {
      toast.error('As senhas não coincidem.')
      return
    }

    setIsSubmitting(true)
    try {
      const { error } = await updatePassword(password)
      if (error) {
        toast.error(error.message)
      } else {
        toast.success('Senha atualizada com sucesso!')
        navigate('/', { replace: true })
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!isValidSession) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="max-w-md w-full bg-card border border-border rounded-lg p-6 space-y-4">
          <div className="flex items-center gap-3 text-destructive">
            <AlertCircle className="h-5 w-5" />
            <h2 className="text-lg font-semibold">Link inválido ou expirado</h2>
          </div>
          <p className="text-muted-foreground">
            Este link de recuperação é inválido ou já expirou. Solicite um novo link na tela de login.
          </p>
          <Button className="w-full" onClick={() => navigate('/auth')}>
            Voltar ao login
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-sidebar text-sidebar-foreground overflow-hidden">
      {/* Left Side */}
      <div className="hidden lg:flex flex-1 relative p-8 xl:p-12 flex-col justify-center">
        <DotPattern
          className={cn(
            "absolute inset-0 [mask-image:radial-gradient(500px_circle_at_center,white,transparent)]",
            "fill-primary/30"
          )}
          width={20}
          height={20}
          cx={1}
          cy={1}
          cr={1.5}
        />
        <div className="relative z-10 max-w-lg">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl xl:text-5xl font-bold mb-4 font-[Poppins]">
              No<span className="text-primary">ok</span>
            </h1>
            <p className="text-lg xl:text-xl text-sidebar-foreground/60 font-[Poppins]">
              Crie uma nova senha segura para sua conta
            </p>
          </motion.div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-sidebar to-transparent" />
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex flex-col justify-center px-4 sm:px-8 lg:px-16 xl:px-24 bg-background relative py-8 lg:py-0">
        <div className="absolute top-1/4 right-1/4 w-32 sm:w-64 h-32 sm:h-64 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 w-32 sm:w-64 h-32 sm:h-64 bg-primary/5 rounded-full blur-3xl" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative z-10 max-w-md w-full mx-auto"
        >
          {/* Mobile Logo */}
          <div className="lg:hidden mb-6 text-center">
            <h1 className="text-2xl sm:text-3xl font-bold font-[Poppins]">
              No<span className="text-primary">ok</span>
            </h1>
          </div>

          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
                <KeyRound className="h-5 w-5 text-primary" />
              </div>
              <h2 className="text-2xl font-bold text-foreground">Nova senha</h2>
            </div>
            <p className="text-muted-foreground">
              Escolha uma nova senha para acessar sua conta
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="password">Nova senha</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                disabled={isSubmitting}
                className="h-12"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirmar senha</Label>
              <Input
                id="confirm-password"
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={6}
                disabled={isSubmitting}
                className="h-12"
              />
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-12 text-base font-medium"
            >
              {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
              Atualizar senha
            </Button>
          </form>
        </motion.div>
      </div>
    </div>
  )
}
