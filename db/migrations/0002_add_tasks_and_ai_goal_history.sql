CREATE TABLE "tasks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"team_id" uuid,
	"event_id" uuid,
	"title" varchar(255) NOT NULL,
	"description" text,
	"priority" varchar(20) DEFAULT 'medium',
	"status" varchar(20) DEFAULT 'pending',
	"category" varchar(50),
	"estimated_time" varchar(50),
	"due_date" timestamp with time zone,
	"ai_suggested" boolean DEFAULT false,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "ai_goal_history" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"goal" text NOT NULL,
	"goal_type" varchar(100),
	"generated_roadmap" jsonb,
	"recommendations" jsonb DEFAULT '[]'::jsonb,
	"progress" jsonb,
	"status" varchar(50) DEFAULT 'active',
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_team_id_teams_id_fk" FOREIGN KEY ("team_id") REFERENCES "public"."teams"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_event_id_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "ai_goal_history" ADD CONSTRAINT "ai_goal_history_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
CREATE INDEX "idx_tasks_user_id" ON "tasks" USING btree ("user_id");
--> statement-breakpoint
CREATE INDEX "idx_tasks_team_id" ON "tasks" USING btree ("team_id");
--> statement-breakpoint
CREATE INDEX "idx_tasks_event_id" ON "tasks" USING btree ("event_id");
--> statement-breakpoint
CREATE INDEX "idx_tasks_status" ON "tasks" USING btree ("status");
--> statement-breakpoint
CREATE INDEX "idx_ai_goal_history_user_id" ON "ai_goal_history" USING btree ("user_id");
--> statement-breakpoint
CREATE INDEX "idx_ai_goal_history_status" ON "ai_goal_history" USING btree ("status");
