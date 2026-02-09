import { createFeed } from "../lib/db/queries/feeds.js";
import { Feed, User } from "../lib/db/schema.js";
import { createFeedFollow } from "../lib/db/queries/feed_follows.js";

export function printFeed(feed: Feed, user: User): void {
    console.log(`Feed: ${feed.name} (${feed.url}) - User: ${user.name}`);
}

export async function handlerAddFeed(cmdName: string, user: User, ...args: string[]): Promise<void> {
    if (args.length < 2) {
        throw new Error("Usage: addfeed <feed_name> <feed_url>");
    }
    try {
        const feedName = args[0];
        const feedURL = args[1];
        const userId = user.id;
        const feed = await createFeed(feedURL, feedName, userId);
        printFeed(feed, user);
        const feedFollow = await createFeedFollow(userId, feed.id);
    } catch (err) {
        console.error(`Failed to add feed: ${err}`);
        throw err;
    }
}