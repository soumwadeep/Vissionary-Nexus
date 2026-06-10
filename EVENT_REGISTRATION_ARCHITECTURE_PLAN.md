# Vissionary Nexus - Event Registration System Redesign - Architecture & Implementation Plan

## 1. Current State Audit

### 1.1 Database Schema Overview

The current database schema includes:
- **users**: Core user data
- **profiles**: Extended profile information
- **onboarding_status**: Onboarding progress tracking
- **events**: Event details including teams, registrations

### 1.2 What we have already:
- Events listing page (`/dashboard/participant/events`) with basic registration
- Events CRUD API at `/api/events`
- Teams & team members tables already exist
- Onboarding status with `profileCompleted` field

## 2. Requirements Breakdown

### 2.1 Database Changes Needed

#### 2.1.1 Update `events` table
- Add `participationMode` field to events table (values: `solo`, `team`, `solo_or_team`
- Add `minTeamSize`, `maxTeamSize` fields
- Add `requiredSkills` for AI matching

#### 2.1.2 New Tables for AI
- **ai_event_match_scores - User-Event matching scores
- **ai_team_match_scores - User-Team matching scores
- **team_invitations - To allow teams to invite users & vice versa

---

## 3. Phase 1: Database Schema Updates

### 3.1 Database Migration Plan
1. **Add to `events` table (db/schema.ts:
```typescript
export const events = pgTable('events', {
  // ... existing fields ...
  participationMode: varchar('participation_mode', { length: 20 }).default('solo'), // solo, team, solo_or_team
  minTeamSize: integer('min_team_size').default(2),
  maxTeamSize: integer('max_team_size').default(5),
  requiredSkills: jsonb('required_skills').$type<string[]>().default([]),
});
```

2. **Add new table for `ai_event_match_scores`:
```typescript
export const aiEventMatchScores = pgTable('ai_event_match_scores', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id),
  eventId: uuid('event_id').notNull().references(() => events.id),
  score: decimal('score', { precision: 5, scale: 2 }).notNull(),
  breakdown: jsonb('breakdown').$type<{
    skills: number;
    profile: number;
    resume: number;
    previousParticipation: number;
  }>().notNull(),
  generatedAt: timestamp('generated_at', { withTimezone: true }).defaultNow(),
  expiresAt: timestamp('expires_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});
```

3. **Add new table for `ai_team_match_scores`:
```typescript
export const aiTeamMatchScores = pgTable('ai_team_match_scores', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id),
  teamId: uuid('team_id').notNull().references(() => teams.id),
  eventId: uuid('event_id').notNull().references(() => events.id),
  score: decimal('score', { precision: 5, scale: 2 }).notNull(),
  breakdown: jsonb('breakdown').$type<any>(),
  generatedAt: timestamp('generated_at', { withTimezone: true }).defaultNow(),
  expiresAt: timestamp('expires_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});
```

4. **Add table for `team_invitations` (optional but useful):
```typescript
export const teamInvitations = pgTable('team_invitations', {
  id: uuid('id').primaryKey().defaultRandom(),
  teamId: uuid('team_id').notNull().references(() => teams.id),
  inviterId: uuid('inviter_id').notNull().references(() => users.id),
  inviteeId: uuid('invitee_id').notNull().references(() => users.id),
  eventId: uuid('event_id').notNull().references(() => events.id),
  status: varchar('status', { length: 20 }).default('pending'), // pending, accepted, rejected, expired
  message: text('message'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  respondedAt: timestamp('responded_at', { withTimezone: true }),
});
```

---

## 4. Phase 2: UI/UX Changes

### 4.1 Pages & Routes
1. Event Details Page - `/dashboard/participant/events/[id]`
   - Shows event details
   - AI Match Score display
   - Registration flow (profile completion check first!)
   - Team management (for team/solo_or_team events)
2. Update Events List to navigate to details instead of direct register
3. Profile completion check/modal

### 4.2 Profile Completion Validation
Check `onboarding_status.profileCompleted must be true before allowing registration

---

## 5. Phase 3: API Changes
1. New API endpoints:
   - `/api/events/[id] - get event details with matches
   - `/api/events/[id]/register` - registration
   - `/api/teams/create` - create team
   - `/api/teams/[id]/join` - join team
   - `/api/ai/match-event` - AI event matching
   - `/api/ai/match-team` - team matching
   - `/api/teams/[id]/invitations` - team invites

---

## 6. Implementation Plan
- Phase 1: DB migrations & schema
- Phase 2: Event Details Page
- Phase 3: Team features (create/join team + validation
- Phase 4: AI Match integration
- Phase 5: UI polish & testing
