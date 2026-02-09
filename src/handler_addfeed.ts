import { createFeed } from "./lib/db/queries/feeds.js";
import { Feed, User } from "./lib/db/schema.js";
import { getUserByName } from "./lib/db/queries/users.js";
import { readConfig } from "./config.js";

export function printFeed(feed: Feed, user: User): void {
    console.log(`Feed: ${feed.name} (${feed.url}) - User: ${user.name}`);
}

export async function handlerAddFeed(cmdName: string, ...args: string[]): Promise<void> {
    if (args.length < 2) {
        throw new Error("Usage: addfeed <feed_name> <feed_url>");
    }
    try {
        const feedName = args[0];
        const feedURL = args[1];
        const config = readConfig();
        if (!config) {
            throw new Error("Failed to read config");
        }
        const currentUserName = config.currentUserName;
        if (!currentUserName) {
            throw new Error("No current user set in config");
        }
        const user = await getUserByName(currentUserName);
        if (!user) {
            throw new Error(`User not found: ${currentUserName}`);
        }
        const userId = user.id;
        const feed = await createFeed(feedURL, feedName, userId);
        printFeed(feed, user);
    } catch (err) {
        console.error(`Failed to add feed: ${err}`);
        throw err;
    }
}