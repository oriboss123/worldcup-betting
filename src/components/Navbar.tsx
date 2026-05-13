'use client'

import Link from 'next/link'
import { useUser } from '@/contexts/UserContext'
import { useNav } from '@/contexts/NavContext'
import { useState } from 'react'
import { Trophy, Users, Calendar, BarChart3, LogOut, Menu, X, User } from 'lucide-react'
import { usePathname } from 'next/navigation'

export default function Navbar() {
  const { user, logout } = useUser()
  const { setMobileMenuOpen } = useNav()
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  const toggleMenu = (val: boolean) => {
    setOpen(val)
    setMobileMenuOpen(val)
  }
  const displayName = user?.nickname || user?.name

  const links = [
    { href: '/matches', icon: <Calendar size={15} />, label: 'משחקים' },
    { href: '/groups', icon: <Users size={15} />, label: 'קבוצות' },
    { href: '/leaderboard', icon: <BarChart3 size={15} />, label: 'דירוג' },
  ]

  return (
    <nav className="fixed top-0 right-0 left-0 z-50 h-16"
      style={{
        background: 'linear-gradient(180deg, rgba(4,4,12,0.98) 0%, rgba(6,6,20,0.95) 100%)',
        borderBottom: '1px solid rgba(34,197,94,0.15)',
        boxShadow: '0 4px 40px rgba(34,197,94,0.08)',
        backdropFilter: 'blur(12px)',
      }}>
      <div className="max-w-6xl mx-auto px-4 h-full flex items-center justify-between">
        {/* Logo */}
        <Link href={user ? '/matches' : '/'} className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-lg"
            style={{ background: 'linear-gradient(135deg, #15803d, #22c55e)', boxShadow: '0 0 15px rgba(34,197,94,0.3)' }}>
            ⚽
          </div>
          <div className="hidden sm:block">
            <div className="text-white font-black text-base leading-none">מונדיאל 2026</div>
            <div className="text-green-400 text-xs leading-none mt-0.5">הימורים עם חברים</div>
          </div>
        </Link>

        {user && (
          <>
            {/* Desktop nav */}
            <div className="hidden md:flex items-center gap-1">
              {links.map(l => {
                const active = pathname === l.href
                return (
                  <Link key={l.href} href={l.href}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition ${
                      active
                        ? 'text-white'
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`}
                    style={active ? {
                      background: 'linear-gradient(135deg, rgba(34,197,94,0.15), rgba(16,185,129,0.08))',
                      border: '1px solid rgba(34,197,94,0.25)',
                      color: '#4ade80',
                    } : {}}>
                    {l.icon}
                    {l.label}
                  </Link>
                )
              })}
            </div>

            <div className="hidden md:flex items-center gap-3">
              <Link href="/profile"
                className="flex items-center gap-2 text-sm text-gray-300 hover:text-white transition px-3 py-1.5 rounded-xl hover:bg-white/5">
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-green-500 to-emerald-400 flex items-center justify-center text-xs font-bold text-white">
                  {displayName?.[0]?.toUpperCase()}
                </div>
                {displayName}
              </Link>
              <button onClick={logout}
                className="flex items-center gap-1.5 text-sm text-red-400/70 hover:text-red-400 transition px-2 py-1.5 rounded-lg hover:bg-red-500/10">
                <LogOut size={14} />
              </button>
            </div>

            <button className="md:hidden text-gray-400 hover:text-white transition" onClick={() => toggleMenu(!open)}>
              {open ? <X size={22} /> : <Menu size={22} />}
            </button>
          </>
        )}

        {!user && (
          <Link href="/register"
            className="text-sm font-semibold px-5 py-2 rounded-xl text-white transition"
            style={{ background: 'linear-gradient(135deg, #15803d, #22c55e)', boxShadow: '0 2px 15px rgba(34,197,94,0.3)' }}>
            כניסה / הרשמה
          </Link>
        )}
      </div>

      {/* Mobile menu */}
      {open && user && (
        <div className="md:hidden px-4 py-3 flex flex-col gap-1"
          style={{ background: 'rgba(4,4,12,0.98)', borderBottom: '1px solid rgba(34,197,94,0.1)' }}>
          {links.map(l => (
            <Link key={l.href} href={l.href} onClick={() => toggleMenu(false)}
              className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-gray-300 hover:text-white hover:bg-white/5 text-sm transition">
              {l.icon}{l.label}
            </Link>
          ))}
          <Link href="/profile" onClick={() => toggleMenu(false)}
            className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-gray-300 hover:text-white hover:bg-white/5 text-sm transition">
            <User size={15} />הפרופיל שלי
          </Link>
          <button onClick={() => { logout(); toggleMenu(false) }}
            className="flex items-center gap-2 px-3 py-2 text-red-400 text-sm text-right">
            <LogOut size={14} />התנתק
          </button>
        </div>
      )}
    </nav>
  )
}
