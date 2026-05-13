import type { Metadata } from 'next'
import './globals.css'
import { UserProvider } from '@/contexts/UserContext'
import Navbar from '@/components/Navbar'

export const metadata: Metadata = {
  title: 'מונדיאל 2026 - הימורים',
  description: 'הימור על משחקי מונדיאל 2026 עם חברים',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="he" dir="rtl">
      <body>
        <UserProvider>
          <Navbar />
          <main className="min-h-screen pt-16">{children}</main>
        </UserProvider>
      </body>
    </html>
  )
}
