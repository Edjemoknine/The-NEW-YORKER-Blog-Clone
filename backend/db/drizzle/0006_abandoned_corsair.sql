CREATE TABLE "user_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid,
	"visitor_id" uuid,
	"post_id" uuid,
	"event_type" varchar(50) NOT NULL,
	"search_query" text,
	"metadata" json,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
DROP TABLE "recommendation_events" CASCADE;--> statement-breakpoint
ALTER TABLE "user_events" ADD CONSTRAINT "user_events_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_events" ADD CONSTRAINT "user_events_post_id_posts_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "user_events_user_id_idx" ON "user_events" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "user_events_visitor_id_idx" ON "user_events" USING btree ("visitor_id");--> statement-breakpoint
CREATE INDEX "user_events_post_id_idx" ON "user_events" USING btree ("post_id");--> statement-breakpoint
CREATE INDEX "user_events_created_at_idx" ON "user_events" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "user_events_type_created_idx" ON "user_events" USING btree ("event_type","created_at");