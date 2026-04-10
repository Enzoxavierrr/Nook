/**
 * Test script para validar CRUD operations do SQLite
 * Execute com: ts-node electron/db/test-crud.ts
 */

import { getDatabase, closeDatabase } from './database'
import { runMigrations } from './migrations'

function testCRUD() {
  console.log('🧪 Iniciando testes CRUD...\n')

  try {
    // 1. Initialize database and migrations
    console.log('1️⃣  Executando migrations...')
    runMigrations()
    console.log('   ✅ Migrations completadas\n')

    const db = getDatabase()

    // 2. CREATE - Insert task
    console.log('2️⃣  CREATE - Inserindo tarefa...')
    const result = db.prepare(`
      INSERT INTO tasks (title, description, date, estimated_time, category)
      VALUES (?, ?, ?, ?, ?)
    `).run('Test Task', 'Test Description', '2026-04-10', 60, 'Test')

    const taskId = result.lastInsertRowid
    console.log(`   ✅ Tarefa criada com ID: ${taskId}\n`)

    // 3. READ - Get task by ID
    console.log('3️⃣  READ - Buscando tarefa por ID...')
    const task = db.prepare('SELECT * FROM tasks WHERE id = ?').get(taskId)
    if (task) {
      console.log('   ✅ Tarefa encontrada:', task)
    } else {
      console.log('   ❌ Tarefa não encontrada')
    }
    console.log()

    // 4. UPDATE - Modify task
    console.log('4️⃣  UPDATE - Atualizando tarefa...')
    db.prepare(`
      UPDATE tasks
      SET title = ?, description = ?, status = ?
      WHERE id = ?
    `).run('Updated Task', 'Updated Description', 'in_progress', taskId)

    const updatedTask = db.prepare('SELECT * FROM tasks WHERE id = ?').get(taskId)
    console.log('   ✅ Tarefa atualizada:', updatedTask)
    console.log()

    // 5. CREATE - Time session
    console.log('5️⃣  CREATE - Iniciando sessão de tempo...')
    const sessionResult = db.prepare('INSERT INTO time_sessions (task_id) VALUES (?)').run(taskId)
    const sessionId = sessionResult.lastInsertRowid
    console.log(`   ✅ Sessão criada com ID: ${sessionId}\n`)

    // 6. READ - Get sessions by task
    console.log('6️⃣  READ - Buscando sessões por ID da tarefa...')
    const sessions = db.prepare('SELECT * FROM time_sessions WHERE task_id = ?').all(taskId)
    console.log(`   ✅ Encontradas ${sessions.length} sessão(ões)`)
    console.log()

    // 7. DELETE - Remove task
    console.log('7️⃣  DELETE - Removendo tarefa...')
    db.prepare('DELETE FROM tasks WHERE id = ?').run(taskId)
    console.log('   ✅ Tarefa deletada\n')

    // 8. Verify deletion
    console.log('8️⃣  VERIFY - Verificando se tarefa foi deletada...')
    const deletedTask = db.prepare('SELECT * FROM tasks WHERE id = ?').get(taskId)
    if (!deletedTask) {
      console.log('   ✅ Tarefa deletada com sucesso\n')
    } else {
      console.log('   ❌ Tarefa ainda existe\n')
    }

    // 9. List all tasks
    console.log('9️⃣  LIST - Todas as tarefas restantes...')
    const allTasks = db.prepare('SELECT * FROM tasks').all()
    console.log(`   ✅ Total de tarefas: ${allTasks.length}`)
    if (allTasks.length > 0) {
      console.log('   Tarefas:', allTasks)
    }
    console.log()

    console.log('✨ Todos os testes completados!')
  } catch (error) {
    console.error('❌ Teste falhou:', error)
  } finally {
    closeDatabase()
  }
}

testCRUD()
