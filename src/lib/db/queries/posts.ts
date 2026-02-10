import { db } from "..";
import { eq, desc } from "drizzle-orm";
import { posts, feeds } from "../schema";

export async function createPost(feedId: string, title: string, url: string, publishedAt: Date, description: string) {
    const [post] = await db
        .insert(posts)
        .values({ feedId, title, url, published_at: publishedAt, description })
        .returning();
    return post;
}

export async function getPostsForUser(userId: string, limit: number = 2) {
    const postsList = await db
        .select()
        .from(posts)
        .innerJoin(feeds, eq(posts.feedId, feeds.id))
        .where(eq(feeds.userId, userId))
        .orderBy(desc(posts.published_at))
        .limit(limit);
    return postsList;
}