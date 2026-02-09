import { createUser, getUserByName } from "../lib/db/queries/users";
import { setUser } from "../config";

export async function handlerRegister(cmdName: string, ...args: string[]): Promise<void> {
    if (args.length === 0) {
        throw new Error('Login name parameter is missing.');
    }
    const userName = args[0];
    try {
        const existingUser = await getUserByName(userName);
        if (existingUser) {
            throw new Error(`User with name ${userName} already exists.`);
        }
        const user = await createUser(userName);
        setUser(userName);
        console.log(`User created with name ${userName} and id ${user.id}`);
    } catch (err) {
        console.error(`Failed to create user ${userName}: ${err}`);
        throw err;
    }
}