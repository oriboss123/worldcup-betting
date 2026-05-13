-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (custom auth - no Supabase Auth)
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  nickname TEXT,
  phone TEXT UNIQUE NOT NULL,
  total_points INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Groups table
CREATE TABLE groups (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  invite_code TEXT UNIQUE NOT NULL,
  created_by UUID REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Group members
CREATE TABLE group_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  group_id UUID REFERENCES groups(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  points INTEGER DEFAULT 0,
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(group_id, user_id)
);

-- Teams
CREATE TABLE teams (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  flag_emoji TEXT,
  group_letter TEXT
);

-- Matches
CREATE TABLE matches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  home_team TEXT NOT NULL,
  away_team TEXT NOT NULL,
  home_flag TEXT DEFAULT '🏳️',
  away_flag TEXT DEFAULT '🏳️',
  home_score INTEGER,
  away_score INTEGER,
  match_date TIMESTAMPTZ NOT NULL,
  stage TEXT NOT NULL, -- 'group', 'round_of_32', 'round_of_16', 'quarter', 'semi', 'final'
  group_name TEXT, -- A, B, C... for group stage
  venue TEXT,
  status TEXT DEFAULT 'upcoming', -- 'upcoming', 'live', 'finished'
  match_number INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Bets
CREATE TABLE bets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  match_id UUID REFERENCES matches(id) ON DELETE CASCADE,
  bet_winner TEXT, -- 'home', 'away', 'draw', or NULL if not betting on winner
  bet_home_score INTEGER,
  bet_away_score INTEGER,
  points_earned INTEGER,
  resolved BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, match_id)
);

-- Indexes
CREATE INDEX idx_bets_user_id ON bets(user_id);
CREATE INDEX idx_bets_match_id ON bets(match_id);
CREATE INDEX idx_group_members_group_id ON group_members(group_id);
CREATE INDEX idx_group_members_user_id ON group_members(user_id);
CREATE INDEX idx_matches_status ON matches(status);
CREATE INDEX idx_matches_date ON matches(match_date);

-- RLS Policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE group_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE bets ENABLE ROW LEVEL SECURITY;

-- Allow all reads for now (anon key)
CREATE POLICY "Public read users" ON users FOR SELECT USING (true);
CREATE POLICY "Public insert users" ON users FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update users" ON users FOR UPDATE USING (true);

CREATE POLICY "Public read groups" ON groups FOR SELECT USING (true);
CREATE POLICY "Public insert groups" ON groups FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update groups" ON groups FOR UPDATE USING (true);

CREATE POLICY "Public read group_members" ON group_members FOR SELECT USING (true);
CREATE POLICY "Public insert group_members" ON group_members FOR INSERT WITH CHECK (true);
CREATE POLICY "Public delete group_members" ON group_members FOR DELETE USING (true);

CREATE POLICY "Public read matches" ON matches FOR SELECT USING (true);
CREATE POLICY "Public insert matches" ON matches FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update matches" ON matches FOR UPDATE USING (true);

CREATE POLICY "Public read bets" ON bets FOR SELECT USING (true);
CREATE POLICY "Public insert bets" ON bets FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update bets" ON bets FOR UPDATE USING (true);

-- Function to update points when match is resolved
CREATE OR REPLACE FUNCTION resolve_match_bets(p_match_id UUID)
RETURNS void AS $$
DECLARE
  v_match matches%ROWTYPE;
  v_bet bets%ROWTYPE;
  v_points INTEGER;
  v_winner TEXT;
BEGIN
  SELECT * INTO v_match FROM matches WHERE id = p_match_id;

  IF v_match.home_score IS NULL OR v_match.away_score IS NULL THEN
    RETURN;
  END IF;

  IF v_match.home_score > v_match.away_score THEN
    v_winner := 'home';
  ELSIF v_match.away_score > v_match.home_score THEN
    v_winner := 'away';
  ELSE
    v_winner := 'draw';
  END IF;

  FOR v_bet IN SELECT * FROM bets WHERE match_id = p_match_id AND resolved = FALSE LOOP
    v_points := 0;

    IF v_bet.bet_winner IS NOT NULL THEN
      IF v_bet.bet_winner = v_winner THEN
        v_points := v_points + 3;
      ELSE
        v_points := v_points - 1;
      END IF;
    END IF;

    IF v_bet.bet_home_score IS NOT NULL AND v_bet.bet_away_score IS NOT NULL THEN
      IF v_bet.bet_home_score = v_match.home_score AND v_bet.bet_away_score = v_match.away_score THEN
        v_points := v_points + 6;
      ELSE
        v_points := v_points - 3;
      END IF;
    END IF;

    UPDATE bets SET points_earned = v_points, resolved = TRUE WHERE id = v_bet.id;

    UPDATE users SET total_points = total_points + v_points WHERE id = v_bet.user_id;

    UPDATE group_members SET points = points + v_points
    WHERE user_id = v_bet.user_id;

  END LOOP;

  UPDATE matches SET status = 'finished' WHERE id = p_match_id;
END;
$$ LANGUAGE plpgsql;
