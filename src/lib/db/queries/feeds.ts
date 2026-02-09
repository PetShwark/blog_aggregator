import { db } from "..";
import { eq } from "drizzle-orm";
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

export async function getFeedsWithUserNames() {
    const feedsList = await db.select().from(feeds).innerJoin(users, eq(feeds.userId, users.id));
    return feedsList;
}