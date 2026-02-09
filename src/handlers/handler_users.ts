import { getUsers } from "../lib/db/queries/users";
import { readConfig } from "../config";

export async function handlerUsers(cmdName: string, ...args: string[]): Promise<void> {
    try {
        const configJson = readConfig();
        var loggedInUser: string = "";
        if (configJson) {
            loggedInUser = configJson.currentUserName;
        }
        const users = await getUsers();
        if (users.length === 0) {
            console.log('No users found.');
        } else {
            console.log('Users:');
            users.forEach(user => {
                if (user.name === loggedInUser) {
                    console.log(`* ${user.name} (current)`);
                } else {
                    console.log(`* ${user.name}`);
                }
            });
        }
    } catch (err) {
        console.error(`Failed to retrieve users: ${err}`);
        throw err;
    }
}