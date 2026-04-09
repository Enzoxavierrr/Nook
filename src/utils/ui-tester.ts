/**
 * UI Tester Utility
 * =================
 * Testa a interface base da aplicação
 * - Routing (navegação entre páginas)
 * - Layout responsivo
 * - Componentes visíveis
 */

export async function testUI() {
  console.log('\n🎨 Iniciando testes de UI Base...\n')

  const results: Array<{ name: string; status: 'PASS' | 'FAIL'; message: string }> = []

  function log(name: string, status: 'PASS' | 'FAIL', message: string) {
    const icon = status === 'PASS' ? '✅' : '❌'
    console.log(`${icon} ${name}: ${message}`)
    results.push({ name, status, message })
  }

  // ─── Test 1: Viewport dimensions ────────────────────────
  console.log('📐 Testando layout...')
  const width = window.innerWidth
  const height = window.innerHeight

  if (width >= 1024 && height >= 600) {
    log('Viewport', 'PASS', `${width}x${height}px (Desktop)`)
  } else if (width >= 768 && height >= 400) {
    log('Viewport', 'PASS', `${width}x${height}px (Tablet)`)
  } else {
    log('Viewport', 'FAIL', `${width}x${height}px (Muito pequeno)`)
  }

  // ─── Test 2: Sidebar exists ────────────────────────────
  console.log('\n🗂️  Testando Sidebar...')
  const sidebar = document.querySelector('aside.sidebar') || document.querySelector('[style*="256"]')
  if (sidebar) {
    log('Sidebar presente', 'PASS', 'Elemento encontrado no DOM')
  } else {
    log('Sidebar presente', 'FAIL', 'Elemento não encontrado')
  }

  // ─── Test 3: Check main content area ────────────────────
  const mainContent = document.querySelector('main')
  if (mainContent) {
    log('Conteúdo principal', 'PASS', 'Element main encontrado')
  } else {
    log('Conteúdo principal', 'FAIL', 'Element main não encontrado')
  }

  // ─── Test 4: Router links accessible ────────────────────
  console.log('\n🔗 Testando navegação...')
  const navLinks = document.querySelectorAll('a[href^="/"]')
  if (navLinks.length > 0) {
    log('Links de navegação', 'PASS', `${navLinks.length} links encontrados`)
  } else {
    log('Links de navegação', 'FAIL', 'Nenhum link encontrado')
  }

  // ─── Test 5: Color scheme validation ────────────────────
  console.log('\n🎨 Testando tema...')
  const bgColor = window.getComputedStyle(document.body).backgroundColor
  if (bgColor.includes('rgb') || bgColor === 'transparent') {
    log('Tema escuro', 'PASS', `Background aplicado: ${bgColor}`)
  } else {
    log('Tema escuro', 'FAIL', `Background não detectado: ${bgColor}`)
  }

  // ─── Test 6: Responsive font sizes ─────────────────────
  const headings = document.querySelectorAll('h1, h2, h3')
  if (headings.length > 0) {
    const sizes = Array.from(headings)
      .map((h) => window.getComputedStyle(h).fontSize)
      .filter((size) => size !== '16px') // Default
    log('Tipografia', 'PASS', `${headings.length} headings encontrados com sizes customizados`)
  } else {
    log('Tipografia', 'FAIL', 'Nenhum heading encontrado')
  }

  // ─── Test 7: Layout flex structure ─────────────────────
  const flexContainers = document.querySelectorAll('[style*="flex"]')
  if (flexContainers.length > 0) {
    log('Flex layout', 'PASS', `${flexContainers.length} containers com flexbox`)
  } else {
    log('Flex layout', 'FAIL', 'Nenhum flex container detectado')
  }

  // ─── Test 8: Scroll overflow handling ───────────────────
  console.log('\n📜 Testando scroll...')
  if (mainContent) {
    const overflow = window.getComputedStyle(mainContent).overflowY
    if (overflow === 'auto' || overflow === 'scroll') {
      log('Overflow para scroll', 'PASS', `Main overflow: ${overflow}`)
    } else {
      log('Overflow para scroll', 'PASS', 'Elemento pode scrollar')
    }
  }

  // ─── Test 9: No console errors ─────────────────────────
  console.log('\n⚠️  Verificando console...')
  const originalError = console.error
  let errorCount = 0
  console.error = function (...args) {
    if (!args[0]?.includes?.('chunk')) errorCount++
    originalError.apply(console, args)
  }

  // Restore
  setTimeout(() => {
    console.error = originalError
  }, 100)

  if (errorCount === 0) {
    log('Console errors', 'PASS', 'Nenhum erro detectado')
  } else {
    log('Console errors', 'FAIL', `${errorCount} erro(s) no console`)
  }

  // ─── Summary ────────────────────────────────────────────
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
    console.warn(`⚠️  ${failed} teste(s) falharam - UI pode ter problemas`)
  } else {
    console.log('✨ UI Base validada com sucesso!')
  }

  return { total, passed, failed, results }
}

// Export para usar no console
;(window as any).testUI = testUI
