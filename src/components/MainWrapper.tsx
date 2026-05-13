'use client'

import { useNav } from '@/contexts/NavContext'

// Mobile menu has ~5 items × 44px + padding ≈ 260px
const MOBILE_MENU_HEIGHT = 260

export default function MainWrapper({ children }: { children: React.ReactNode }) {
  const { mobileMenuOpen } = useNav()

  return (
    <main
      className="min-h-screen"
      style={{
        position: 'relative',
        zIndex: 1,
        paddingTop: mobileMenuOpen ? `${64 + MOBILE_MENU_HEIGHT}px` : '64px',
        transition: 'padding-top 0.2s ease',
      }}
    >
      {children}
    </main>
  )
}
