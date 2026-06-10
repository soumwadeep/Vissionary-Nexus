-- Add new columns to events table for event registration system
-- This migration adds participation_mode, min_team_size, max_team_size, required_skills

ALTER TABLE events 
ADD COLUMN IF NOT EXISTS participation_mode VARCHAR(20) DEFAULT 'solo';

ALTER TABLE events 
ADD COLUMN IF NOT EXISTS min_team_size INTEGER DEFAULT 2;

ALTER TABLE events 
ADD COLUMN IF NOT EXISTS max_team_size INTEGER DEFAULT 5;

ALTER TABLE events 
ADD COLUMN IF NOT EXISTS required_skills JSONB DEFAULT '[]'::jsonb;

-- Add index for participation_mode
CREATE INDEX IF NOT EXISTS idx_events_participation_mode 
ON events (participation_mode);
