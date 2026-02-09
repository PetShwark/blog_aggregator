import { db } from "..";
import { feeds } from "../schema";

export async function createFeed(url: string, name: string, userId: string) {
    const [feed] = await db
        .insert(feeds)
        .values({ url: url, name: name, userId: userId })
        .returning();
    return feed;
}