'use client'

import Link from 'next/link'
import { useUser } from '@/contexts/UserContext'
import { useState } from 'react'
import { Trophy, Users, Calendar, BarChart3, LogOut, Menu, X } from 'lucide-react'

export default function Navbar() {
  const { user, logout } = useUser()
  const [open, setOpen] = useState(false)

  const displayName = user?.nickname || user?.name

  return (
    <nav className="fixed top-0 right-0 left-0 z-50 h-16 border-b border-[#1e1e2e] bg-[#0d0d1a]/95 backdrop-blur">
      <div className="max-w-6xl mx-auto px-4 h-full flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-green-400 font-bold text-lg">
          <span className="text-2xl">⚽</span>
          <span className="hidden sm:block">מונדיאל 2026</span>
        </Link>

        {user && (
          <>
            {/* Desktop nav */}
            <div className="hidden md:flex items-center gap-1">
              <NavLink href="/matches" icon={<Calendar size={16} />} label="משחקים" />
              <NavLink href="/groups" icon={<Users size={16} />} label="קבוצות" />
              <NavLink href="/leaderboard" icon={<BarChart3 size={16} />} label="דירוג" />
            </div>

            <div className="hidden md:flex items-center gap-3">
              <Link href="/profile" className="text-sm text-gray-300 hover:text-white transition">
                👤 {displayName}
              </Link>
              <button
                onClick={logout}
                className="flex items-center gap-1 text-sm text-red-400 hover:text-red-300 transition"
              >
                <LogOut size={14} />
                יציאה
              </button>
            </div>

            {/* Mobile toggle */}
            <button
              className="md:hidden text-gray-300"
              onClick={() => setOpen(!open)}
            >
              {open ? <X size={22} /> : <Menu size={22} />}
            </button>
          </>
        )}

        {!user && (
          <Link
            href="/register"
            className="bg-green-500 hover:bg-green-600 text-white text-sm px-4 py-2 rounded-lg transition"
          >
            התחברות
          </Link>
        )}
      </div>

      {/* Mobile menu */}
      {open && user && (
        <div className="md:hidden bg-[#0d0d1a] border-b border-[#1e1e2e] px-4 py-3 flex flex-col gap-3">
          <NavLink href="/matches" icon={<Calendar size={16} />} label="משחקים" onClick={() => setOpen(false)} />
          <NavLink href="/groups" icon={<Users size={16} />} label="קבוצות" onClick={() => setOpen(false)} />
          <NavLink href="/leaderboard" icon={<BarChart3 size={16} />} label="דירוג" onClick={() => setOpen(false)} />
          <Link href="/profile" className="text-sm text-gray-300" onClick={() => setOpen(false)}>👤 {displayName}</Link>
          <button onClick={() => { logout(); setOpen(false) }} className="text-sm text-red-400 text-right">
            יציאה
          </button>
        </div>
      )}
    </nav>
  )
}

function NavLink({ href, icon, label, onClick }: { href: string; icon: React.ReactNode; label: string; onClick?: () => void }) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-gray-300 hover:text-white hover:bg-white/5 transition"
    >
      {icon}
      {label}
    </Link>
  )
}
