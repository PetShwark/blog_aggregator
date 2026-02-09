import { createFeedFollow } from "../lib/db/queries/feed_follows";
import { getFeedByUrl } from "../lib/db/queries/feeds";
import { readConfig, Config } from "../config";
import { getUserByName } from "../lib/db/queries/users";

export async function handleFollow(cmdName: string, ...args: string[]) {
    if (args.length < 1) {
        throw new Error("Usage: follow <feed_url>");
    }
    const feedUrl = args[0];
    const config = readConfig();
    if (!config) {
        throw new Error("User not logged in. Please log in first.");
    }
    const userName = config.currentUserName;
    try {
        const selectedUser = await getUserByName(userName);
        if (!selectedUser) {
            throw new Error("User not found. Please log in first.");
        }
        const feed = await getFeedByUrl(feedUrl);
        if (!feed) {
            throw new Error(`Feed with URL ${feedUrl} not found.`);
        }
        const feedFollow = await createFeedFollow(selectedUser.id, feed.id);
    } catch (error) {
        throw new Error(`Error following feed: ${error}`);
    }
}