<div align="center">

<br />

<img src="./src/svg/Icon.svg" alt="Nook Logo" width="90" />

# Nook

**Your offline-first productivity space.**

Gerenciamento de tarefas minimalista, rápido e sem distrações — construído para quem vive no terminal.

<br />

![Electron](https://img.shields.io/badge/Electron-2B2E3B?style=for-the-badge&logo=electron&logoColor=9FEAF9)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-20232A?style=for-the-badge&logo=typescript&logoColor=3178C6)
![TailwindCSS](https://img.shields.io/badge/Tailwind-20232A?style=for-the-badge&logo=tailwindcss&logoColor=38BDF8)
![SQLite](https://img.shields.io/badge/SQLite_WASM-20232A?style=for-the-badge&logo=sqlite&logoColor=A8D1F0)

<br />

> ⚠️ **Em desenvolvimento ativo** — MVP em construção.

</div>

---

## 💡 Motivação

Aplicações de produtividade modernas pedem demais: login obrigatório, conexão constante, interfaces pesadas e carregamentos lentos. Quando a internet cai ou o sinal está ruim, elas simplesmente param de funcionar.

**Nook** nasce do oposto: dois cliques e você está dentro. Sem conta, sem servidor, sem espera.

---

## ✨ Funcionalidades (MVP)

- 📋 **Criar, editar e excluir tarefas**
- ✅ **Marcar tarefas como concluídas**
- 📅 **Definir datas e categorias**
- 🔔 **Lembretes** — notificação nativa um dia antes
- ⏱️ **Timer integrado** — controle de tempo por tarefa
- 👁️ **Visualização do dia** — veja o que está pendente hoje
- 🌑 **Dark mode** nativo, inspirado no macOS
- 📴 **100% offline** — funciona sem internet

---

## 🛣️ Roadmap

| Status | Feature |
|--------|---------|
| 🔨 Em desenvolvimento | MVP — tarefas, timer, lembretes |
| 📋 Planejado | Métricas de produtividade |
| 📋 Planejado | Estatísticas de tempo por categoria |
| 📋 Planejado | Planejamento automático do dia |
| 💭 Futuro | Integração com IA |
| 💭 Futuro | Sincronização opcional em nuvem |
| 💭 Futuro | Versão mobile |

---

## 🏗️ Arquitetura

```
Nook/
├── electron/               # Processo principal (Node.js)
│   ├── main.ts             # Ciclo de vida + IPC handlers
│   ├── preload.ts          # window.nook API (contextBridge)
│   └── db/
│       ├── database.ts     # Singleton SQLite (sql.js/WASM)
│       └── schema.ts       # Migrations
│
└── src/                    # Renderer (React)
    ├── types/              # Interfaces TypeScript compartilhadas
    ├── hooks/
    │   ├── useTasks.ts     # CRUD de tarefas via IPC
    │   └── useTimer.ts     # Timer + sessões de tempo
    ├── components/
    │   ├── Sidebar/
    │   ├── TaskCard/
    │   └── Timer/
    └── pages/
        ├── Dashboard.tsx
        ├── Tasks.tsx
        └── TimerPage.tsx
```

**Comunicação:** O renderer nunca acessa o sistema diretamente. Toda operação passa pelo `contextBridge` → IPC → processo principal → SQLite.

---

## 🛠️ Stack

| Camada | Tecnologia |
|--------|-----------|
| Desktop shell | [Electron](https://www.electronjs.org/) |
| UI | [React](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/) |
| Estilo | [Tailwind CSS](https://tailwindcss.com/) |
| Banco de dados | [sql.js](https://sql.js.org/) (SQLite em WebAssembly) |
| Bundler | [Vite](https://vitejs.dev/) + vite-plugin-electron |

> **Por que `sql.js`?** É SQLite compilado em WebAssembly — funciona em qualquer versão do Node sem compilação de código nativo (sem `node-gyp`).

---

## 🚀 Como rodar localmente

### Pré-requisitos

- [Node.js](https://nodejs.org/) ≥ 18
- npm ≥ 9

### Instalação

```bash
# Clone o repositório
git clone https://github.com/enzoxavier/nook.git
cd nook

# Instale as dependências
npm install

# Rode em modo desenvolvimento
npm run electron:dev
```

### Build para produção

```bash
npm run electron:build
# O instalador será gerado em /release
```

---

## 🎨 Design

- **Dark mode** com paleta de cores suaves (sem preto puro)
- Tipografia **Inter** para UI e **JetBrains Mono** para valores numéricos
- Inspirado em aplicações nativas do **macOS**
- Minimalismo: sem modais desnecessários, sem onboarding, sem surpresas

---

## 📄 Licença

MIT © [Enzo Xavier](https://github.com/enzoxavier)

---

<div align="center">
  <sub>Feito com foco e café ☕</sub>
</div>
