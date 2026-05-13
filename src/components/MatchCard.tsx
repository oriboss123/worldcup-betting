'use client'

import { Match, Bet } from '@/lib/types'
import { canBet, formatMatchDate } from '@/lib/utils'
import { STAGE_LABELS } from '@/lib/wc2026-matches'
import { useState } from 'react'
import { Clock, MapPin, Lock } from 'lucide-react'

interface Props {
  match: Match
  bet?: Bet
  onBet: (matchId: string, winner: string | null, homeScore: number | null, awayScore: number | null) => Promise<void>
  currentUserId: string
}

export default function MatchCard({ match, bet, onBet, currentUserId }: Props) {
  const [betWinner, setBetWinner] = useState<string>(bet?.bet_winner || '')
  const [homeScore, setHomeScore] = useState<string>(bet?.bet_home_score?.toString() ?? '')
  const [awayScore, setAwayScore] = useState<string>(bet?.bet_away_score?.toString() ?? '')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [showBet, setShowBet] = useState(false)

  const bettable = canBet(match.match_date) && match.status === 'upcoming'
  const hasBet = !!bet

  const handleSave = async () => {
    if (!bettable) return
    setSaving(true)
    const winner = betWinner || null
    const hs = homeScore !== '' ? parseInt(homeScore) : null
    const as = awayScore !== '' ? parseInt(awayScore) : null
    await onBet(match.id, winner, hs, as)
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
    setShowBet(false)
  }

  const statusColor = match.status === 'live'
    ? 'text-red-400'
    : match.status === 'finished'
    ? 'text-gray-500'
    : 'text-green-400'

  const statusLabel = match.status === 'live' ? '🔴 LIVE' : match.status === 'finished' ? 'הסתיים' : 'עתיד'

  const borderColor = match.status === 'live'
    ? 'border-red-500/40'
    : match.status === 'finished'
    ? 'border-[#1e1e3a]'
    : hasBet
    ? 'border-green-500/30'
    : 'border-[#1e1e3a]'

  return (
    <div className={`rounded-xl p-4 transition hover:border-[#3e3e6a] border ${borderColor}`}
      style={{ background: 'linear-gradient(160deg, #0d0d22 0%, #080814 100%)' }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-3 text-xs text-gray-500">
        <span>{STAGE_LABELS[match.stage] || match.stage}{match.group_name ? ` - בית ${match.group_name}` : ''}</span>
        <span className={`font-semibold ${statusColor}`}>{statusLabel}</span>
      </div>

      {/* Teams */}
      <div className="flex items-center justify-between gap-2">
        {/* Home */}
        <div className="flex-1 text-center">
          <div className="text-2xl mb-1">{match.home_flag}</div>
          <div className="text-sm font-medium leading-tight">{match.home_team}</div>
        </div>

        {/* Score / VS */}
        <div className="text-center px-3">
          {match.status !== 'upcoming' && match.home_score !== null ? (
            <div className="text-2xl font-bold text-white">
              {match.home_score} : {match.away_score}
            </div>
          ) : (
            <div className="text-lg text-gray-500 font-bold">נגד</div>
          )}
        </div>

        {/* Away */}
        <div className="flex-1 text-center">
          <div className="text-2xl mb-1">{match.away_flag}</div>
          <div className="text-sm font-medium leading-tight">{match.away_team}</div>
        </div>
      </div>

      {/* Date & venue */}
      <div className="flex items-center justify-center gap-3 mt-3 text-xs text-gray-500">
        <span className="flex items-center gap-1"><Clock size={11} />{formatMatchDate(match.match_date)}</span>
        {match.venue && <span className="flex items-center gap-1"><MapPin size={11} />{match.venue}</span>}
      </div>

      {/* Bet status / action */}
      <div className="mt-3 border-t border-[#1e1e2e] pt-3">
        {match.status === 'finished' && bet ? (
          <BetResult bet={bet} match={match} />
        ) : match.status === 'finished' ? (
          <p className="text-center text-xs text-gray-600">לא הימרת על משחק זה</p>
        ) : !bettable ? (
          <div className="flex items-center justify-center gap-1 text-xs text-yellow-500">
            <Lock size={12} />
            ההימורים נסגרו (30 דקות לפני המשחק)
          </div>
        ) : hasBet && !showBet ? (
          <div className="text-center">
            <BetSummary bet={bet} />
            <button onClick={() => setShowBet(true)} className="text-xs text-blue-400 hover:text-blue-300 mt-1 transition">
              ערוך הימור
            </button>
          </div>
        ) : showBet || !hasBet ? (
          <BetForm
            betWinner={betWinner}
            setBetWinner={setBetWinner}
            homeScore={homeScore}
            setHomeScore={setHomeScore}
            awayScore={awayScore}
            setAwayScore={setAwayScore}
            homeTeam={match.home_team}
            awayTeam={match.away_team}
            onSave={handleSave}
            onCancel={hasBet ? () => setShowBet(false) : undefined}
            saving={saving}
            saved={saved}
          />
        ) : null}
      </div>
    </div>
  )
}

function BetSummary({ bet }: { bet: Bet }) {
  const winnerLabel = bet.bet_winner === 'home' ? 'ניצחון בית' : bet.bet_winner === 'away' ? 'ניצחון חוץ' : bet.bet_winner === 'draw' ? 'תיקו' : null
  return (
    <div className="text-xs text-gray-400 text-center">
      {winnerLabel && <span className="bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded mr-1">{winnerLabel}</span>}
      {bet.bet_home_score !== null && <span className="bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded">
        {bet.bet_home_score}:{bet.bet_away_score}
      </span>}
    </div>
  )
}

function BetResult({ bet, match }: { bet: Bet; match: Match }) {
  const points = bet.points_earned
  const positive = points !== null && points > 0
  const negative = points !== null && points < 0
  return (
    <div className="flex items-center justify-between text-xs">
      <BetSummary bet={bet} />
      <span className={`font-bold ${positive ? 'text-green-400' : negative ? 'text-red-400' : 'text-gray-400'}`}>
        {points !== null ? (positive ? `+${points}` : `${points}`) : '—'} נקודות
      </span>
    </div>
  )
}

function BetForm({
  betWinner, setBetWinner,
  homeScore, setHomeScore,
  awayScore, setAwayScore,
  homeTeam, awayTeam,
  onSave, onCancel, saving, saved
}: {
  betWinner: string; setBetWinner: (v: string) => void
  homeScore: string; setHomeScore: (v: string) => void
  awayScore: string; setAwayScore: (v: string) => void
  homeTeam: string; awayTeam: string
  onSave: () => void; onCancel?: () => void
  saving: boolean; saved: boolean
}) {
  return (
    <div className="space-y-3">
      {/* Winner bet */}
      <div>
        <p className="text-xs text-gray-500 mb-1.5">מי ינצח? (+3/-1)</p>
        <div className="flex gap-1">
          {[
            { val: 'home', label: homeTeam },
            { val: 'draw', label: 'תיקו' },
            { val: 'away', label: awayTeam },
          ].map(opt => (
            <button
              key={opt.val}
              onClick={() => setBetWinner(betWinner === opt.val ? '' : opt.val)}
              className={`flex-1 py-1.5 px-1 rounded text-xs transition ${
                betWinner === opt.val
                  ? 'bg-green-500 text-white'
                  : 'bg-[#1e1e2e] text-gray-400 hover:bg-[#2a2a3e]'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Score bet */}
      <div>
        <p className="text-xs text-gray-500 mb-1.5">תוצאה מדויקת? (+6/-3)</p>
        <div className="flex items-center gap-2">
          <input
            type="number" min={0} max={20}
            value={homeScore}
            onChange={e => setHomeScore(e.target.value)}
            placeholder="בית"
            className="w-full bg-[#1e1e2e] text-white text-center rounded py-1.5 text-sm outline-none border border-[#2a2a3e] focus:border-green-500"
          />
          <span className="text-gray-500 font-bold">:</span>
          <input
            type="number" min={0} max={20}
            value={awayScore}
            onChange={e => setAwayScore(e.target.value)}
            placeholder="חוץ"
            className="w-full bg-[#1e1e2e] text-white text-center rounded py-1.5 text-sm outline-none border border-[#2a2a3e] focus:border-green-500"
          />
        </div>
      </div>

      <div className="flex gap-2">
        <button
          onClick={onSave}
          disabled={saving || saved || (!betWinner && homeScore === '' && awayScore === '')}
          className="flex-1 bg-green-500 hover:bg-green-600 disabled:opacity-50 text-white text-sm py-2 rounded-lg transition font-medium"
        >
          {saved ? '✓ נשמר' : saving ? 'שומר...' : 'שמור הימור'}
        </button>
        {onCancel && (
          <button onClick={onCancel} className="px-3 bg-[#1e1e2e] text-gray-400 rounded-lg text-sm hover:bg-[#2a2a3e] transition">
            ביטול
          </button>
        )}
      </div>
    </div>
  )
}
