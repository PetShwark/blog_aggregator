import { deleteFeedFollow } from "../lib/db/queries/feed_follows";
import { User } from "../lib/db/schema";

export async function handleUnfollow(cmdName: string, user: User, ...args: string[]) {
    if (args.length < 1) {
        throw new Error("Usage: unfollow <feed_url>");
    }
    const feedUrl = args[0];
    try {
        await deleteFeedFollow(user.id, feedUrl);
    } catch (error) {
        throw new Error(`Error unfollowing feed: ${error}`);
    }
}