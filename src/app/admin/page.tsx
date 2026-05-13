'use client'
export const dynamic = 'force-dynamic'

import { useEffect, useState } from 'react'
import { useUser } from '@/contexts/UserContext'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Match } from '@/lib/types'
import { STAGE_LABELS } from '@/lib/wc2026-matches'
import { formatMatchDate } from '@/lib/utils'

const ADMIN_PHONE = '0500000000' // Change to your phone

export default function AdminPage() {
  const { user, loading } = useUser()
  const router = useRouter()
  const supabase = createClient()

  const [matches, setMatches] = useState<Match[]>([])
  const [updating, setUpdating] = useState<string | null>(null)
  const [scores, setScores] = useState<Record<string, { home: string; away: string; status: string }>>({})
  const [tab, setTab] = useState<'upcoming' | 'finished'>('upcoming')

  useEffect(() => {
    if (!loading && !user) { router.push('/register'); return }
    if (!loading && user && user.phone !== ADMIN_PHONE) {
      router.push('/matches')
    }
  }, [user, loading])

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase.from('matches').select('*').order('match_number')
      if (data) {
        setMatches(data)
        const initial: Record<string, { home: string; away: string; status: string }> = {}
        data.forEach((m: Match) => {
          initial[m.id] = {
            home: m.home_score?.toString() ?? '',
            away: m.away_score?.toString() ?? '',
            status: m.status,
          }
        })
        setScores(initial)
      }
    }
    fetch()
  }, [])

  const handleUpdate = async (matchId: string) => {
    const s = scores[matchId]
    if (!s) return
    setUpdating(matchId)

    if (s.status === 'finished' && s.home !== '' && s.away !== '') {
      // Update match and resolve bets via RPC
      await supabase.from('matches').update({
        home_score: parseInt(s.home),
        away_score: parseInt(s.away),
        status: 'finished',
      }).eq('id', matchId)

      await supabase.rpc('resolve_match_bets', { p_match_id: matchId })
    } else {
      await supabase.from('matches').update({ status: s.status }).eq('id', matchId)
    }

    // Refresh
    const { data } = await supabase.from('matches').select('*').order('match_number')
    if (data) setMatches(data)
    setUpdating(null)
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

  const filtered = matches.filter(m =>
    tab === 'upcoming' ? m.status !== 'finished' : m.status === 'finished'
  )

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">🔧 ניהול משחקים</h1>
        {matches.length === 0 && (
          <button
            onClick={handleSeedMatches}
            className="bg-green-500 hover:bg-green-600 text-white text-sm px-4 py-2 rounded-lg transition"
          >
            טען משחקי מונדיאל 2026
          </button>
        )}
      </div>

      <div className="flex gap-2 mb-4">
        <button onClick={() => setTab('upcoming')} className={`px-4 py-1.5 rounded-lg text-sm transition ${tab === 'upcoming' ? 'bg-green-500 text-white' : 'bg-[#13131f] text-gray-400'}`}>
          עתידיים ({matches.filter(m => m.status !== 'finished').length})
        </button>
        <button onClick={() => setTab('finished')} className={`px-4 py-1.5 rounded-lg text-sm transition ${tab === 'finished' ? 'bg-green-500 text-white' : 'bg-[#13131f] text-gray-400'}`}>
          הסתיימו ({matches.filter(m => m.status === 'finished').length})
        </button>
      </div>

      <div className="space-y-2">
        {filtered.map(m => {
          const s = scores[m.id]
          if (!s) return null
          return (
            <div key={m.id} className="bg-[#13131f] border border-[#1e1e2e] rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="text-sm text-white font-medium">
                  {m.home_flag} {m.home_team} נגד {m.away_team} {m.away_flag}
                </div>
                <span className="text-xs text-gray-500">{formatMatchDate(m.match_date)}</span>
              </div>

              <div className="flex items-center gap-3">
                <select
                  value={s.status}
                  onChange={e => setScores(prev => ({ ...prev, [m.id]: { ...prev[m.id], status: e.target.value } }))}
                  className="bg-[#0a0a0f] border border-[#2a2a3e] rounded-lg px-2 py-1.5 text-white text-sm outline-none"
                >
                  <option value="upcoming">עתיד</option>
                  <option value="live">LIVE</option>
                  <option value="finished">הסתיים</option>
                </select>

                {s.status === 'finished' && (
                  <>
                    <input
                      type="number" min={0} max={20}
                      value={s.home}
                      onChange={e => setScores(prev => ({ ...prev, [m.id]: { ...prev[m.id], home: e.target.value } }))}
                      placeholder="בית"
                      className="w-16 bg-[#0a0a0f] border border-[#2a2a3e] rounded-lg px-2 py-1.5 text-white text-center text-sm outline-none focus:border-green-500"
                    />
                    <span className="text-gray-500">:</span>
                    <input
                      type="number" min={0} max={20}
                      value={s.away}
                      onChange={e => setScores(prev => ({ ...prev, [m.id]: { ...prev[m.id], away: e.target.value } }))}
                      placeholder="חוץ"
                      className="w-16 bg-[#0a0a0f] border border-[#2a2a3e] rounded-lg px-2 py-1.5 text-white text-center text-sm outline-none focus:border-green-500"
                    />
                  </>
                )}

                <button
                  onClick={() => handleUpdate(m.id)}
                  disabled={updating === m.id}
                  className="mr-auto bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white text-sm px-3 py-1.5 rounded-lg transition"
                >
                  {updating === m.id ? '...' : 'עדכן'}
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
