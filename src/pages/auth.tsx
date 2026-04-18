import { useState } from 'react'
import { Navigate, useNavigate, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '@/hooks/use-auth'
import { useGuestStore } from '@/stores/guest-store'
import { Loader2, Sparkles, Zap, Target, Clock, AlertCircle, Eye } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { DotPattern } from '@/components/ui/dot-pattern'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { isSupabaseConfigured } from '@/lib/supabase'

type AuthMode = 'login' | 'register' | 'forgot-password'

const features = [
  {
    icon: Target,
    title: "Organize suas tarefas",
    description: "Crie listas personalizadas e mantenha tudo organizado"
  },
  {
    icon: Clock,
    title: "Timer Pomodoro",
    description: "Mantenha o foco com sessões de 25 minutos"
  },
  {
    icon: Zap,
    title: "Aumente sua produtividade",
    description: "Acompanhe estatísticas e evolua cada dia"
  },
  {
    icon: Sparkles,
    title: "Sincronização automática",
    description: "Seus dados seguros em qualquer dispositivo"
  }
]

export function AuthPage() {
  // Todos os hooks devem ser chamados antes de qualquer lógica condicional
  const { user, loading, signIn, signUp, resetPassword } = useAuth()
  const { enableGuestMode, isGuestMode } = useGuestStore()
  const navigate = useNavigate()
  const [mode, setMode] = useState<AuthMode>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (!isSupabaseConfigured) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="max-w-md w-full bg-card border border-border rounded-lg p-6 space-y-4">
          <div className="flex items-center gap-3 text-destructive">
            <AlertCircle className="h-5 w-5" />
            <h2 className="text-lg font-semibold">Supabase não configurado</h2>
          </div>
          <p className="text-muted-foreground">
            Para usar o Nook, você precisa configurar o Supabase primeiro.
          </p>
          <Link to="/setup">
            <Button className="w-full">Ir para configuração</Button>
          </Link>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center gap-4"
        >
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <p className="text-muted-foreground">Carregando...</p>
        </motion.div>
      </div>
    )
  }

  // Se estiver autenticado ou em modo guest, redireciona para dashboard
  if (user || isGuestMode) {
    return <Navigate to="/" replace />
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      if (mode === 'forgot-password') {
        const { error } = await resetPassword(email)
        if (error) {
          toast.error(error.message)
        } else {
          toast.success('Link de recuperação enviado! Verifique seu email.')
          setMode('login')
        }
      } else if (mode === 'login') {
        const { error } = await signIn(email, password)
        if (error) {
          toast.error(error.message)
        } else {
          toast.success('Login realizado com sucesso!')
          navigate('/', { replace: true })
        }
      } else {
        const { data, error } = await signUp(email, password, name)
        if (error) {
          toast.error(error.message)
        } else if (data.user) {
          if (data.session) {
            toast.success('Conta criada com sucesso!')
            navigate('/', { replace: true })
          } else {
            toast.success('Conta criada! Verifique seu email para confirmar.')
          }
        }
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const toggleMode = () => {
    setMode(mode === 'login' ? 'register' : 'login')
  }

  const handleGuestMode = () => {
    enableGuestMode()
    // Pequeno delay para garantir que o estado seja atualizado
    setTimeout(() => {
      toast.success('Modo demonstração ativado! Seus dados não serão salvos.')
      navigate('/', { replace: true })
    }, 100)
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-sidebar text-sidebar-foreground overflow-hidden">
      {/* Left Side - Features with Dot Pattern */}
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
            <p className="text-lg xl:text-xl text-sidebar-foreground/60 mb-8 xl:mb-12 font-[Poppins]">
              Transforme sua produtividade com foco e organização
            </p>
          </motion.div>

          <div className="space-y-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                className="flex items-start gap-4 group"
              >
                <div className="p-3 rounded-xl bg-primary/10 border border-primary/20 group-hover:bg-primary/20 group-hover:border-primary/30 transition-all duration-300">
                  <feature.icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-sidebar-foreground mb-1">{feature.title}</h3>
                  <p className="text-sm text-sidebar-foreground/50">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Decorative gradient */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-sidebar to-transparent" />
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex flex-col justify-center px-4 sm:px-8 lg:px-16 xl:px-24 bg-background relative py-8 lg:py-0">
        {/* Glow effects */}
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

          {/* Form Header */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-2">
              {mode === 'login' ? 'Bem-vindo de volta' : mode === 'register' ? 'Criar sua conta' : 'Recuperar senha'}
            </h2>
            <p className="text-muted-foreground">
              {mode === 'login'
                ? 'Entre para continuar sua jornada de produtividade'
                : mode === 'register'
                ? 'Comece a organizar suas tarefas hoje'
                : 'Digite seu email para receber o link de recuperação'}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <AnimatePresence mode="wait">
            {mode === 'register' && (
              <motion.div
                  key="name-field"
                  initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                  animate={{ 
                    opacity: 1, 
                    height: 'auto', 
                    marginBottom: 20,
                    transition: { 
                      duration: 0.3, 
                      ease: [0.4, 0, 0.2, 1] 
                    }
                  }}
                  exit={{ 
                    opacity: 0, 
                    height: 0, 
                    marginBottom: 0,
                    transition: { 
                      duration: 0.25, 
                      ease: [0.4, 0, 1, 1] 
                    }
                  }}
                  className="space-y-2 overflow-hidden"
              >
                <Label htmlFor="name">Nome</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Seu nome"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={isSubmitting}
                  className="h-12"
                />
              </motion.div>
            )}
            </AnimatePresence>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isSubmitting}
                className="h-12"
              />
            </div>

            <AnimatePresence mode="wait">
            {mode !== 'forgot-password' && (
              <motion.div
                key="password-field"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto', transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] } }}
                exit={{ opacity: 0, height: 0, transition: { duration: 0.25, ease: [0.4, 0, 1, 1] } }}
                className="space-y-2 overflow-hidden"
              >
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Senha</Label>
                  {mode === 'login' && (
                    <button
                      type="button"
                      onClick={() => setMode('forgot-password')}
                      className="text-xs text-primary hover:underline underline-offset-4"
                    >
                      Esqueci minha senha
                    </button>
                  )}
                </div>
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
              </motion.div>
            )}
            </AnimatePresence>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-12 text-base font-medium"
            >
              {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
              {mode === 'login' ? 'Entrar' : mode === 'register' ? 'Criar conta' : 'Enviar link de recuperação'}
            </Button>
          </form>

          {mode !== 'forgot-password' && (
            <>
              {/* Divider */}
              <div className="relative my-8">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-background text-muted-foreground">ou</span>
                </div>
              </div>

              {/* Guest Mode Button */}
              <div className="mt-0 space-y-2">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={handleGuestMode}
                  className="w-full h-12 text-base font-medium bg-primary/5 hover:bg-primary/10 border border-primary/20 hover:border-primary/30 transition-all text-foreground"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Navegar sem criar conta
                </Button>
                <p className="text-xs text-muted-foreground text-center">
                  Explore o app em modo demonstração
                </p>
              </div>
            </>
          )}

          {/* Toggle */}
          <p className="text-center text-sm text-muted-foreground mt-6">
            {mode === 'forgot-password' ? (
              <>
                Lembrou sua senha?{' '}
                <button
                  type="button"
                  onClick={() => setMode('login')}
                  className="text-primary font-medium hover:underline underline-offset-4"
                >
                  Entrar
                </button>
              </>
            ) : (
              <>
                {mode === 'login' ? 'Não tem uma conta?' : 'Já tem uma conta?'}{' '}
                <button
                  type="button"
                  onClick={toggleMode}
                  className="text-primary font-medium hover:underline underline-offset-4"
                >
                  {mode === 'login' ? 'Criar conta' : 'Entrar'}
                </button>
              </>
            )}
          </p>

          {/* Features badges - Mobile */}
          <div className="lg:hidden mt-12 flex flex-wrap gap-2 justify-center">
            {['Pomodoro', 'Listas', 'Estatísticas', 'Sync'].map((badge) => (
              <span 
                key={badge}
                className="px-3 py-1 text-xs rounded-full bg-primary/10 border border-primary/20 text-primary"
              >
                {badge}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
