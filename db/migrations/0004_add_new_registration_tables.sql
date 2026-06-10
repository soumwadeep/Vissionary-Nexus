-- Create tables for AI Event Matching and Team Invites
-- Corrected to match db/schema.ts!

-- AI Event Match Scores
CREATE TABLE IF NOT EXISTS ai_event_match_scores (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    score DECIMAL(5,2) NOT NULL,
    breakdown JSONB NOT NULL,
    generated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_ai_event_match_user_id ON ai_event_match_scores(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_event_match_event_id ON ai_event_match_scores(event_id);

-- AI Team Match Scores
CREATE TABLE IF NOT EXISTS ai_team_match_scores (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
    event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    score DECIMAL(5,2) NOT NULL,
    breakdown JSONB,
    generated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_ai_team_match_user_id ON ai_team_match_scores(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_team_match_team_id ON ai_team_match_scores(team_id);
CREATE INDEX IF NOT EXISTS idx_ai_team_match_event_id ON ai_team_match_scores(event_id);

-- Team Invitations
CREATE TABLE IF NOT EXISTS team_invitations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
    inviter_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    invitee_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    status VARCHAR(20) DEFAULT 'pending', -- pending, accepted, rejected, expired
    message TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    responded_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_team_invitation_team_id ON team_invitations(team_id);
CREATE INDEX IF NOT EXISTS idx_team_invitation_invitee_id ON team_invitations(invitee_id);
CREATE INDEX IF NOT EXISTS idx_team_invitation_event_id ON team_invitations(event_id);
