import { db } from "..";
import { eq, and } from "drizzle-orm";
import { feedFollows, feeds, users } from "../schema";

export async function createFeedFollow(userId: string, feedId: string) {
    const [feedFollowId] = await db
        .insert(feedFollows)
        .values({ userId: userId, feedId: feedId }).returning({ id: feedFollows.id });
    const feedFollow = await db.select().from(feedFollows).where(eq(feedFollows.id, feedFollowId.id)).innerJoin(feeds, eq(feedFollows.feedId, feeds.id)).innerJoin(users, eq(feedFollows.userId, users.id));
    return feedFollow;
}

export async function getFeedFollowsForUser(userId: string) {
    const feedFollowsList = await db
        .select()
        .from(feedFollows)
        .innerJoin(feeds, eq(feedFollows.feedId, feeds.id))
        .innerJoin(users, eq(feedFollows.userId, users.id))
        .where(eq(feedFollows.userId, userId));
    return feedFollowsList;
}

export async function deleteFeedFollow(userId: string, feedUrl: string) {
    const feed = await db.select().from(feeds).where(eq(feeds.url, feedUrl));
    if (feed.length === 0) {
        throw new Error(`Feed with URL ${feedUrl} not found.`);
    }
    const feedId = feed[0].id;
    await db.delete(feedFollows).where(and(eq(feedFollows.userId, userId), eq(feedFollows.feedId, feedId)));
}   