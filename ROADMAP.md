# 🚀 Roadmap - Nook

**Data de criação:** 2026-04-09  
**Status:** MVP em desenvolvimento  
**Versão alvo:** v0.1.0

---

## 📊 Visão Geral

Este documento organiza os **próximos passos** do projeto Nook em fases bem definidas. Cada tarefa está vinculada a um objetivo maior e possui critérios de aceição claros.

---

## 🎯 Fases do Desenvolvimento

### **Fase 1: Consolidação da Base (Semana 1-2)**

Garantir que toda a infraestrutura core está funcionando corretamente.

#### 1.1 - Database & Persistence ✅ CRÍTICO
- [x] Implementar persistência real do SQLite (arquivo no disco)
- [x] Validar schema.ts contra sql.js
- [x] Criar migrations automatizadas
- [x] Testar CRUD operations completo

#### 1.2 - IPC Communication ✅ CRÍTICO
- [x] Validar todos os IPC handlers no main.ts
- [x] Testar comunicação renderer ↔ main
- [x] Implementar error handling nos handlers
- [x] Documentar API do contextBridge

#### 1.3 - UI Base ✅ CRÍTICO
- [x] Validar routing (Dashboard → Tasks → Timer)
- [x] Garantir que Sidebar funciona corretamente
- [x] Implementar placeholder pages onde necessário
- [x] Testar responsividade (fullscreen, resize)

---

### **Fase 2: Features MVP (Semana 2-3)**

Implementar funcionalidades essenciais do MVP.

#### 2.1 - Task Management ✅ ALTA PRIORIDADE
- [ ] Criar tarefa (modal ou inline form)
- [ ] Editar tarefa
- [ ] Deletar tarefa
- [ ] Marcar como concluída (checkbox)
- [ ] Definir data/deadline
- [ ] UI de listagem completa

#### 2.2 - Timer Feature ✅ ALTA PRIORIDADE
- [ ] Timer start/pause/stop
- [ ] Controle de tempo integrado
- [ ] Sessões de tempo (registro em DB)
- [ ] Integração com tarefas (timer → task)
- [ ] Visualização de tempo gasto

#### 2.3 - Notificações & Lembretes ✅ ALTA PRIORIDADE
- [ ] Implementar notificações nativas (Electron)
- [ ] Lembrete 1 dia antes (scheduler)
- [ ] Notificação ao concluir tarefa
- [ ] Configuração de lembretes

---

### **Fase 3: Polish & UX (Semana 3-4)**

Melhorar experiência do usuário e adicionar refinamentos.

#### 3.1 - Design & Visual ✅ MÉDIA PRIORIDADE
- [ ] Revisar paleta de cores (dark mode)
- [ ] Garantir consistent styling
- [ ] Implementar animations smooths (transições)
- [ ] Testar acessibilidade (contraste, etc)

#### 3.2 - Dados & Validação ✅ MÉDIA PRIORIDADE
- [ ] Validar inputs (titulo, data, etc)
- [ ] Sanitizar dados antes de salvar
- [ ] Tratamento de erros visual (toasts/alerts)
- [ ] Confirmação antes de deletar

#### 3.3 - Performance & Otimização ✅ MÉDIA PRIORIDADE
- [ ] Medir tempo de inicialização
- [ ] Otimizar bundle size (vite config)
- [ ] Lazy load components se necessário
- [ ] Profile memory usage

---

### **Fase 4: Testes & Documentação (Semana 4)**

Garantir qualidade e documentação.

#### 4.1 - Testing ✅ BAIXA PRIORIDADE (MVP)
- [ ] Testes unitários (hooks, utils)
- [ ] Testes de integração (IPC)
- [ ] Testes de E2E (Electron)

#### 4.2 - Documentação ✅ BAIXA PRIORIDADE
- [ ] Documentar API do IPC
- [ ] Documentar estrutura de dados
- [ ] Guia de contribuição
- [ ] Troubleshooting guide

---

## 📋 Backlog - Features Futuras

Estes items **NÃO** fazem parte do MVP, mas estão mapeados para depois.

### **Métricas & Estatísticas (v0.2)**
- [ ] Dashboard de produtividade
- [ ] Gráficos de tempo por tarefa
- [ ] Heatmap de produtividade
- [ ] Relatórios semanais

### **Planejamento Avançado (v0.2)**
- [ ] Recorrência de tarefas
- [ ] Planejamento semanal
- [ ] Priorização de tarefas
- [ ] Tags/Categorias

### **Sincronização (v0.3)**
- [ ] Backup automático
- [ ] Sincronização opcional (cloud)
- [ ] Exportar/Importar dados

### **Inteligência Artificial (v0.4+)**
- [ ] Sugestões de tarefas
- [ ] Análise de produtividade
- [ ] Previsões de deadline

---

## 🔍 Checklist de Verificação

Antes de considerar o MVP completo:

- [ ] Todas as tarefas da Fase 1, 2 e 3 estão concluídas
- [ ] App inicia em < 2s
- [ ] Sem erros no console (main + renderer)
- [ ] Todas as rotas funcionam
- [ ] Database persiste dados corretamente
- [ ] Notificações funcionam no macOS
- [ ] Build executável gera sem erros
- [ ] Testado em arquivo grande (100+ tarefas)

---

## 📈 Métricas de Sucesso

| Métrica | Alvo | Status |
|---------|------|--------|
| Tempo de inicialização | < 2s | ⏳ |
| Bundle size | < 150MB | ⏳ |
| Features MVP | 100% | 🔨 |
| Cobertura de testes | 70%+ | ⏳ |
| Performance (60 FPS) | ✅ | ⏳ |

---

## 🛠️ Stack Confirmado

- **Desktop:** Electron 31.x
- **UI:** React 18.x + TypeScript
- **Estilo:** Tailwind CSS 3.x
- **Database:** sql.js 1.x (SQLite WebAssembly)
- **Bundler:** Vite 5.x

---

## 📞 Notas Importantes

1. **sql.js + Persistência:** Verificar se está salvando em arquivo. Pode ser necessário usar `better-sqlite3` para performance melhor.
2. **Notificações:** Usar `new Notification()` do Electron no main process.
3. **IPC Security:** Manter contextBridge restrito (apenas métodos necessários).
4. **Offline-first:** Testar desconectando de internet (desktop app, mas bom validar).

---

**Last updated:** 2026-04-09  
**Atualizado por:** Claude Code
