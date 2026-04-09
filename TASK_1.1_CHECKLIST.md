# ✅ Task 1.1 - Database & Persistence - Checklist

**Status:** 🟢 Em Progresso  
**Data de Início:** 2026-04-09  
**Desenvolvedor:** Claude Code

---

## 📋 Requisitos da Task

### 1.1.1 - Implementar persistência real do SQLite ✅

**Status:** ✅ COMPLETO

- [x] Arquivo `.db` salvo em `userData` do app
- [x] Função `persistDatabase()` chamada após cada mutação
- [x] Carregamento correto do banco existente em `getDatabase()`
- [x] Arquivo de banco persiste em disco

**Detalhes:**
```
📂 Arquivo de banco: ~/.nook/nook.db
📍 Path: app.getPath('userData')/nook.db
💾 Persistência: Manual via persistDatabase() após CRUD
```

---

### 1.1.2 - Validar schema.ts contra sql.js ✅

**Status:** ✅ COMPLETO

- [x] Schema refatorado para `migrations.ts`
- [x] Tabelas `tasks` e `time_sessions` validadas
- [x] Triggers validados (`tasks_updated_at`)
- [x] Tipos TypeScript alinhados com schema SQL

**Detalhes da Schema:**
```sql
-- tasks table
id (PRIMARY KEY)
title (NOT NULL)
description (nullable)
date (nullable, ISO format)
status (DEFAULT 'pending')
estimated_time (nullable, minutos)
spent_time (DEFAULT 0, minutos)
category (nullable)
created_at (auto datetime)
updated_at (auto datetime via trigger)

-- time_sessions table
id (PRIMARY KEY)
task_id (FOREIGN KEY → tasks.id, ON DELETE SET NULL)
started_at (auto datetime)
ended_at (nullable)

-- triggers
tasks_updated_at: Auto-update updated_at on task changes
```

---

### 1.1.3 - Criar migrations automatizadas ✅

**Status:** ✅ COMPLETO

Nova estrutura:
```
electron/db/
├── database.ts (persistência)
├── migrations.ts (NEW - sistema versionado)
├── schema.ts (re-export para compatibilidade)
└── test-crud.ts (NEW - validação)
```

**Características:**
- [x] Tabela `schema_migrations` para rastrear versão
- [x] Migrations executadas apenas uma vez
- [x] Versionamento (v1, v2, ...)
- [x] Log de execução no console
- [x] Suporte a futuros rollbacks

**Como adicionar nova migration:**
```typescript
// electron/db/migrations.ts
const MIGRATIONS = [
  {
    version: 2,
    name: 'add_tags_table',
    up: (db: any) => {
      db.run(`CREATE TABLE IF NOT EXISTS tags (...)`)
    }
  }
]
```

---

### 1.1.4 - Testar CRUD operations completo ✅

**Status:** ✅ COMPLETO

Testes implementados em `electron/db/test-crud.ts`:

- [x] **CREATE** - Inserir tarefa
- [x] **READ** - Buscar por ID
- [x] **UPDATE** - Modificar tarefa
- [x] **DELETE** - Remover tarefa
- [x] **SESSIONS** - Criar e gerenciar sessões de tempo
- [x] **VERIFY** - Validar persistência em disco

**Executar testes:**
```bash
# Requer ts-node
ts-node electron/db/test-crud.ts
```

---

## 🔧 Correções Implementadas

### main.ts - IPC Handlers Corrigidos

**Problema:** `getDatabase()` é async mas não estava sendo awaited

**Solução:**
```typescript
// ❌ ANTES
function registerIpcHandlers() {
  const db = getDatabase() // Retorna Promise, não Database
}

// ✅ DEPOIS
ipcMain.handle('tasks:getAll', async () => {
  const db = await getDatabase()
  return db.prepare(...).all()
})
```

**Detalhes das Correções:**
1. Todos os handlers são agora `async`
2. `await getDatabase()` em cada handler
3. Try/catch para error handling
4. `persistDatabase()` após mutações (CREATE, UPDATE, DELETE)
5. Bind parameters corrigido para sql.js API

---

## 🧪 Validação Manual

Para testar a persistência manualmente:

**1. Inicia o app:**
```bash
npm run electron:dev
```

**2. Criar uma tarefa via UI**

**3. Fechar e reabrir a app**

**Resultado esperado:** Tarefa ainda existe (persistência em disco)

---

## 📝 Documentação de IPC API

### Tasks
```typescript
nook.getTasks() → Promise<Task[]>
nook.getTaskById(id: number) → Promise<Task>
nook.createTask(input: CreateTaskInput) → Promise<Task>
nook.updateTask(id: number, input: UpdateTaskInput) → Promise<Task>
nook.deleteTask(id: number) → Promise<{ success: boolean }>
nook.completeTask(id: number) → Promise<Task>
```

### Time Sessions
```typescript
nook.startSession(taskId?: number) → Promise<TimeSession>
nook.endSession(sessionId: number) → Promise<TimeSession>
nook.getSessions(taskId: number) → Promise<TimeSession[]>
```

### Notifications
```typescript
nook.scheduleReminder(taskId: number) → Promise<void>
```

---

## ⚠️ Troubleshooting - Database Issues

### "database disk image is malformed"
```
Causa: Arquivo .db corrompido
Solução: Deletar ~/.nook/nook.db e reiniciar
```

### "no such table: tasks"
```
Causa: Migrations não foram executadas
Solução: Verificar console.log no main.ts na startup
```

### Dados não persistem após fechar app
```
Causa: persistDatabase() não foi chamado
Solução: Verificar se mutações chamam persistDatabase()
```

### Erros de tipo no renderer
```
Causa: Schema SQL divergiu de types/index.ts
Solução: Manter schema em migrations.ts sincronizado com types
```

---

## 📊 Métricas de Completude

| Item | Status | Notas |
|------|--------|-------|
| Persistência em disco | ✅ | Arquivo nook.db criado em userData |
| Schema validado | ✅ | 2 tables + 1 trigger |
| Migrations | ✅ | Sistema versionado com v1 |
| CRUD completo | ✅ | CREATE, READ, UPDATE, DELETE, Sessions |
| Error handling | ✅ | Try/catch em todos handlers |
| IPC API documentada | ✅ | Preload.ts seguro |
| Testes | ✅ | test-crud.ts pronto |

---

## 🚀 Próximos Passos (Fase 1.2 - IPC Communication)

1. Validar IPC handlers com teste integrado
2. Implementar error handling visual no UI
3. Testar com 100+ tarefas
4. Medir performance de startup

---

**Last Updated:** 2026-04-09  
**Next Review:** Task 1.2 - IPC Communication
