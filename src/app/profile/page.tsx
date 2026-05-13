'use client'
export const dynamic = 'force-dynamic'

import { useEffect, useState } from 'react'
import { useUser } from '@/contexts/UserContext'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Bet, Match } from '@/lib/types'
import { STAGE_LABELS } from '@/lib/wc2026-matches'
import { formatMatchDate } from '@/lib/utils'

export default function ProfilePage() {
  const { user, setUser, logout } = useUser()
  const router = useRouter()
  const supabase = createClient()

  const [bets, setBets] = useState<(Bet & { match: Match })[]>([])
  const [editing, setEditing] = useState(false)
  const [name, setName] = useState('')
  const [nickname, setNickname] = useState('')
  const [saving, setSaving] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [pinMode, setPinMode] = useState(false)
  const [newPin, setNewPin] = useState('')
  const [pinSaving, setPinSaving] = useState(false)
  const [pinMsg, setPinMsg] = useState('')

  useEffect(() => {
    if (!user) { router.push('/register'); return }
    setName(user.name)
    setNickname(user.nickname || '')

    const fetchBets = async () => {
      const { data } = await supabase
        .from('bets')
        .select('*, match:matches(*)')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(20)

      if (data) setBets(data)
      setFetching(false)
    }
    fetchBets()
  }, [user])

  const handleSavePin = async () => {
    if (!user || newPin.length !== 4 || !/^\d{4}$/.test(newPin)) {
      setPinMsg('קוד PIN חייב להיות 4 ספרות')
      return
    }
    setPinSaving(true)
    const { data } = await supabase.from('users').update({ pin: newPin }).eq('id', user.id).select().single()
    if (data) { setUser(data); localStorage.setItem('wc_user', JSON.stringify(data)) }
    setPinSaving(false)
    setPinMode(false)
    setNewPin('')
    setPinMsg('✅ קוד PIN נשמר בהצלחה!')
    setTimeout(() => setPinMsg(''), 3000)
  }

  const handleSave = async () => {
    if (!user) return
    setSaving(true)
    const { data } = await supabase
      .from('users')
      .update({ name: name.trim(), nickname: nickname.trim() || null })
      .eq('id', user.id)
      .select()
      .single()

    if (data) {
      setUser(data)
      localStorage.setItem('wc_user', JSON.stringify(data))
    }
    setSaving(false)
    setEditing(false)
  }

  if (!user) return null

  const resolvedBets = bets.filter(b => b.resolved)
  const totalEarned = resolvedBets.reduce((sum, b) => sum + (b.points_earned || 0), 0)
  const correctWinners = resolvedBets.filter(b => b.bet_winner && (b.points_earned || 0) > 0).length
  const correctScores = resolvedBets.filter(b => b.bet_home_score !== null && (b.points_earned || 0) >= 6).length

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold text-white mb-6">הפרופיל שלי</h1>

      {/* Profile card */}
      <div className="bg-[#13131f] border border-[#1e1e2e] rounded-xl p-5 mb-6">
        {!editing ? (
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xl font-bold text-white">{user.nickname || user.name}</p>
              {user.nickname && <p className="text-sm text-gray-400">{user.name}</p>}
              <p className="text-sm text-gray-500 mt-1 font-mono">{user.phone}</p>
            </div>
            <button
              onClick={() => setEditing(true)}
              className="text-sm text-blue-400 hover:text-blue-300 transition"
            >
              ערוך
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            <div>
              <label className="text-xs text-gray-500 block mb-1">שם</label>
              <input
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full bg-[#0a0a0f] border border-[#2a2a3e] rounded-lg px-3 py-2 text-white text-sm outline-none focus:border-green-500"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500 block mb-1">כינוי</label>
              <input
                value={nickname}
                onChange={e => setNickname(e.target.value)}
                placeholder="לא חובה"
                className="w-full bg-[#0a0a0f] border border-[#2a2a3e] rounded-lg px-3 py-2 text-white text-sm outline-none focus:border-green-500"
              />
            </div>
            <div className="flex gap-2">
              <button onClick={handleSave} disabled={saving} className="bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-3 rounded-xl transition">
                {saving ? 'שומר...' : 'שמור'}
              </button>
              <button onClick={() => setEditing(false)} className="text-gray-400 hover:text-white px-6 py-3 rounded-xl transition border border-[#1a1a30]">
                ביטול
              </button>
            </div>
          </div>
        )}
      </div>

      {/* PIN setup */}
      <div className="bg-[#0a0a1a] border border-[#1a1a30] rounded-xl p-5 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-white">קוד PIN</p>
            <p className="text-xs text-gray-500 mt-0.5">
              {user.pin ? '✅ קוד PIN מוגדר — מגן על החשבון שלך' : '⚠️ לא הגדרת קוד PIN עדיין'}
            </p>
          </div>
          <button onClick={() => { setPinMode(p => !p); setPinMsg('') }}
            className="text-xs text-blue-400 hover:text-blue-300 transition">
            {user.pin ? 'שנה PIN' : 'הגדר PIN'}
          </button>
        </div>
        {pinMode && (
          <div className="mt-4 space-y-3">
            <input
              type="password" inputMode="numeric" maxLength={4}
              value={newPin} onChange={e => setNewPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
              placeholder="4 ספרות"
              className="w-full bg-[#070712] border border-[#2a2a4e] rounded-xl px-4 py-2.5 text-white text-center text-xl tracking-widest outline-none focus:border-green-500 transition"
            />
            <div className="flex gap-2">
              <button onClick={handleSavePin} disabled={pinSaving}
                className="flex-1 bg-green-500 hover:bg-green-600 text-white text-sm py-2.5 rounded-xl transition font-semibold disabled:opacity-50">
                {pinSaving ? '...' : 'שמור PIN'}
              </button>
              <button onClick={() => { setPinMode(false); setNewPin('') }}
                className="px-4 text-gray-500 hover:text-gray-300 border border-[#1a1a30] rounded-xl text-sm transition">
                ביטול
              </button>
            </div>
          </div>
        )}
        {pinMsg && <p className="text-xs mt-3 text-green-400">{pinMsg}</p>}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <StatCard label="נקודות כולל" value={`${user.total_points >= 0 ? '+' : ''}${user.total_points}`} color={user.total_points >= 0 ? 'text-green-400' : 'text-red-400'} />
        <StatCard label="מנצחים נכונים" value={String(correctWinners)} color="text-blue-400" />
        <StatCard label="תוצאות מדויקות" value={String(correctScores)} color="text-purple-400" />
      </div>

      {/* Recent bets */}
      <div className="bg-[#13131f] border border-[#1e1e2e] rounded-xl overflow-hidden mb-6">
        <div className="px-4 py-3 border-b border-[#1e1e2e]">
          <h2 className="font-semibold text-white">הימורים אחרונים</h2>
        </div>
        {fetching ? (
          <div className="text-center text-gray-500 py-6 text-sm">טוען...</div>
        ) : bets.length === 0 ? (
          <div className="text-center text-gray-500 py-6 text-sm">עדיין אין הימורים</div>
        ) : (
          <div className="divide-y divide-[#1e1e2e]">
            {bets.map(b => (
              <div key={b.id} className="px-4 py-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-white">
                    {b.match.home_flag} {b.match.home_team} נגד {b.match.away_team} {b.match.away_flag}
                  </span>
                  {b.resolved && (
                    <span className={`text-sm font-bold ${(b.points_earned || 0) > 0 ? 'text-green-400' : (b.points_earned || 0) < 0 ? 'text-red-400' : 'text-gray-400'}`}>
                      {(b.points_earned || 0) > 0 ? '+' : ''}{b.points_earned}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  {b.bet_winner && (
                    <span className="bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded">
                      {b.bet_winner === 'home' ? 'בית' : b.bet_winner === 'away' ? 'חוץ' : 'תיקו'}
                    </span>
                  )}
                  {b.bet_home_score !== null && (
                    <span className="bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded">
                      {b.bet_home_score}:{b.bet_away_score}
                    </span>
                  )}
                  <span className="mr-auto">{formatMatchDate(b.match.match_date)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <button
        onClick={() => { logout(); router.push('/') }}
        className="w-full text-red-400 hover:text-red-300 border border-red-400/20 hover:border-red-400/40 py-4 rounded-xl transition font-semibold text-base"
      >
        התנתק
      </button>
    </div>
  )
}

function StatCard({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="bg-[#13131f] border border-[#1e1e2e] rounded-xl p-3 text-center">
      <div className={`text-xl font-bold ${color}`}>{value}</div>
      <div className="text-xs text-gray-500 mt-0.5">{label}</div>
    </div>
  )
}
