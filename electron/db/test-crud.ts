/**
 * Test script para validar CRUD operations do SQLite
 * Execute com: ts-node electron/db/test-crud.ts
 */

import { getDatabase, persistDatabase, closeDatabase } from './database'
import { runMigrations } from './migrations'

async function testCRUD() {
  console.log('🧪 Starting CRUD tests...\n')

  try {
    // 1. Initialize database and migrations
    console.log('1️⃣  Running migrations...')
    await runMigrations()
    console.log('   ✅ Migrations completed\n')

    const db = await getDatabase()

    // 2. CREATE - Insert task
    console.log('2️⃣  CREATE - Inserting task...')
    const createStmt = db.prepare(`
      INSERT INTO tasks (title, description, date, estimated_time, category)
      VALUES (?, ?, ?, ?, ?)
    `)
    createStmt.bind(['Test Task', 'Test Description', '2026-04-10', 60, 'Test'])
    createStmt.step()
    const taskId = (db as any).exec('SELECT last_insert_rowid() as id')[0]?.values[0]?.[0]
    persistDatabase()
    console.log(`   ✅ Task created with ID: ${taskId}\n`)

    // 3. READ - Get task by ID
    console.log('3️⃣  READ - Fetching task by ID...')
    const readStmt = db.prepare('SELECT * FROM tasks WHERE id = ?')
    const rows = readStmt.getAsObject([taskId])
    if (rows && rows.length > 0) {
      console.log('   ✅ Task found:', rows[0])
    } else {
      console.log('   ❌ Task not found')
    }
    console.log()

    // 4. UPDATE - Modify task
    console.log('4️⃣  UPDATE - Updating task...')
    const updateStmt = db.prepare(`
      UPDATE tasks
      SET title = ?, description = ?, status = ?
      WHERE id = ?
    `)
    updateStmt.bind(['Updated Task', 'Updated Description', 'in_progress', taskId])
    updateStmt.step()
    persistDatabase()

    const updatedRows = db.prepare('SELECT * FROM tasks WHERE id = ?').getAsObject([taskId])
    console.log('   ✅ Task updated:', updatedRows[0])
    console.log()

    // 5. CREATE - Time session
    console.log('5️⃣  CREATE - Starting time session...')
    const sessionStmt = db.prepare('INSERT INTO time_sessions (task_id) VALUES (?)')
    sessionStmt.bind([taskId])
    sessionStmt.step()
    const sessionId = (db as any).exec('SELECT last_insert_rowid() as id')[0]?.values[0]?.[0]
    persistDatabase()
    console.log(`   ✅ Session created with ID: ${sessionId}\n`)

    // 6. READ - Get sessions by task
    console.log('6️⃣  READ - Fetching sessions by task ID...')
    const sessionsRows = db.prepare('SELECT * FROM time_sessions WHERE task_id = ?').getAsObject([taskId])
    console.log(`   ✅ Found ${sessionsRows.length} session(s)`)
    console.log()

    // 7. DELETE - Remove task
    console.log('7️⃣  DELETE - Removing task...')
    const deleteStmt = db.prepare('DELETE FROM tasks WHERE id = ?')
    deleteStmt.bind([taskId])
    deleteStmt.step()
    persistDatabase()
    console.log('   ✅ Task deleted\n')

    // 8. Verify deletion
    console.log('8️⃣  VERIFY - Checking if task is deleted...')
    const deletedRows = db.prepare('SELECT * FROM tasks WHERE id = ?').getAsObject([taskId])
    if (deletedRows.length === 0) {
      console.log('   ✅ Task successfully deleted\n')
    } else {
      console.log('   ❌ Task still exists\n')
    }

    // 9. List all tasks
    console.log('9️⃣  LIST - All remaining tasks...')
    const allTasks = db.prepare('SELECT * FROM tasks').getAsObject([])
    console.log(`   ✅ Total tasks: ${allTasks.length}`)
    if (allTasks.length > 0) {
      console.log('   Tasks:', allTasks)
    }
    console.log()

    console.log('✨ All tests completed!')
  } catch (error) {
    console.error('❌ Test failed:', error)
  } finally {
    closeDatabase()
  }
}

testCRUD()
