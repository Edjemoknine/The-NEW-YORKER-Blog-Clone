CREATE TABLE "categories" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "categories_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "posts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" varchar(500) NOT NULL,
	"description" text NOT NULL,
	"content" text NOT NULL,
	"date" timestamp with time zone DEFAULT now() NOT NULL,
	"user_id" uuid NOT NULL,
	"image" text DEFAULT '' NOT NULL,
	"categories" text[] DEFAULT ARRAY[]::text[] NOT NULL,
	"embedding" vector(384),
	"embedding_model" varchar(150),
	"embedding_updated_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "recommendation_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid,
	"visitor_id" varchar(128),
	"post_id" uuid,
	"event_type" varchar(40) NOT NULL,
	"query" varchar(200),
	"duration_seconds" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "saved_posts" (
	"user_id" uuid NOT NULL,
	"post_id" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "saved_posts_user_id_post_id_pk" PRIMARY KEY("user_id","post_id")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"password" text NOT NULL,
	"bio" varchar(500) DEFAULT '' NOT NULL,
	"avatar" text DEFAULT '' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "users_name_unique" UNIQUE("name"),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "posts" ADD CONSTRAINT "posts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recommendation_events" ADD CONSTRAINT "recommendation_events_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recommendation_events" ADD CONSTRAINT "recommendation_events_post_id_posts_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "saved_posts" ADD CONSTRAINT "saved_posts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "saved_posts" ADD CONSTRAINT "saved_posts_post_id_posts_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "posts_user_id_idx" ON "posts" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "posts_categories_idx" ON "posts" USING gin ("categories");--> statement-breakpoint
CREATE INDEX "posts_embedding_hnsw_idx" ON "posts" USING hnsw ("embedding" vector_cosine_ops);--> statement-breakpoint
CREATE INDEX "recommendation_events_user_created_idx" ON "recommendation_events" USING btree ("user_id","created_at");--> statement-breakpoint
CREATE INDEX "recommendation_events_visitor_created_idx" ON "recommendation_events" USING btree ("visitor_id","created_at");--> statement-breakpoint
CREATE INDEX "recommendation_events_post_type_idx" ON "recommendation_events" USING btree ("post_id","event_type");