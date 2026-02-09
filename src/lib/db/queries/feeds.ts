import { db } from "..";
import { eq, sql } from "drizzle-orm";
import { feeds, users } from "../schema";

export async function createFeed(url: string, name: string, userId: string) {
    const [feed] = await db
        .insert(feeds)
        .values({ url: url, name: name, userId: userId })
        .returning();
    return feed;
}

export async function getFeeds() {
    const feedsList = await db.select().from(feeds);
    return feedsList;
}

export async function getFeedByUrl(url: string) {
    const [feed] = await db.select().from(feeds).where(eq(feeds.url, url)).limit(1);
    return feed;
}

export async function getFeedsWithUserNames() {
    const feedsList = await db.select().from(feeds).innerJoin(users, eq(feeds.userId, users.id));
    return feedsList;
}

export async function markFeedFetched(feedId: string) {
    const [feed] = await db.update(feeds).set({ last_fetched_at: new Date(Date.now()) }).where(eq(feeds.id, feedId)).returning();
    return feed;
}

export async function getNextFeedToFetch() {
    const [feed] = await db.select().from(feeds).orderBy(sql`feeds.last_fetched_at ASC NULLS FIRST`).limit(1);
    return feed;
}