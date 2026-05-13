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

type BetMode = 'winner' | 'score' | null

function getInitialMode(bet?: Bet): BetMode {
  if (!bet) return null
  if (bet.bet_home_score !== null) return 'score'
  if (bet.bet_winner) return 'winner'
  return null
}

export default function MatchCard({ match, bet, onBet }: Props) {
  const [mode, setMode] = useState<BetMode>(getInitialMode(bet))
  const [betWinner, setBetWinner] = useState<string>(bet?.bet_winner || '')
  const [homeScore, setHomeScore] = useState<string>(bet?.bet_home_score?.toString() ?? '')
  const [awayScore, setAwayScore] = useState<string>(bet?.bet_away_score?.toString() ?? '')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [showBet, setShowBet] = useState(false)

  const bettable = canBet(match.match_date) && match.status === 'upcoming'
  const hasBet = !!bet

  const switchMode = (m: BetMode) => {
    setMode(m)
    // Clear the other mode's data
    if (m === 'winner') { setHomeScore(''); setAwayScore('') }
    if (m === 'score') { setBetWinner('') }
  }

  const handleSave = async () => {
    if (!bettable) return
    setSaving(true)
    if (mode === 'winner') {
      await onBet(match.id, betWinner || null, null, null)
    } else if (mode === 'score') {
      const hs = homeScore !== '' ? parseInt(homeScore) : null
      const as = awayScore !== '' ? parseInt(awayScore) : null
      // derive winner from score
      const winner = hs !== null && as !== null
        ? hs > as ? 'home' : as > hs ? 'away' : 'draw'
        : null
      await onBet(match.id, winner, hs, as)
    }
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

  const canSave = mode === 'winner' ? !!betWinner : (homeScore !== '' && awayScore !== '')

  return (
    <div className="rounded-2xl p-4 border transition hover:brightness-110" style={cardStyle}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4 text-xs">
        <span className="text-gray-600">
          {STAGE_LABELS[match.stage]}{match.group_name ? ` · בית ${match.group_name}` : ''}
        </span>
        {isLive && (
          <span className="flex items-center gap-1 bg-red-500/20 text-red-400 px-2 py-0.5 rounded-full font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 inline-block animate-pulse" />LIVE
          </span>
        )}
        {isFinished && <span className="text-gray-600 font-medium">הסתיים</span>}
        {!isLive && !isFinished && <span className="text-green-400/60 font-medium text-xs">עתיד</span>}
      </div>

      {/* Teams */}
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

      <div className="h-px mb-3" style={{ background: 'linear-gradient(to left, transparent, #1e1e3a, transparent)' }} />

      {/* Bet area */}
      {isFinished && bet ? (
        <BetResult bet={bet} match={match} />
      ) : isFinished ? (
        <p className="text-center text-xs text-gray-700">לא הימרת על משחק זה</p>
      ) : !bettable ? (
        <div className="flex items-center justify-center gap-1.5 text-xs text-yellow-500/70">
          <Lock size={11} />ההימורים נסגרו (30 דקות לפני)
        </div>
      ) : hasBet && !showBet ? (
        <div className="text-center">
          <BetSummary bet={bet} />
          <button onClick={() => setShowBet(true)} className="text-xs text-blue-400/70 hover:text-blue-400 mt-2 transition">
            ✏️ ערוך הימור
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {/* Mode selector */}
          <div className="grid grid-cols-2 gap-2">
            <ModeBtn active={mode === 'winner'} onClick={() => switchMode('winner')}
              label="ניחוש מנצח" sub="+3 / -1" color="#15803d" />
            <ModeBtn active={mode === 'score'} onClick={() => switchMode('score')}
              label="תוצאה מדויקת" sub="+6 / -3" color="#7c3aed" />
          </div>

          {/* Winner picker */}
          {mode === 'winner' && (
            <div className="flex gap-2">
              {[{ val: 'home', label: match.home_team }, { val: 'draw', label: 'תיקו' }, { val: 'away', label: match.away_team }].map(opt => (
                <button key={opt.val} onClick={() => setBetWinner(betWinner === opt.val ? '' : opt.val)}
                  className="flex-1 py-3 px-2 rounded-xl text-sm font-semibold transition"
                  style={betWinner === opt.val
                    ? { background: 'linear-gradient(135deg, #15803d, #22c55e)', color: '#fff', boxShadow: '0 2px 10px rgba(34,197,94,0.3)' }
                    : { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: '#9ca3af' }}>
                  {opt.label}
                </button>
              ))}
            </div>
          )}

          {/* Score picker */}
          {mode === 'score' && (
            <div className="flex items-center gap-3">
              <input type="number" min={0} max={20} value={homeScore} onChange={e => setHomeScore(e.target.value)}
                placeholder="0"
                className="w-full text-center rounded-xl py-3 text-2xl outline-none text-white font-black placeholder-gray-700"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }} />
              <span className="text-gray-500 font-black text-2xl flex-shrink-0">:</span>
              <input type="number" min={0} max={20} value={awayScore} onChange={e => setAwayScore(e.target.value)}
                placeholder="0"
                className="w-full text-center rounded-xl py-3 text-2xl outline-none text-white font-black placeholder-gray-700"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }} />
            </div>
          )}

          {/* Save */}
          {mode && (
            <div className="flex gap-2">
              <button onClick={handleSave} disabled={saving || saved || !canSave}
                className="flex-1 text-white font-bold py-3.5 rounded-xl transition disabled:opacity-40 text-base"
                style={{ background: saved ? 'rgba(34,197,94,0.3)' : 'linear-gradient(135deg, #15803d, #22c55e)', boxShadow: '0 2px 15px rgba(34,197,94,0.2)' }}>
                {saved ? '✓ נשמר!' : saving ? '...' : 'שמור הימור'}
              </button>
              {hasBet && (
                <button onClick={() => { setShowBet(false); setMode(getInitialMode(bet)) }}
                  className="px-5 text-gray-500 hover:text-gray-300 rounded-xl text-sm transition"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  ביטול
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function ModeBtn({ active, onClick, label, sub, color }: { active: boolean; onClick: () => void; label: string; sub: string; color: string }) {
  return (
    <button onClick={onClick}
      className="rounded-xl py-3.5 px-2 text-center transition"
      style={active
        ? { background: `${color}40`, border: `1px solid ${color}99`, color: '#fff' }
        : { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', color: '#6b7280' }}>
      <div className="text-sm font-bold">{label}</div>
      <div className="text-xs mt-0.5 opacity-60">{sub}</div>
    </button>
  )
}

function BetSummary({ bet }: { bet: Bet }) {
  const winnerLabel = bet.bet_winner === 'home' ? 'ניצחון בית' : bet.bet_winner === 'away' ? 'ניצחון חוץ' : bet.bet_winner === 'draw' ? 'תיקו' : null
  return (
    <div className="flex items-center justify-center gap-2 text-xs">
      {bet.bet_home_score !== null ? (
        <span className="bg-purple-500/15 text-purple-300 border border-purple-500/20 px-3 py-1 rounded-lg font-mono text-sm font-bold">
          {bet.bet_home_score} : {bet.bet_away_score}
        </span>
      ) : winnerLabel ? (
        <span className="bg-green-500/15 text-green-300 border border-green-500/20 px-3 py-1 rounded-lg">
          {winnerLabel}
        </span>
      ) : null}
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
