-- Add invite code to teams table
ALTER TABLE teams
ADD COLUMN IF NOT EXISTS invite_code VARCHAR(20) UNIQUE;

-- Add index for invite code
CREATE INDEX IF NOT EXISTS idx_teams_invite_code ON teams(invite_code);
