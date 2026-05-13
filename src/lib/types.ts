export interface User {
  id: string
  name: string
  nickname: string | null
  phone: string
  total_points: number
  created_at: string
}

export interface Group {
  id: string
  name: string
  invite_code: string
  created_by: string
  created_at: string
  member_count?: number
}

export interface GroupMember {
  id: string
  group_id: string
  user_id: string
  points: number
  joined_at: string
  user?: User
}

export interface Match {
  id: string
  home_team: string
  away_team: string
  home_flag: string
  away_flag: string
  home_score: number | null
  away_score: number | null
  match_date: string
  stage: string
  group_name: string | null
  venue: string | null
  status: 'upcoming' | 'live' | 'finished'
  match_number: number
}

export interface Bet {
  id: string
  user_id: string
  match_id: string
  bet_winner: 'home' | 'away' | 'draw' | null
  bet_home_score: number | null
  bet_away_score: number | null
  points_earned: number | null
  resolved: boolean
  created_at: string
  updated_at: string
  match?: Match
}
