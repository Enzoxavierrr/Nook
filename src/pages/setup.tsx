import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui'
import { AlertTriangle, ExternalLink } from 'lucide-react'

export function SetupPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-background">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-foreground mb-2">Nook</h1>
        <p className="text-muted-foreground">
          Configuração necessária
        </p>
      </div>

      <Card className="w-full max-w-lg">
        <CardHeader>
          <div className="flex items-center gap-2 text-primary">
            <AlertTriangle className="h-5 w-5" />
            <CardTitle>Supabase não configurado</CardTitle>
          </div>
          <CardDescription>
            Para usar o Nook, você precisa configurar o Supabase.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h3 className="font-medium">1. Crie um projeto no Supabase</h3>
            <a
              href="https://supabase.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
            >
              Acessar Supabase <ExternalLink className="h-3 w-3" />
            </a>
          </div>

          <div className="space-y-2">
            <h3 className="font-medium">2. Execute o schema SQL</h3>
            <p className="text-sm text-muted-foreground">
              No SQL Editor do Supabase, execute o conteúdo do arquivo{' '}
              <code className="bg-muted px-1 py-0.5 rounded text-xs">supabase-schema.sql</code>
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="font-medium">3. Configure as variáveis de ambiente</h3>
            <p className="text-sm text-muted-foreground">
              Crie um arquivo <code className="bg-muted px-1 py-0.5 rounded text-xs">.env</code> na raiz do projeto:
            </p>
            <pre className="bg-muted p-3 rounded-lg text-xs overflow-x-auto">
{`VITE_SUPABASE_URL=sua_url_do_supabase
VITE_SUPABASE_ANON_KEY=sua_chave_anon`}
            </pre>
          </div>

          <div className="space-y-2">
            <h3 className="font-medium">4. Reinicie o servidor</h3>
            <p className="text-sm text-muted-foreground">
              Após configurar, reinicie o servidor de desenvolvimento.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

