CREATE TYPE "public"."embedding_job_status" AS ENUM('pending', 'processing', 'completed', 'failed');--> statement-breakpoint
CREATE TABLE "embedding_jobs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"post_id" uuid NOT NULL,
	"status" "embedding_job_status" DEFAULT 'pending' NOT NULL,
	"attempts" integer DEFAULT 0 NOT NULL,
	"next_attempt_at" timestamp with time zone DEFAULT now() NOT NULL,
	"locked_at" timestamp with time zone,
	"last_error" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "embedding_jobs" ADD CONSTRAINT "embedding_jobs_post_id_posts_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "embedding_jobs_post_id_idx" ON "embedding_jobs" USING btree ("post_id");--> statement-breakpoint
CREATE INDEX "embedding_jobs_status_retry_idx" ON "embedding_jobs" USING btree ("status","next_attempt_at");