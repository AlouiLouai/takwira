-- Create the players table
CREATE TABLE IF NOT EXISTS players (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  avatar_seed TEXT NOT NULL,
  team_id TEXT NOT NULL CHECK (team_id IN ('A', 'B')),
  slot_index INTEGER NOT NULL CHECK (slot_index >= 0 AND slot_index < 7),
  position_x DECIMAL(5,2) NOT NULL CHECK (position_x >= 4 AND position_x <= 96),
  position_y DECIMAL(5,2) NOT NULL CHECK (position_y >= 4 AND position_y <= 96),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL,

  -- Ensure one player per team slot
  UNIQUE (team_id, slot_index)
);

-- Add index for faster queries
CREATE INDEX IF NOT EXISTS idx_players_team_slot ON players(team_id, slot_index);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc'::TEXT, NOW());
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_players_updated_at
  BEFORE UPDATE ON players
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE players ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations (you can restrict this later based on auth)
CREATE POLICY "Enable all access for players" ON players
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Comments for documentation
COMMENT ON TABLE players IS 'Stores football players assigned to teams';
COMMENT ON COLUMN players.team_id IS 'Team identifier: A or B';
COMMENT ON COLUMN players.slot_index IS 'Player position slot (0-6)';
COMMENT ON COLUMN players.position_x IS 'Horizontal position percentage (4-96)';
COMMENT ON COLUMN players.position_y IS 'Vertical position percentage (4-96)';
