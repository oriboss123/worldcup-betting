'use client'
export const dynamic = 'force-dynamic'

import { useEffect, useState } from 'react'
import { useUser } from '@/contexts/UserContext'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Match, User } from '@/lib/types'
import { STAGE_LABELS } from '@/lib/wc2026-matches'
import { formatMatchDate } from '@/lib/utils'
import { Trash2 } from 'lucide-react'

const ADMIN_PHONE = '0549774566'

export default function AdminPage() {
  const { user, loading } = useUser()
  const router = useRouter()
  const supabase = createClient()

  const [matches, setMatches] = useState<Match[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [updating, setUpdating] = useState<string | null>(null)
  const [scores, setScores] = useState<Record<string, { home: string; away: string; status: string }>>({})
  const [tab, setTab] = useState<'upcoming' | 'finished' | 'users'>('upcoming')
  const [deletingUser, setDeletingUser] = useState<string | null>(null)

  useEffect(() => {
    if (!loading && !user) { router.push('/register'); return }
    if (!loading && user && user.phone !== ADMIN_PHONE) router.push('/matches')
  }, [user, loading])

  useEffect(() => {
    const fetchMatches = async () => {
      const { data } = await supabase.from('matches').select('*').order('match_number')
      if (data) {
        setMatches(data)
        const initial: Record<string, { home: string; away: string; status: string }> = {}
        data.forEach((m: Match) => {
          initial[m.id] = { home: m.home_score?.toString() ?? '', away: m.away_score?.toString() ?? '', status: m.status }
        })
        setScores(initial)
      }
    }
    fetchMatches()
  }, [])

  useEffect(() => {
    if (tab !== 'users') return
    const fetchUsers = async () => {
      const { data } = await supabase.from('users').select('*').order('created_at', { ascending: false })
      if (data) setUsers(data)
    }
    fetchUsers()
  }, [tab])

  const handleUpdate = async (matchId: string) => {
    const s = scores[matchId]
    if (!s) return
    setUpdating(matchId)
    if (s.status === 'finished' && s.home !== '' && s.away !== '') {
      await supabase.from('matches').update({ home_score: parseInt(s.home), away_score: parseInt(s.away), status: 'finished' }).eq('id', matchId)
      await supabase.rpc('resolve_match_bets', { p_match_id: matchId })
    } else {
      await supabase.from('matches').update({ status: s.status }).eq('id', matchId)
    }
    const { data } = await supabase.from('matches').select('*').order('match_number')
    if (data) setMatches(data)
    setUpdating(null)
  }

  const handleDeleteUser = async (userId: string, userName: string) => {
    if (!confirm(`למחוק את המשתמש "${userName}"?\nכל ההימורים וחברות הקבוצות שלו יימחקו.`)) return
    setDeletingUser(userId)
    const { error } = await supabase.from('users').delete().eq('id', userId)
    if (error) {
      alert('שגיאה במחיקה: ' + error.message)
    } else {
      setUsers(prev => prev.filter(u => u.id !== userId))
    }
    setDeletingUser(null)
  }

  const handleSeedMatches = async () => {
    if (!confirm('טען את כל משחקי המונדיאל 2026?')) return
    const { WC2026_MATCHES } = await import('@/lib/wc2026-matches')
    const { error } = await supabase.from('matches').insert(WC2026_MATCHES)
    if (error) alert('שגיאה: ' + error.message)
    else alert('נטענו ' + WC2026_MATCHES.length + ' משחקים!')
    window.location.reload()
  }

  if (loading || !user) return null

  const filtered = matches.filter(m => tab === 'upcoming' ? m.status !== 'finished' : m.status === 'finished')

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">🔧 ניהול</h1>
        {tab !== 'users' && matches.length === 0 && (
          <button onClick={handleSeedMatches}
            className="bg-green-500 hover:bg-green-600 text-white text-sm px-4 py-2 rounded-lg transition">
            טען משחקי מונדיאל 2026
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {[
          { key: 'upcoming', label: `עתידיים (${matches.filter(m => m.status !== 'finished').length})` },
          { key: 'finished', label: `הסתיימו (${matches.filter(m => m.status === 'finished').length})` },
          { key: 'users', label: `משתמשים` },
        ].map(t => (
          <button key={t.key} onClick={() => setTab(t.key as any)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition ${tab === t.key ? 'bg-green-500 text-white' : 'bg-[#0a0a1a] border border-[#1a1a30] text-gray-400 hover:text-white'}`}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Users tab */}
      {tab === 'users' && (
        <div className="rounded-2xl overflow-hidden" style={{ background: '#0a0a1a', border: '1px solid #1a1a30' }}>
          <div className="px-4 py-3 border-b text-xs text-gray-500 font-semibold" style={{ borderColor: '#1a1a30' }}>
            {users.length} משתמשים רשומים
          </div>
          <div className="divide-y" style={{ borderColor: '#1a1a30' }}>
            {users.map(u => (
              <div key={u.id} className="flex items-center px-4 py-3 gap-3">
                <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
                  style={{ background: 'linear-gradient(135deg, #15803d, #22c55e)' }}>
                  {(u.nickname || u.name)[0]?.toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-medium text-sm truncate">{u.nickname || u.name}</p>
                  <p className="text-gray-600 text-xs font-mono">{u.phone}</p>
                </div>
                <div className={`text-sm font-bold ${u.total_points >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {u.total_points >= 0 ? '+' : ''}{u.total_points}
                </div>
                {u.phone !== ADMIN_PHONE && (
                  <button
                    onClick={() => handleDeleteUser(u.id, u.nickname || u.name)}
                    disabled={deletingUser === u.id}
                    className="p-2 rounded-lg text-gray-600 hover:text-red-400 hover:bg-red-500/10 transition disabled:opacity-40"
                    title="מחק משתמש"
                  >
                    <Trash2 size={15} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Match tabs */}
      {tab !== 'users' && (
        <div className="space-y-2">
          {filtered.map(m => {
            const s = scores[m.id]
            if (!s) return null
            return (
              <div key={m.id} className="rounded-xl p-4" style={{ background: '#0a0a1a', border: '1px solid #1a1a30' }}>
                <div className="flex items-center justify-between mb-3">
                  <div className="text-sm text-white font-medium">
                    {m.home_flag} {m.home_team} נגד {m.away_team} {m.away_flag}
                  </div>
                  <span className="text-xs text-gray-500">{formatMatchDate(m.match_date)}</span>
                </div>
                <div className="flex items-center gap-3">
                  <select value={s.status}
                    onChange={e => setScores(prev => ({ ...prev, [m.id]: { ...prev[m.id], status: e.target.value } }))}
                    className="bg-[#070712] border border-[#1a1a30] rounded-lg px-2 py-2 text-white text-sm outline-none">
                    <option value="upcoming">עתיד</option>
                    <option value="live">LIVE</option>
                    <option value="finished">הסתיים</option>
                  </select>
                  {s.status === 'finished' && (
                    <>
                      <input type="number" min={0} max={20} value={s.home}
                        onChange={e => setScores(prev => ({ ...prev, [m.id]: { ...prev[m.id], home: e.target.value } }))}
                        placeholder="בית"
                        className="w-16 bg-[#070712] border border-[#1a1a30] rounded-lg px-2 py-2 text-white text-center text-sm outline-none focus:border-green-500" />
                      <span className="text-gray-500">:</span>
                      <input type="number" min={0} max={20} value={s.away}
                        onChange={e => setScores(prev => ({ ...prev, [m.id]: { ...prev[m.id], away: e.target.value } }))}
                        placeholder="חוץ"
                        className="w-16 bg-[#070712] border border-[#1a1a30] rounded-lg px-2 py-2 text-white text-center text-sm outline-none focus:border-green-500" />
                    </>
                  )}
                  <button onClick={() => handleUpdate(m.id)} disabled={updating === m.id}
                    className="mr-auto bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white text-sm px-4 py-2 rounded-lg transition font-medium">
                    {updating === m.id ? '...' : 'עדכן'}
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
