export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #080D18 0%, #0D1A30 60%, #091A12 100%)',
      padding: '2rem',
    }}>
      {children}
    </div>
  )
}
