CREATE TABLE "ai_activity" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"type" varchar(100) NOT NULL,
	"description" text NOT NULL,
	"confidence" numeric(3, 2),
	"input_data" jsonb DEFAULT '{}'::jsonb,
	"output_data" jsonb DEFAULT '{}'::jsonb,
	"model" varchar(255),
	"tokens_used" integer,
	"timestamp" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "collaborations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"project_name" varchar(255) NOT NULL,
	"description" text,
	"participants" jsonb NOT NULL,
	"status" varchar(50) DEFAULT 'active',
	"category" varchar(100),
	"tags" jsonb DEFAULT '[]'::jsonb,
	"created_by" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "nft_achievements" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"owner_id" uuid NOT NULL,
	"title" varchar(255) NOT NULL,
	"description" text,
	"rarity" varchar(50) NOT NULL,
	"image" text,
	"contract_address" varchar(42),
	"token_id" varchar(255),
	"chain_id" integer,
	"earned_at" timestamp with time zone NOT NULL,
	"metadata" jsonb DEFAULT '{}'::jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "onboarding_status" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"wallet_connected" boolean DEFAULT false,
	"role_selected" boolean DEFAULT false,
	"profile_completed" boolean DEFAULT false,
	"ai_initialized" boolean DEFAULT false,
	"onboarding_complete" boolean DEFAULT false,
	"completed_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "onboarding_status_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
CREATE TABLE "profiles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"bio" text,
	"skills" jsonb DEFAULT '[]'::jsonb,
	"interests" jsonb DEFAULT '[]'::jsonb,
	"achievements" jsonb DEFAULT '[]'::jsonb,
	"social_links" jsonb DEFAULT '{}'::jsonb,
	"website" text,
	"location" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text,
	"email" text NOT NULL,
	"wallet_address" varchar(42),
	"role" varchar(50) DEFAULT 'member',
	"reputation" integer DEFAULT 0,
	"bio" text,
	"avatar" text,
	"email_verified" boolean DEFAULT false,
	"banned" boolean DEFAULT false,
	"ban_reason" text,
	"ban_expires" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email"),
	CONSTRAINT "users_wallet_address_unique" UNIQUE("wallet_address")
);
--> statement-breakpoint
CREATE TABLE "wallet_connections" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"wallet_address" varchar(42) NOT NULL,
	"chain_id" integer NOT NULL,
	"verified" boolean DEFAULT false,
	"signature" text,
	"connected_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "ai_activity" ADD CONSTRAINT "ai_activity_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "collaborations" ADD CONSTRAINT "collaborations_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "nft_achievements" ADD CONSTRAINT "nft_achievements_owner_id_users_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "onboarding_status" ADD CONSTRAINT "onboarding_status_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "profiles" ADD CONSTRAINT "profiles_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "wallet_connections" ADD CONSTRAINT "wallet_connections_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_ai_activity_user_id" ON "ai_activity" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_ai_activity_type" ON "ai_activity" USING btree ("type");--> statement-breakpoint
CREATE INDEX "idx_ai_activity_timestamp" ON "ai_activity" USING btree ("timestamp");--> statement-breakpoint
CREATE INDEX "idx_collaborations_created_by" ON "collaborations" USING btree ("created_by");--> statement-breakpoint
CREATE INDEX "idx_collaborations_status" ON "collaborations" USING btree ("status");--> statement-breakpoint
CREATE INDEX "idx_collaborations_created_at" ON "collaborations" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "idx_achievements_owner_id" ON "nft_achievements" USING btree ("owner_id");--> statement-breakpoint
CREATE INDEX "idx_achievements_earned_at" ON "nft_achievements" USING btree ("earned_at");--> statement-breakpoint
CREATE INDEX "idx_onboarding_user_id" ON "onboarding_status" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_profiles_user_id" ON "profiles" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_users_email" ON "users" USING btree ("email");--> statement-breakpoint
CREATE INDEX "idx_users_wallet" ON "users" USING btree ("wallet_address");--> statement-breakpoint
CREATE INDEX "idx_users_created_at" ON "users" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "idx_wallet_connections_user_id" ON "wallet_connections" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_wallet_connections_wallet_address" ON "wallet_connections" USING btree ("wallet_address");