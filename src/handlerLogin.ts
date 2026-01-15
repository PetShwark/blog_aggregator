import { setUser } from "./config";


export function handlerLogin(cmdName: string, ...args: string[]): void {
    if (args.length === 0) {
        throw new Error('Login name parameter is missing.');
    }
    const userName = args[0];
    setUser(userName);
    console.log(`User name set to ${userName}`);
}
