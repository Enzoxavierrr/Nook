# Nook

Aplicação de gerenciamento de tarefas e produtividade, construída com React, TypeScript e Supabase.

![Status](https://img.shields.io/badge/Status-Em%20Desenvolvimento-yellow)
![React](https://img.shields.io/badge/React-19.2-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.1-cyan)

## Funcionalidades

- **Gerenciamento de Tarefas** — Crie, organize e acompanhe suas tarefas por listas
- **Timer Pomodoro** — Mantenha o foco com sessões temporizadas
- **Dashboard de Estatísticas** — Visualize seu progresso com gráficos interativos
- **Calendário Integrado** — Organize tarefas por data e horário agendado
- **Autenticação Segura** — Login e registro com Supabase Auth
- **Tema Escuro/Claro** — Cor primária personalizável pelo usuário
- **Animações Suaves** — UI moderna com Framer Motion

## Tecnologias

| Camada | Tecnologias |
|--------|-------------|
| Frontend | React 19, TypeScript, Tailwind CSS 4, Framer Motion |
| Gráficos | Recharts |
| Componentes | Radix UI, ShadCN |
| Backend | Supabase (Auth, Database, Real-time) |
| Estado | Zustand |
| Roteamento | React Router DOM 7 |
| Build | Vite 7 |

## Como Executar

### Pré-requisitos

- Node.js 18+
- Conta no [Supabase](https://supabase.com)

### Instalação

1. Clone o repositório
```bash
git clone https://github.com/Enzoxavierrr/nook.git
cd nook
```

2. Instale as dependências
```bash
npm install
```

3. Configure as variáveis de ambiente — crie um arquivo `.env` na raiz:
```env
VITE_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=sua_chave_anon
```

4. Configure o banco de dados — execute o `supabase-schema.sql` no SQL Editor do Supabase

5. Inicie o servidor de desenvolvimento
```bash
npm run dev
```

A aplicação estará disponível em `http://localhost:5173`

## Scripts

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Servidor de desenvolvimento |
| `npm run build` | Build de produção |
| `npm run preview` | Visualiza o build |
| `npm run lint` | Executa o linter |

## Estrutura do Projeto

```
src/
├── components/
│   ├── auth/        # Fluxo de autenticação
│   ├── dashboard/   # Sidebar, menu mobile, painel lateral
│   ├── layout/      # Layout base
│   ├── pomodoro/    # Timer Pomodoro
│   ├── tasks/       # Criação e listagem de tarefas
│   └── ui/          # Componentes reutilizáveis
├── hooks/           # Custom hooks (auth, tasks, lists)
├── lib/             # Configurações e utilitários
├── pages/           # Páginas da aplicação
├── stores/          # Estado global com Zustand
└── types/           # Definições de tipos TypeScript
```

---

Feito por [Enzo Xavier](https://github.com/Enzoxavierrr)
