import { getFeedsWithUserNames } from "../lib/db/queries/feeds";

export async function handlerFeeds(cmdName: string, ...args: string[]): Promise<void> {
    try {
        const feeds = await getFeedsWithUserNames();
        feeds.forEach((feed) => {
            console.log(`Feed: "${feed.feeds.name}" (${feed.feeds.url}), added by user ${feed.users.name}`);
        });
    } catch (err) {
        console.error(`Failed to list feeds: ${err}`);
        throw err;
    }
}