import { getUserByName } from "../lib/db/queries/users";
import { readConfig } from "../config";
import { getFeedFollowsForUser } from "../lib/db/queries/feed_follows";

export async function handleFollowing(cmdName: string, ...args: string[]) {
    // Don't need arguments
    try {
        const config = readConfig();
        if (!config) {
            throw new Error("User not logged in. Please log in first.");
        }
        const userName = config.currentUserName;
        const selectedUser = await getUserByName(userName);
        if (!selectedUser) {
            throw new Error("User not found. Please log in first.");
        }
        console.log(`Feeds followed by ${userName}:`);
        const feedFollows = await getFeedFollowsForUser(selectedUser.id);
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