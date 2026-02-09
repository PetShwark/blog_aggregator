import { getFeedFollowsForUser } from "../lib/db/queries/feed_follows";
import { User } from "src/lib/db/schema";

export async function handleFollowing(cmdName: string, user: User, ...args: string[]) {
    // Don't need arguments
    try {
        console.log(`Feeds followed by ${user.name}:`);
        const feedFollows = await getFeedFollowsForUser(user.id);
        if (feedFollows.length === 0) {
            console.log("No followed feeds found.");
        } else {
            feedFollows.forEach((feedFollow) => {
                console.log(`- ${feedFollow.feeds.name} (${feedFollow.feeds.url})`);
            });
        }
    } catch (error) {
        throw new Error(`Error fetching followed feeds: ${error}`);
    }
}