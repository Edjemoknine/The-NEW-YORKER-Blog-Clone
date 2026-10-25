import {
  pgTable,
  uuid,
  varchar,
  text,
  timestamp,
  primaryKey,
  integer,
  index,
  vector,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 255 }).notNull().unique(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: text("password").notNull(),
  bio: varchar("bio", { length: 500 }).notNull().default(""),
  avatar: text("avatar").notNull().default(""),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const categories = pgTable("categories", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 255 }).notNull().unique(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const savedPosts = pgTable(
  "saved_posts",
  {
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    postId: uuid("post_id")
      .notNull()
      .references(() => posts.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [primaryKey({ columns: [table.userId, table.postId] })],
);

export const posts = pgTable(
  "posts",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    title: varchar("title", { length: 500 }).notNull(),
    desc: text("description").notNull(),
    content: text("content").notNull(),
    date: timestamp("date", {
      withTimezone: true,
    })
      .notNull()
      .defaultNow(),

    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, {
        onDelete: "cascade",
      }),

    image: text("image").notNull().default(""),

    categories: text("categories")
      .array()
      .notNull()
      .default(sql`ARRAY[]::text[]`),

    embedding: vector("embedding", {
      dimensions: 384,
    }),

    embeddingModel: varchar("embedding_model", {
      length: 150,
    }),

    embeddingUpdatedAt: timestamp("embedding_updated_at", {
      withTimezone: true,
    }),

    createdAt: timestamp("created_at", {
      withTimezone: true,
    })
      .notNull()
      .defaultNow(),

    updatedAt: timestamp("updated_at", {
      withTimezone: true,
    })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("posts_user_id_idx").on(table.userId),

    index("posts_categories_idx").using("gin", table.categories),

    index("posts_embedding_hnsw_idx").using(
      "hnsw",
      table.embedding.op("vector_cosine_ops"),
    ),
  ],
);

export const recommendationEvents = pgTable(
  "recommendation_events",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id").references(() => users.id, {
      onDelete: "cascade",
    }),
    visitorId: varchar("visitor_id", {
      length: 128,
    }),
    postId: uuid("post_id").references(() => posts.id, {
      onDelete: "cascade",
    }),
    eventType: varchar("event_type", {
      length: 40,
    }).notNull(),
    query: varchar("query", {
      length: 200,
    }),
    durationSeconds: integer("duration_seconds").notNull().default(0),
    createdAt: timestamp("created_at", {
      withTimezone: true,
    })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("recommendation_events_user_created_idx").on(
      table.userId,
      table.createdAt,
    ),

    index("recommendation_events_visitor_created_idx").on(
      table.visitorId,
      table.createdAt,
    ),

    index("recommendation_events_post_type_idx").on(
      table.postId,
      table.eventType,
    ),
  ],
);
