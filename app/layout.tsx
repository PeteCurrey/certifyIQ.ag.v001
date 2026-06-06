import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'Avorria — EPC Assessments | Chesterfield & Derbyshire',
    template: 'Avorria | %s',
  },
  description: 'Fast, transparent, fully accredited Energy Performance Certificates for homeowners, landlords and estate agents. Certificate issued within 24 hours of assessment.',
  openGraph: {
    type: 'website',
    locale: 'en_GB',
    url: 'https://avorria.co.uk',
    siteName: 'Avorria',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=DM+Mono:ital,wght@0,300;0,400;0,500;1,300;1,400;1,500&family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&family=Syne:wght@400..800&display=swap" rel="stylesheet" />
      </head>
      <body>{children}</body>
    </html>
  )
}
