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
    await onBet(match.id, betWinner || null, homeScore !== '' ? parseInt(homeScore) : null, awayScore !== '' ? parseInt(awayScore) : null)
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
    setShowBet(false)
  }

  const isLive = match.status === 'live'
  const isFinished = match.status === 'finished'

  const cardStyle = isLive
    ? { background: 'linear-gradient(160deg, #1a0808 0%, #0d0408 100%)', borderColor: 'rgba(239,68,68,0.35)' }
    : hasBet
    ? { background: 'linear-gradient(160deg, #071a0f 0%, #04100a 100%)', borderColor: 'rgba(34,197,94,0.25)' }
    : { background: 'linear-gradient(160deg, #0d0d22 0%, #070712 100%)', borderColor: '#1a1a30' }

  return (
    <div className="rounded-2xl p-4 border transition hover:brightness-110" style={cardStyle}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4 text-xs">
        <span className="text-gray-500">
          {STAGE_LABELS[match.stage]}{match.group_name ? ` · בית ${match.group_name}` : ''}
        </span>
        {isLive && (
          <span className="flex items-center gap-1 bg-red-500/20 text-red-400 px-2 py-0.5 rounded-full font-bold animate-pulse">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 inline-block" />
            LIVE
          </span>
        )}
        {isFinished && <span className="text-gray-600 font-medium">הסתיים</span>}
        {!isLive && !isFinished && <span className="text-green-400/70 font-medium">עתיד</span>}
      </div>

      {/* Teams + Score */}
      <div className="flex items-center justify-between gap-3 mb-4">
        <div className="flex-1 text-center">
          <div className="text-3xl mb-1.5">{match.home_flag}</div>
          <div className="text-sm font-semibold text-white leading-tight">{match.home_team}</div>
        </div>

        <div className="text-center px-2 flex-shrink-0">
          {match.status !== 'upcoming' && match.home_score !== null ? (
            <div className="text-3xl font-black text-white tabular-nums">
              {match.home_score}<span className="text-gray-600 mx-1">:</span>{match.away_score}
            </div>
          ) : (
            <div className="text-gray-600 font-bold text-lg">vs</div>
          )}
        </div>

        <div className="flex-1 text-center">
          <div className="text-3xl mb-1.5">{match.away_flag}</div>
          <div className="text-sm font-semibold text-white leading-tight">{match.away_team}</div>
        </div>
      </div>

      {/* Date & venue */}
      <div className="flex items-center justify-center gap-3 text-xs text-gray-600 mb-4">
        <span className="flex items-center gap-1"><Clock size={10} />{formatMatchDate(match.match_date)}</span>
        {match.venue && <span className="flex items-center gap-1"><MapPin size={10} />{match.venue}</span>}
      </div>

      {/* Divider */}
      <div className="h-px bg-gradient-to-l from-transparent via-[#1e1e3a] to-transparent mb-3" />

      {/* Bet area */}
      {isFinished && bet ? (
        <BetResult bet={bet} match={match} />
      ) : isFinished ? (
        <p className="text-center text-xs text-gray-700">לא הימרת על משחק זה</p>
      ) : !bettable ? (
        <div className="flex items-center justify-center gap-1.5 text-xs text-yellow-500/80">
          <Lock size={11} />
          ההימורים נסגרו (30 דקות לפני)
        </div>
      ) : hasBet && !showBet ? (
        <div className="text-center">
          <BetSummary bet={bet} />
          <button onClick={() => setShowBet(true)} className="text-xs text-blue-400/70 hover:text-blue-400 mt-2 transition">
            ✏️ ערוך הימור
          </button>
        </div>
      ) : (
        <BetForm
          betWinner={betWinner} setBetWinner={setBetWinner}
          homeScore={homeScore} setHomeScore={setHomeScore}
          awayScore={awayScore} setAwayScore={setAwayScore}
          homeTeam={match.home_team} awayTeam={match.away_team}
          onSave={handleSave} onCancel={hasBet ? () => setShowBet(false) : undefined}
          saving={saving} saved={saved}
        />
      )}
    </div>
  )
}

function BetSummary({ bet }: { bet: Bet }) {
  const winnerLabel = bet.bet_winner === 'home' ? 'ניצחון בית' : bet.bet_winner === 'away' ? 'ניצחון חוץ' : bet.bet_winner === 'draw' ? 'תיקו' : null
  return (
    <div className="flex items-center justify-center gap-2 text-xs">
      {winnerLabel && <span className="bg-blue-500/15 text-blue-300 border border-blue-500/20 px-2 py-1 rounded-lg">{winnerLabel}</span>}
      {bet.bet_home_score !== null && (
        <span className="bg-purple-500/15 text-purple-300 border border-purple-500/20 px-2 py-1 rounded-lg font-mono">
          {bet.bet_home_score}:{bet.bet_away_score}
        </span>
      )}
    </div>
  )
}

function BetResult({ bet, match }: { bet: Bet; match: Match }) {
  const pts = bet.points_earned
  const positive = pts !== null && pts > 0
  return (
    <div className="flex items-center justify-between">
      <BetSummary bet={bet} />
      <span className={`font-black text-lg ${positive ? 'text-green-400' : pts !== null && pts < 0 ? 'text-red-400' : 'text-gray-500'}`}>
        {pts !== null ? (positive ? `+${pts}` : `${pts}`) : '—'}
      </span>
    </div>
  )
}

function BetForm({ betWinner, setBetWinner, homeScore, setHomeScore, awayScore, setAwayScore, homeTeam, awayTeam, onSave, onCancel, saving, saved }:
  { betWinner: string; setBetWinner: (v: string) => void; homeScore: string; setHomeScore: (v: string) => void; awayScore: string; setAwayScore: (v: string) => void; homeTeam: string; awayTeam: string; onSave: () => void; onCancel?: () => void; saving: boolean; saved: boolean }) {
  return (
    <div className="space-y-3">
      <div>
        <p className="text-xs text-gray-500 mb-2 text-center">מי ינצח? <span className="text-green-400">+3</span> / <span className="text-red-400">-1</span></p>
        <div className="flex gap-1.5">
          {[{ val: 'home', label: homeTeam }, { val: 'draw', label: 'תיקו' }, { val: 'away', label: awayTeam }].map(opt => (
            <button key={opt.val} onClick={() => setBetWinner(betWinner === opt.val ? '' : opt.val)}
              className={`flex-1 py-2 px-1 rounded-xl text-xs font-medium transition ${
                betWinner === opt.val
                  ? 'text-white shadow'
                  : 'text-gray-500 hover:text-gray-300'
              }`}
              style={betWinner === opt.val
                ? { background: 'linear-gradient(135deg, #15803d, #22c55e)', boxShadow: '0 2px 10px rgba(34,197,94,0.3)' }
                : { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="text-xs text-gray-500 mb-2 text-center">תוצאה מדויקת? <span className="text-green-400">+6</span> / <span className="text-red-400">-3</span></p>
        <div className="flex items-center gap-2">
          <input type="number" min={0} max={20} value={homeScore} onChange={e => setHomeScore(e.target.value)}
            placeholder="בית" className="w-full text-center rounded-xl py-2 text-sm outline-none text-white font-bold"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }} />
          <span className="text-gray-600 font-black text-lg">:</span>
          <input type="number" min={0} max={20} value={awayScore} onChange={e => setAwayScore(e.target.value)}
            placeholder="חוץ" className="w-full text-center rounded-xl py-2 text-sm outline-none text-white font-bold"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }} />
        </div>
      </div>

      <div className="flex gap-2">
        <button onClick={onSave} disabled={saving || saved || (!betWinner && homeScore === '' && awayScore === '')}
          className="flex-1 text-white text-sm py-2.5 rounded-xl transition font-semibold disabled:opacity-40"
          style={{ background: saved ? 'rgba(34,197,94,0.3)' : 'linear-gradient(135deg, #15803d, #22c55e)', boxShadow: '0 2px 15px rgba(34,197,94,0.2)' }}>
          {saved ? '✓ נשמר!' : saving ? '...' : 'שמור הימור'}
        </button>
        {onCancel && (
          <button onClick={onCancel} className="px-4 text-gray-500 hover:text-gray-300 rounded-xl text-sm transition"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
            ביטול
          </button>
        )}
      </div>
    </div>
  )
}
