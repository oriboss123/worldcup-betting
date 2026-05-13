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
import { Search, Info } from 'lucide-react'

const STAGES = ['group', 'round_of_32', 'round_of_16', 'quarter', 'semi', 'third_place', 'final']
const STATUS_FILTER = ['הכל', 'עתיד', 'הסתיים']

export default function MatchesPage() {
  const { user, loading } = useUser()
  const router = useRouter()
  const supabase = createClient()

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

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const handleBet = async (matchId: string, winner: string | null, homeScore: number | null, awayScore: number | null) => {
    if (!user) return
    const existing = bets[matchId]
    if (existing) {
      await supabase.from('bets').update({
        bet_winner: winner,
        bet_home_score: homeScore,
        bet_away_score: awayScore,
        updated_at: new Date().toISOString(),
      }).eq('id', existing.id)
    } else {
      await supabase.from('bets').insert({
        user_id: user.id,
        match_id: matchId,
        bet_winner: winner,
        bet_home_score: homeScore,
        bet_away_score: awayScore,
      })
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

  // Group by group letter for group stage
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

      {/* Info banner */}
      <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl px-4 py-3 mb-5 flex items-start gap-3 text-sm text-blue-300">
        <Info size={16} className="mt-0.5 flex-shrink-0" />
        <span>
          הימר לפני כל משחק — <strong>מנצח נכון = +3</strong>, <strong>תוצאה מדויקת = +6</strong>. ניתן להמר עד 30 דקות לפני הקיקאוף.
        </span>
      </div>

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">משחקים</h1>
        <div className="relative">
          <Search className="absolute top-2.5 right-3 text-gray-500" size={15} />
          <input
            type="text"
            placeholder="חפש קבוצה..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="bg-[#13131f] border border-[#2a2a3e] rounded-lg pr-9 pl-3 py-2 text-sm text-white placeholder-gray-600 outline-none focus:border-green-500 w-40"
          />
        </div>
      </div>

      {/* Stage tabs */}
      <div className="flex gap-1 overflow-x-auto pb-2 mb-4">
        {STAGES.map(s => (
          <button
            key={s}
            onClick={() => setStage(s)}
            className={`whitespace-nowrap px-3 py-1.5 rounded-lg text-sm transition ${
              stage === s ? 'bg-green-500 text-white' : 'bg-[#13131f] text-gray-400 hover:text-white'
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
              statusFilter === f ? 'bg-[#2a2a3e] text-white' : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {fetching ? (
        <div className="text-center text-gray-500 py-12">טוען משחקים...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center text-gray-500 py-12">
          <div className="text-4xl mb-3">🔍</div>
          אין משחקים להצגה
        </div>
      ) : stage === 'group' ? (
        Object.entries(grouped).sort().map(([groupLetter, groupMatches]) => (
          <div key={groupLetter} className="mb-8">
            <h2 className="text-lg font-bold text-gray-300 mb-3 flex items-center gap-2">
              <span className="w-8 h-8 bg-[#1e1e2e] rounded-lg flex items-center justify-center text-sm">{groupLetter}</span>
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
