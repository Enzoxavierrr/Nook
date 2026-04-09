import { FolderKanban } from 'lucide-react'

export default function Projects() {
  return (
    <main style={{ flex: 1, padding: 24, background: '#131313', overflowY: 'auto' }}>
      <h1 style={{ fontSize: 28, fontWeight: 600, color: '#ffffff', marginBottom: 32 }}>
        Projetos
      </h1>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '60px 24px',
          gap: 16,
          color: '#6b7280',
          textAlign: 'center',
        }}
      >
        <FolderKanban size={48} color="#494bd6" />
        <div>
          <p style={{ fontSize: 16, fontWeight: 500, color: '#ffffff', marginBottom: 4 }}>
            Em desenvolvimento
          </p>
          <p style={{ fontSize: 14 }}>
            A organização por projetos será implementada em breve
          </p>
        </div>
      </div>
    </main>
  )
}
