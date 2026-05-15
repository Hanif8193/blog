-- ============================================================
-- Migration 0001 — Add views counter, likes table, users.created_at
-- Strategy: fully idempotent — safe to run multiple times
-- ============================================================

-- Step 1: Add created_at to users if it was missing from the initial migration
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name   = 'users'
      AND column_name  = 'created_at'
  ) THEN
    ALTER TABLE "users"
      ADD COLUMN "created_at" timestamp DEFAULT now() NOT NULL;
  END IF;
END $$;
--> statement-breakpoint

-- Step 2: Normalise role column to text if it was created as varchar by an earlier ORM version.
-- varchar and text are stored identically in PostgreSQL — zero data conversion, instant ALTER.
DO $$ BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name   = 'users'
      AND column_name  = 'role'
      AND data_type    = 'character varying'
  ) THEN
    ALTER TABLE "users" ALTER COLUMN "role" TYPE text;
  END IF;
END $$;
--> statement-breakpoint

-- Step 3: Add view counter to blogs.
-- ADD COLUMN IF NOT EXISTS prevents error if already applied manually.
ALTER TABLE "blogs" ADD COLUMN IF NOT EXISTS "views" integer DEFAULT 0 NOT NULL;
--> statement-breakpoint

-- Step 4: Create likes table.
-- Composite UNIQUE on (blog_id, fingerprint) prevents duplicate likes.
CREATE TABLE IF NOT EXISTS "likes" (
  "id"          uuid      PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "blog_id"     uuid      NOT NULL,
  "fingerprint" text      NOT NULL,
  "created_at"  timestamp DEFAULT now() NOT NULL,
  CONSTRAINT "likes_blog_id_fingerprint_unique" UNIQUE("blog_id", "fingerprint")
);
--> statement-breakpoint

-- Step 5: Add FK likes → blogs (cascade delete so orphans are auto-cleaned).
-- Exception handler makes this safe to re-run.
DO $$ BEGIN
  ALTER TABLE "likes"
    ADD CONSTRAINT "likes_blog_id_blogs_id_fk"
    FOREIGN KEY ("blog_id")
    REFERENCES "public"."blogs"("id")
    ON DELETE CASCADE ON UPDATE NO ACTION;
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;
