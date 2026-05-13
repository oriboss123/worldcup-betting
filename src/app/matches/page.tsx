'use client'
export const dynamic = 'force-dynamic'

import { useEffect, useState, useCallback } from 'react'
import { useUser } from '@/contexts/UserContext'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Match, Bet } from '@/lib/types'
import { STAGE_LABELS } from '@/lib/wc2026-matches'
import MatchCard from '@/components/MatchCard'
import WelcomeModal from '@/components/WelcomeModal'
import { Search } from 'lucide-react'

function ScoringGuide() {
  const [open, setOpen] = useState(false)
  return (
    <div className="rounded-2xl mb-6 border border-[#1a1a30] overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #0a0a1a 0%, #070712 100%)' }}>
      <button onClick={() => setOpen(o => !o)}
        className="w-full px-4 py-3 flex items-center justify-between text-xs font-semibold text-gray-400 hover:text-gray-200 transition">
        <span>📊 מבנה הניקוד</span>
        <span className="text-gray-600">{open ? '▲' : '▼'} לחץ לפרטים</span>
      </button>
      {open && (
        <div className="grid grid-cols-2 border-t border-[#1a1a30]" style={{ borderRight: '1px solid #1a1a30' }}>
          <div className="p-3 space-y-2">
            <p className="text-xs text-green-400/70 font-semibold mb-2">✅ נכון</p>
            <div className="flex justify-between"><span className="text-xs text-gray-400">מנצח</span><span className="text-green-400 font-bold">+3</span></div>
            <div className="flex justify-between"><span className="text-xs text-gray-400">תוצאה מדויקת</span><span className="text-green-400 font-bold">+6</span></div>
          </div>
          <div className="p-3 space-y-2" style={{ borderRight: '1px solid #1a1a30' }}>
            <p className="text-xs text-red-400/70 font-semibold mb-2">❌ טעות</p>
            <div className="flex justify-between"><span className="text-xs text-gray-400">מנצח</span><span className="text-red-400 font-bold">-1</span></div>
            <div className="flex justify-between"><span className="text-xs text-gray-400">תוצאה מדויקת</span><span className="text-red-400 font-bold">-3</span></div>
          </div>
        </div>
      )}
    </div>
  )
}

const STAGES = ['group', 'round_of_32', 'round_of_16', 'quarter', 'semi', 'third_place', 'final']
const STATUS_FILTER = ['הכל', 'עתיד', 'הסתיים']
const WC_START = new Date('2026-06-11T00:00:00')

function useCountdown() {
  const [diff, setDiff] = useState(WC_START.getTime() - Date.now())
  useEffect(() => {
    const t = setInterval(() => setDiff(WC_START.getTime() - Date.now()), 1000)
    return () => clearInterval(t)
  }, [])
  const total = Math.max(0, diff)
  const days = Math.floor(total / 86400000)
  const hours = Math.floor((total % 86400000) / 3600000)
  const mins = Math.floor((total % 3600000) / 60000)
  const secs = Math.floor((total % 60000) / 1000)
  return { days, hours, mins, secs, started: diff <= 0 }
}

export default function MatchesPage() {
  const { user, loading } = useUser()
  const router = useRouter()
  const supabase = createClient()
  const { days, hours, mins, secs, started } = useCountdown()

  const [matches, setMatches] = useState<Match[]>([])
  const [bets, setBets] = useState<Record<string, Bet>>({})
  const [stage, setStage] = useState<string>('group')
  const [statusFilter, setStatusFilter] = useState<string>('הכל')
  const [search, setSearch] = useState('')
  const [fetching, setFetching] = useState(true)

  useEffect(() => {
    if (!loading && !user) router.push('/register')
  }, [user, loading, router])

  const fetchData = useCallback(async () => {
    if (!user) return
    setFetching(true)
    const [{ data: matchData }, { data: betData }] = await Promise.all([
      supabase.from('matches').select('*').order('match_number'),
      supabase.from('bets').select('*').eq('user_id', user.id),
    ])
    if (matchData) setMatches(matchData)
    if (betData) {
      const map: Record<string, Bet> = {}
      betData.forEach((b: Bet) => { map[b.match_id] = b })
      setBets(map)
    }
    setFetching(false)
  }, [user])

  useEffect(() => { fetchData() }, [fetchData])

  const handleBet = async (matchId: string, winner: string | null, homeScore: number | null, awayScore: number | null) => {
    if (!user) return
    const existing = bets[matchId]
    if (existing) {
      await supabase.from('bets').update({
        bet_winner: winner, bet_home_score: homeScore, bet_away_score: awayScore,
        updated_at: new Date().toISOString(),
      }).eq('id', existing.id)
    } else {
      await supabase.from('bets').insert({ user_id: user.id, match_id: matchId, bet_winner: winner, bet_home_score: homeScore, bet_away_score: awayScore })
    }
    await fetchData()
  }

  const filtered = matches.filter(m => {
    if (m.stage !== stage) return false
    if (statusFilter === 'עתיד' && m.status !== 'upcoming') return false
    if (statusFilter === 'הסתיים' && m.status !== 'finished') return false
    if (search && !m.home_team.includes(search) && !m.away_team.includes(search)) return false
    return true
  })

  const grouped = filtered.reduce<Record<string, Match[]>>((acc, m) => {
    const key = m.group_name || 'general'
    if (!acc[key]) acc[key] = []
    acc[key].push(m)
    return acc
  }, {})

  if (loading || !user) return null

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <WelcomeModal />

      {/* Countdown / Tournament started banner */}
      {!started ? (
        <div className="rounded-2xl mb-6 overflow-hidden border border-green-500/30"
          style={{ background: 'linear-gradient(135deg, #052010 0%, #0a1a1a 100%)' }}>
          <div className="px-5 py-4">
            <p className="text-green-400 text-xs font-semibold mb-3 text-center tracking-wider">⚽ מונדיאל 2026 פותח בעוד</p>
            <div className="grid grid-cols-4 gap-2">
              {[{ v: days, l: 'ימים' }, { v: hours, l: 'שעות' }, { v: mins, l: 'דקות' }, { v: secs, l: 'שניות' }].map(({ v, l }) => (
                <div key={l} className="bg-black/40 rounded-xl py-3 text-center border border-green-500/10">
                  <div className="text-2xl font-black text-white tabular-nums">{String(v).padStart(2, '0')}</div>
                  <div className="text-xs text-green-400/70 mt-0.5">{l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-green-500/10 border border-green-500/30 rounded-2xl px-5 py-3 mb-6 text-center text-green-300 font-semibold">
          🏆 המונדיאל החל! הימר לפני כל משחק
        </div>
      )}

      {/* Scoring guide — collapsible */}
      <ScoringGuide />

      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-white">משחקים</h1>
        <div className="relative">
          <Search className="absolute top-2.5 right-3 text-gray-500" size={15} />
          <input
            type="text"
            placeholder="חפש קבוצה..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="bg-[#0d0d1f] border border-[#1e1e3a] rounded-lg pr-9 pl-3 py-2 text-sm text-white placeholder-gray-600 outline-none focus:border-green-500 w-40"
          />
        </div>
      </div>

      {/* Stage tabs */}
      <div className="flex gap-1.5 overflow-x-auto pb-2 mb-4">
        {STAGES.map(s => (
          <button
            key={s}
            onClick={() => setStage(s)}
            className={`whitespace-nowrap px-3 py-1.5 rounded-lg text-sm transition font-medium ${
              stage === s
                ? 'bg-gradient-to-l from-green-500 to-emerald-400 text-white shadow shadow-green-500/25'
                : 'bg-[#0d0d1f] border border-[#1e1e3a] text-gray-400 hover:text-white hover:border-[#2e2e5a]'
            }`}
          >
            {STAGE_LABELS[s]}
          </button>
        ))}
      </div>

      {/* Status filter */}
      <div className="flex gap-2 mb-6">
        {STATUS_FILTER.map(f => (
          <button
            key={f}
            onClick={() => setStatusFilter(f)}
            className={`px-3 py-1 rounded-full text-xs transition ${
              statusFilter === f ? 'bg-[#1e1e3a] text-white border border-[#3e3e6a]' : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {fetching ? (
        <div className="text-center text-gray-500 py-12">
          <div className="text-4xl mb-3 animate-pulse">⚽</div>
          טוען משחקים...
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center text-gray-500 py-12">
          <div className="text-4xl mb-3">🔍</div>
          אין משחקים להצגה
        </div>
      ) : stage === 'group' ? (
        Object.entries(grouped).sort().map(([groupLetter, groupMatches]) => (
          <div key={groupLetter} className="mb-8">
            <h2 className="text-base font-bold text-gray-300 mb-3 flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold text-green-400"
                style={{ background: 'linear-gradient(135deg, #052010, #0a1f0a)' }}>
                {groupLetter}
              </span>
              בית {groupLetter}
            </h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {groupMatches.map(m => (
                <MatchCard key={m.id} match={m} bet={bets[m.id]} onBet={handleBet} currentUserId={user.id} />
              ))}
            </div>
          </div>
        ))
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {filtered.map(m => (
            <MatchCard key={m.id} match={m} bet={bets[m.id]} onBet={handleBet} currentUserId={user.id} />
          ))}
        </div>
      )}
    </div>
  )
}
