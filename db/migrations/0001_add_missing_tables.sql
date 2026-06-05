CREATE TABLE "achievements" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text,
	"category" varchar(100),
	"icon" text,
	"points" integer DEFAULT 0,
	"rarity" varchar(50) DEFAULT 'common',
	"requirements" jsonb DEFAULT '{}'::jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_stats" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"events_participated" integer DEFAULT 0,
	"events_won" integer DEFAULT 0,
	"projects_completed" integer DEFAULT 0,
	"collaborations_count" integer DEFAULT 0,
	"total_earnings" numeric(18, 2) DEFAULT '0',
	"total_points" integer DEFAULT 0,
	"rank" integer,
	"streak" integer DEFAULT 0,
	"last_active_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "user_stats_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
CREATE TABLE "events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" varchar(255) NOT NULL,
	"description" text,
	"type" varchar(100) DEFAULT 'hackathon',
	"status" varchar(50) DEFAULT 'upcoming',
	"start_date" timestamp with time zone NOT NULL,
	"end_date" timestamp with time zone NOT NULL,
	"registration_deadline" timestamp with time zone,
	"max_participants" integer,
	"current_participants" integer DEFAULT 0,
	"prize_pool" numeric(18, 2),
	"currency" varchar(10) DEFAULT 'USD',
	"image" text,
	"location" text,
	"is_virtual" boolean DEFAULT true,
	"tags" jsonb DEFAULT '[]'::jsonb,
	"requirements" jsonb DEFAULT '[]'::jsonb,
	"prizes" jsonb DEFAULT '[]'::jsonb,
	"judges" jsonb DEFAULT '[]'::jsonb,
	"sponsors" jsonb DEFAULT '[]'::jsonb,
	"created_by" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "teams" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text,
	"avatar" text,
	"event_id" uuid,
	"leader_id" uuid NOT NULL,
	"max_members" integer DEFAULT 5,
	"current_members" integer DEFAULT 1,
	"is_open" boolean DEFAULT true,
	"tags" jsonb DEFAULT '[]'::jsonb,
	"looking_for" jsonb DEFAULT '[]'::jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "team_members" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"team_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"role" varchar(50) DEFAULT 'member',
	"status" varchar(50) DEFAULT 'active',
	"joined_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "event_registrations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"event_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"team_id" uuid,
	"status" varchar(50) DEFAULT 'registered',
	"role" varchar(50) DEFAULT 'participant',
	"submission_id" uuid,
	"score" numeric(5, 2),
	"rank" integer,
	"feedback" text,
	"registered_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "nft_achievements" ADD CONSTRAINT "nft_achievements_achievement_id_achievements_id_fk" FOREIGN KEY ("achievement_id") REFERENCES "public"."achievements"("id") ON DELETE set null ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "user_stats" ADD CONSTRAINT "user_stats_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "events" ADD CONSTRAINT "events_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "teams" ADD CONSTRAINT "teams_event_id_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE set null ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "teams" ADD CONSTRAINT "teams_leader_id_users_id_fk" FOREIGN KEY ("leader_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "team_members" ADD CONSTRAINT "team_members_team_id_teams_id_fk" FOREIGN KEY ("team_id") REFERENCES "public"."teams"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "team_members" ADD CONSTRAINT "team_members_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "event_registrations" ADD CONSTRAINT "event_registrations_event_id_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "event_registrations" ADD CONSTRAINT "event_registrations_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "event_registrations" ADD CONSTRAINT "event_registrations_team_id_teams_id_fk" FOREIGN KEY ("team_id") REFERENCES "public"."teams"("id") ON DELETE set null ON UPDATE no action;
--> statement-breakpoint
CREATE INDEX "idx_achievements_category" ON "achievements" USING btree ("category");
--> statement-breakpoint
CREATE INDEX "idx_achievements_rarity" ON "achievements" USING btree ("rarity");
--> statement-breakpoint
CREATE INDEX "idx_user_stats_user_id" ON "user_stats" USING btree ("user_id");
--> statement-breakpoint
CREATE INDEX "idx_user_stats_rank" ON "user_stats" USING btree ("rank");
--> statement-breakpoint
CREATE INDEX "idx_events_status" ON "events" USING btree ("status");
--> statement-breakpoint
CREATE INDEX "idx_events_type" ON "events" USING btree ("type");
--> statement-breakpoint
CREATE INDEX "idx_events_start_date" ON "events" USING btree ("start_date");
--> statement-breakpoint
CREATE INDEX "idx_events_created_by" ON "events" USING btree ("created_by");
--> statement-breakpoint
CREATE INDEX "idx_teams_event_id" ON "teams" USING btree ("event_id");
--> statement-breakpoint
CREATE INDEX "idx_teams_leader_id" ON "teams" USING btree ("leader_id");
--> statement-breakpoint
CREATE INDEX "idx_teams_is_open" ON "teams" USING btree ("is_open");
--> statement-breakpoint
CREATE INDEX "idx_team_members_team_id" ON "team_members" USING btree ("team_id");
--> statement-breakpoint
CREATE INDEX "idx_team_members_user_id" ON "team_members" USING btree ("user_id");
--> statement-breakpoint
CREATE INDEX "idx_team_members_unique" ON "team_members" USING btree ("team_id", "user_id");
--> statement-breakpoint
CREATE INDEX "idx_event_registrations_event_id" ON "event_registrations" USING btree ("event_id");
--> statement-breakpoint
CREATE INDEX "idx_event_registrations_user_id" ON "event_registrations" USING btree ("user_id");
--> statement-breakpoint
CREATE INDEX "idx_event_registrations_team_id" ON "event_registrations" USING btree ("team_id");
--> statement-breakpoint
CREATE INDEX "idx_event_registrations_status" ON "event_registrations" USING btree ("status");
