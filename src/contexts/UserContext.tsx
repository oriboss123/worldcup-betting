'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { User } from '@/lib/types'

interface UserContextType {
  user: User | null
  setUser: (user: User | null) => void
  logout: () => void
  loading: boolean
}

const UserContext = createContext<UserContextType>({
  user: null,
  setUser: () => {},
  logout: () => {},
  loading: true,
})

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem('wc_user')
    if (stored) {
      try {
        setUserState(JSON.parse(stored))
      } catch {}
    }
    setLoading(false)
  }, [])

  const setUser = (u: User | null) => {
    setUserState(u)
    if (u) {
      localStorage.setItem('wc_user', JSON.stringify(u))
    } else {
      localStorage.removeItem('wc_user')
    }
  }

  const logout = () => setUser(null)

  return (
    <UserContext.Provider value={{ user, setUser, logout, loading }}>
      {children}
    </UserContext.Provider>
  )
}

export const useUser = () => useContext(UserContext)
