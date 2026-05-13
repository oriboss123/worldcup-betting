'use client'

import { createContext, useContext, useState, ReactNode } from 'react'

interface NavContextType {
  mobileMenuOpen: boolean
  setMobileMenuOpen: (open: boolean) => void
}

const NavContext = createContext<NavContextType>({
  mobileMenuOpen: false,
  setMobileMenuOpen: () => {},
})

export function NavProvider({ children }: { children: ReactNode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  return (
    <NavContext.Provider value={{ mobileMenuOpen, setMobileMenuOpen }}>
      {children}
    </NavContext.Provider>
  )
}

export const useNav = () => useContext(NavContext)
