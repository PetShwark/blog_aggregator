import { getPostsForUser } from "../lib/db/queries/posts";
import { User, Post } from "../lib/db/schema";

export async function handlerBrowse(cmdName: string, user: User, ...args: string[]) {
    var limit: number;
    if (args.length < 1) {
        limit = 2; // Default limit
    } else {
        limit = parseInt(args[0], 10);
    }
    if (isNaN(limit)) {
        limit = 2; // Fallback to default if parsing fails
    }
    console.log(`Fetching latest ${limit} posts for user ${user.name}...`);
    const postsList = await getPostsForUser(user.id, limit);
    if (postsList.length === 0) {
        console.log("No posts found for this user.");
        return;
    }
    postsList.forEach(post => {
        console.log(`Title: ${post.posts.title}`);
        console.log(`URL: ${post.posts.url}`);
        console.log(`Published At: ${post.posts.published_at}`);
        console.log(`Description: ${post.posts.description}`);
        console.log('---');
    });
}