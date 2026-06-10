const { neon } = require('@neondatabase/serverless');

// Use environment variable for security - NEVER hardcode credentials
const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error('ERROR: DATABASE_URL environment variable is not set');
  console.error('Please set DATABASE_URL before running migrations:');
  console.error('export DATABASE_URL="your_neon_connection_string"');
  process.exit(1);
}

const sql = neon(DATABASE_URL);

async function applyMigrations() {
  try {
    console.log('Applying database schema migrations...');

    // Create all tables
    await sql`
      CREATE TABLE IF NOT EXISTS "users" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
        "name" text,
        "email" text NOT NULL UNIQUE,
        "wallet_address" varchar(42) UNIQUE,
        "role" varchar(50) DEFAULT 'member',
        "reputation" integer DEFAULT 0,
        "bio" text,
        "avatar" text,
        "email_verified" boolean DEFAULT false,
        "banned" boolean DEFAULT false,
        "ban_reason" text,
        "ban_expires" timestamp with time zone,
        "created_at" timestamp with time zone DEFAULT now() NOT NULL,
        "updated_at" timestamp with time zone DEFAULT now() NOT NULL
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS "profiles" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
        "user_id" uuid NOT NULL UNIQUE REFERENCES "users"("id") ON DELETE cascade,
        "bio" text,
        "skills" jsonb DEFAULT '[]'::jsonb,
        "interests" jsonb DEFAULT '[]'::jsonb,
        "achievements" jsonb DEFAULT '[]'::jsonb,
        "social_links" jsonb DEFAULT '{}'::jsonb,
        "website" text,
        "location" text,
        "created_at" timestamp with time zone DEFAULT now() NOT NULL,
        "updated_at" timestamp with time zone DEFAULT now() NOT NULL
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS "onboarding_status" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
        "user_id" uuid NOT NULL UNIQUE REFERENCES "users"("id") ON DELETE cascade,
        "wallet_connected" boolean DEFAULT false,
        "role_selected" boolean DEFAULT false,
        "profile_completed" boolean DEFAULT false,
        "ai_initialized" boolean DEFAULT false,
        "onboarding_complete" boolean DEFAULT false,
        "completed_at" timestamp with time zone,
        "created_at" timestamp with time zone DEFAULT now() NOT NULL,
        "updated_at" timestamp with time zone DEFAULT now() NOT NULL
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS "nft_achievements" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
        "owner_id" uuid NOT NULL REFERENCES "users"("id") ON DELETE cascade,
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
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS "wallet_connections" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
        "user_id" uuid NOT NULL REFERENCES "users"("id") ON DELETE cascade,
        "wallet_address" varchar(42) NOT NULL,
        "chain_id" integer NOT NULL,
        "verified" boolean DEFAULT false,
        "signature" text,
        "connected_at" timestamp with time zone DEFAULT now() NOT NULL
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS "ai_activity" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
        "user_id" uuid NOT NULL REFERENCES "users"("id") ON DELETE cascade,
        "type" varchar(100) NOT NULL,
        "description" text NOT NULL,
        "confidence" numeric(3, 2),
        "input_data" jsonb DEFAULT '{}'::jsonb,
        "output_data" jsonb DEFAULT '{}'::jsonb,
        "model" varchar(255),
        "tokens_used" integer,
        "timestamp" timestamp with time zone DEFAULT now() NOT NULL
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS "collaborations" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
        "project_name" varchar(255) NOT NULL,
        "description" text,
        "participants" jsonb NOT NULL,
        "status" varchar(50) DEFAULT 'active',
        "category" varchar(100),
        "tags" jsonb DEFAULT '[]'::jsonb,
        "created_by" uuid NOT NULL REFERENCES "users"("id") ON DELETE cascade,
        "created_at" timestamp with time zone DEFAULT now() NOT NULL,
        "updated_at" timestamp with time zone DEFAULT now() NOT NULL
      )
    `;

    // Create indexes
    await sql`CREATE INDEX IF NOT EXISTS "idx_users_email" ON "users" USING btree ("email")`;
    await sql`CREATE INDEX IF NOT EXISTS "idx_users_wallet" ON "users" USING btree ("wallet_address")`;
    await sql`CREATE INDEX IF NOT EXISTS "idx_users_created_at" ON "users" USING btree ("created_at")`;
    await sql`CREATE INDEX IF NOT EXISTS "idx_profiles_user_id" ON "profiles" USING btree ("user_id")`;
    await sql`CREATE INDEX IF NOT EXISTS "idx_onboarding_user_id" ON "onboarding_status" USING btree ("user_id")`;
    await sql`CREATE INDEX IF NOT EXISTS "idx_achievements_owner_id" ON "nft_achievements" USING btree ("owner_id")`;
    await sql`CREATE INDEX IF NOT EXISTS "idx_achievements_earned_at" ON "nft_achievements" USING btree ("earned_at")`;
    await sql`CREATE INDEX IF NOT EXISTS "idx_wallet_connections_user_id" ON "wallet_connections" USING btree ("user_id")`;
    await sql`CREATE INDEX IF NOT EXISTS "idx_ai_activity_user_id" ON "ai_activity" USING btree ("user_id")`;
    await sql`CREATE INDEX IF NOT EXISTS "idx_ai_activity_type" ON "ai_activity" USING btree ("type")`;
    await sql`CREATE INDEX IF NOT EXISTS "idx_ai_activity_timestamp" ON "ai_activity" USING btree ("timestamp")`;
    await sql`CREATE INDEX IF NOT EXISTS "idx_collaborations_created_by" ON "collaborations" USING btree ("created_by")`;
    await sql`CREATE INDEX IF NOT EXISTS "idx_collaborations_status" ON "collaborations" USING btree ("status")`;
    await sql`CREATE INDEX IF NOT EXISTS "idx_collaborations_created_at" ON "collaborations" USING btree ("created_at")`;

    console.log('✓ Database schema applied successfully!');
    console.log('✓ All tables created with proper indexes and relationships');
    process.exit(0);
  } catch (error) {
    console.error('✗ Migration failed:', error.message);
    process.exit(1);
  }
}

applyMigrations();
