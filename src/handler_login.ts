import { setUser } from "./config";
import { getUserByName } from "./lib/db/queries/users";


export async function handlerLogin(cmdName: string, ...args: string[]): Promise<void> {
    if (args.length === 0) {
        throw new Error('Login name parameter is missing.');
    }
    const userName = args[0];
    try {
        const existingUser = await getUserByName(userName);
        if (!existingUser) {
            throw new Error(`User with name ${userName} does not exist.`);
        }
        setUser(userName);
        console.log(`User name set to ${userName}`);
    } catch (err) {
        console.error(`Failed to login user ${userName}: ${err}`);
        throw err;
    }
}
