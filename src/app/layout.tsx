import type { Metadata } from 'next'
import './globals.css'
import { UserProvider } from '@/contexts/UserContext'
import { NavProvider } from '@/contexts/NavContext'
import Navbar from '@/components/Navbar'
import FlagBackground from '@/components/FlagBackground'
import MainWrapper from '@/components/MainWrapper'

export const metadata: Metadata = {
  title: 'מונדיאל 2026 — הימורים עם חברים',
  description: 'הימר על משחקי מונדיאל 2026, צור קבוצות עם חברים ותתחרה על מי מנחש הכי טוב',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="he" dir="rtl">
      <body>
        <FlagBackground />
        <NavProvider>
          <UserProvider>
            <Navbar />
            <MainWrapper>{children}</MainWrapper>
          </UserProvider>
        </NavProvider>
      </body>
    </html>
  )
}
