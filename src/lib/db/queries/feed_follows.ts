import { db } from "..";
import { eq } from "drizzle-orm";
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