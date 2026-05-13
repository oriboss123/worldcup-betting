import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateInviteCode(): string {
  return Math.random().toString(36).substring(2, 8).toUpperCase()
}

export function formatMatchDate(dateStr: string): string {
  const date = new Date(dateStr)
  return new Intl.DateTimeFormat('he-IL', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}

export function canBet(matchDate: string): boolean {
  const match = new Date(matchDate)
  const now = new Date()
  const diffMs = match.getTime() - now.getTime()
  return diffMs > 30 * 60 * 1000
}

export function calculatePoints(
  bet: { bet_winner?: string | null; bet_home_score?: number | null; bet_away_score?: number | null },
  match: { home_score: number; away_score: number; home_team: string; away_team: string }
): number {
  let points = 0

  const actualWinner =
    match.home_score > match.away_score
      ? 'home'
      : match.away_score > match.home_score
      ? 'away'
      : 'draw'

  if (bet.bet_winner) {
    if (bet.bet_winner === actualWinner) {
      points += 3
    } else {
      points -= 1
    }
  }

  if (bet.bet_home_score !== null && bet.bet_home_score !== undefined &&
      bet.bet_away_score !== null && bet.bet_away_score !== undefined) {
    if (bet.bet_home_score === match.home_score && bet.bet_away_score === match.away_score) {
      points += 6
    } else {
      points -= 3
    }
  }

  return points
}
