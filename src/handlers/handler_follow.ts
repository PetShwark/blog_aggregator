import { createFeedFollow } from "../lib/db/queries/feed_follows";
import { getFeedByUrl } from "../lib/db/queries/feeds";
import { User } from "../lib/db/schema";

export async function handleFollow(cmdName: string, user: User, ...args: string[]) {
    if (args.length < 1) {
        throw new Error("Usage: follow <feed_url>");
    }
    const feedUrl = args[0];
    try {
        const feed = await getFeedByUrl(feedUrl);
        if (!feed) {
            throw new Error(`Feed with URL ${feedUrl} not found.`);
        }
        const feedFollow = await createFeedFollow(user.id, feed.id);
    } catch (error) {
        throw new Error(`Error following feed: ${error}`);
    }
}