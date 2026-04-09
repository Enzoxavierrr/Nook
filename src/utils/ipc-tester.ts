/**
 * IPC Tester Utility
 * ==================
 * Ferramenta para testar a comunicação IPC entre Renderer e Main Process
 * Importar e usar em dev mode para validar handlers
 *
 * Uso: import { testAllIPC } from '@/utils/ipc-tester'
 *      await testAllIPC()
 */

interface TestResult {
  name: string
  status: 'PASS' | 'FAIL'
  message: string
  error?: string
}

const results: TestResult[] = []

function log(test: string, status: 'PASS' | 'FAIL', message: string, error?: any) {
  results.push({ name: test, status, message, error: error?.message })
  const icon = status === 'PASS' ? '✅' : '❌'
  console.log(`${icon} ${test}: ${message}`)
  if (error) console.error('  Error:', error.message)
}

export async function testAllIPC() {
  console.log('\n🧪 Iniciando testes de IPC...\n')
  results.length = 0

  // Verificar se window.nook está disponível
  if (!window.nook) {
    console.error('❌ FATAL: window.nook não está disponível. IPC não foi configurado corretamente.')
    return
  }

  try {
    // ─── Task Tests ────────────────────────────────────────
    console.log('📋 Testando Tasks API...')

    // CREATE TASK
    let taskId: number
    try {
      const task = await window.nook.createTask({
        title: 'IPC Test Task',
        description: 'Tarefa de teste para validar IPC',
        date: new Date().toISOString().split('T')[0],
        estimatedTime: 30,
        category: 'Test',
      })
      taskId = task.id
      log('createTask', 'PASS', `Tarefa criada com ID: ${taskId}`)
    } catch (error) {
      log('createTask', 'FAIL', 'Falha ao criar tarefa', error)
      return
    }

    // READ TASK
    try {
      const task = await window.nook.getTaskById(taskId)
      if (task && task.id === taskId) {
        log('getTaskById', 'PASS', `Tarefa encontrada: "${task.title}"`)
      } else {
        log('getTaskById', 'FAIL', 'Tarefa não encontrada')
      }
    } catch (error) {
      log('getTaskById', 'FAIL', 'Erro ao buscar tarefa', error)
    }

    // GET ALL TASKS
    try {
      const tasks = await window.nook.getTasks()
      if (Array.isArray(tasks)) {
        log('getTasks', 'PASS', `${tasks.length} tarefa(s) encontrada(s)`)
      } else {
        log('getTasks', 'FAIL', 'getTasks não retornou array')
      }
    } catch (error) {
      log('getTasks', 'FAIL', 'Erro ao buscar todas tarefas', error)
    }

    // UPDATE TASK
    try {
      const updated = await window.nook.updateTask(taskId, {
        title: 'IPC Test Task - UPDATED',
        status: 'in_progress' as any,
      })
      if (updated.title === 'IPC Test Task - UPDATED') {
        log('updateTask', 'PASS', `Tarefa atualizada: "${updated.title}"`)
      } else {
        log('updateTask', 'FAIL', 'Tarefa não foi atualizada')
      }
    } catch (error) {
      log('updateTask', 'FAIL', 'Erro ao atualizar tarefa', error)
    }

    // COMPLETE TASK
    try {
      const completed = await window.nook.completeTask(taskId)
      if (completed.status === 'completed') {
        log('completeTask', 'PASS', 'Tarefa marcada como concluída')
      } else {
        log('completeTask', 'FAIL', 'Tarefa não foi marcada como concluída')
      }
    } catch (error) {
      log('completeTask', 'FAIL', 'Erro ao marcar tarefa como concluída', error)
    }

    // ─── Time Session Tests ────────────────────────────────
    console.log('\n⏱️  Testando Time Sessions API...')

    // START SESSION
    let sessionId: number
    try {
      const session = await window.nook.startSession(taskId)
      sessionId = session.id
      log('startSession', 'PASS', `Sessão iniciada com ID: ${sessionId}`)
    } catch (error) {
      log('startSession', 'FAIL', 'Erro ao iniciar sessão', error)
    }

    // SIMULAR TEMPO PASSANDO
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // END SESSION
    try {
      const session = await window.nook.endSession(sessionId)
      if (session.endedAt) {
        log('endSession', 'PASS', 'Sessão finalizada com timestamp')
      } else {
        log('endSession', 'FAIL', 'Sessão não tem endedAt')
      }
    } catch (error) {
      log('endSession', 'FAIL', 'Erro ao finalizar sessão', error)
    }

    // GET SESSIONS
    try {
      const sessions = await window.nook.getSessions(taskId)
      if (Array.isArray(sessions) && sessions.length > 0) {
        log('getSessions', 'PASS', `${sessions.length} sessão(ões) encontrada(s)`)
      } else {
        log('getSessions', 'FAIL', 'Nenhuma sessão encontrada')
      }
    } catch (error) {
      log('getSessions', 'FAIL', 'Erro ao buscar sessões', error)
    }

    // ─── Notification Tests ────────────────────────────────
    console.log('\n📲 Testando Notifications API...')

    // SCHEDULE REMINDER
    try {
      await window.nook.scheduleReminder(taskId)
      log('scheduleReminder', 'PASS', 'Lembrete agendado com sucesso')
    } catch (error) {
      log('scheduleReminder', 'FAIL', 'Erro ao agendar lembrete', error)
    }

    // ─── Cleanup ───────────────────────────────────────────
    console.log('\n🧹 Limpando dados de teste...')

    try {
      await window.nook.deleteTask(taskId)
      log('deleteTask', 'PASS', 'Tarefa de teste deletada')
    } catch (error) {
      log('deleteTask', 'FAIL', 'Erro ao deletar tarefa', error)
    }

    // ─── Summary ───────────────────────────────────────────
    console.log('\n📊 Resumo dos Testes:\n')
    const passed = results.filter((r) => r.status === 'PASS').length
    const failed = results.filter((r) => r.status === 'FAIL').length
    const total = results.length

    results.forEach((r) => {
      const icon = r.status === 'PASS' ? '✅' : '❌'
      console.log(`${icon} ${r.name}: ${r.message}`)
    })

    console.log(`\n${passed}/${total} testes passaram`)
    if (failed > 0) {
      console.error(`❌ ${failed} teste(s) falharam!`)
    } else {
      console.log('✨ Todos os testes passaram!')
    }

    return { total, passed, failed, results }
  } catch (error) {
    console.error('💥 Erro fatal nos testes:', error)
  }
}

// Export para usar no console do dev
;(window as any).testIPC = testAllIPC
