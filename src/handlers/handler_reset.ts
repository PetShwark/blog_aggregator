import { deleteUsers } from "../lib/db/queries/users";

export async function handlerReset(cmdName: string, ...args: string[]): Promise<void> {
    try {
        await deleteUsers();
        console.log('All users deleted successfully.');
    } catch (err) {
        console.error(`Failed to reset users: ${err}`);
        throw err;
    }
}