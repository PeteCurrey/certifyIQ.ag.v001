export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, var(--bg-obsidian) 0%, var(--bg-surface-elevated) 100%)',
      padding: '2rem',
    }}>
      {children}
    </div>
  )
}
