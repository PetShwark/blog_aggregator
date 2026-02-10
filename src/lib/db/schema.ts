import { desc } from "drizzle-orm";
import { pgTable, timestamp, uuid, text, unique } from "drizzle-orm/pg-core";
import { url } from "node:inspector";

export const users = pgTable("users", {
    id: uuid("id").primaryKey().defaultRandom().notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at")
        .notNull()
        .defaultNow()
        .$onUpdate(() => new Date()),
    name: text("name").notNull().unique(),
});

export const feeds = pgTable("feeds", {
    id: uuid("id").primaryKey().defaultRandom().notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at")
        .notNull()
        .defaultNow()
        .$onUpdate(() => new Date()),
    url: text("url").notNull().unique(),
    name: text("name").notNull(),
    userId: uuid("user_id")
        .notNull()
        .references(() => users.id, { onDelete: "cascade" }),
    last_fetched_at: timestamp("last_fetched_at"),
});

export const feedFollows = pgTable("feed_follows", {
    id: uuid("id").primaryKey().defaultRandom().notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at")
        .notNull()
        .defaultNow()
        .$onUpdate(() => new Date()),
    userId: uuid("user_id")
        .notNull()
        .references(() => users.id, { onDelete: "cascade" }),
    feedId: uuid("feed_id")
        .notNull()
        .references(() => feeds.id, { onDelete: "cascade" }),
}, (t) => [
    unique('unique_user_feed').on(t.userId, t.feedId)
]);

export const posts = pgTable("posts", {
    id: uuid("id").primaryKey().defaultRandom().notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at")
        .notNull()
        .defaultNow()
        .$onUpdate(() => new Date()),
    feedId: uuid("feed_id")
        .notNull()
        .references(() => feeds.id, { onDelete: "cascade" }),
    title: text("title"),
    url: text("url").notNull(),
    published_at: timestamp("published_at").notNull(),
    description: text("description"),
});

export type User = typeof users.$inferSelect;
export type Feed = typeof feeds.$inferSelect;
export type FeedFollow = typeof feedFollows.$inferSelect;
export type Post = typeof posts.$inferSelect;