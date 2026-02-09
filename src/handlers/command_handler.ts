import { handlerAgg } from "./handler_agg";
import { handlerFeeds } from "./handler_feeds";
import { handlerLogin } from "./handler_login";
import { handlerRegister } from "./handler_register";
import { handlerReset } from "./handler_reset";
import { handlerUsers } from "./handler_users";
import { handlerAddFeed } from "./handler_addfeed";
import { handleFollow } from "./handler_follow";
import { handleFollowing } from "./handler_following";
import { User } from "../lib/db/schema";
import { getUserByName } from "../lib/db/queries/users";
import { readConfig } from "../config";

export type CommandHandler = (cmdName: string, ...args: string[]) => Promise<void>;
export type UserCommandHandler = (cmdName: string, user: User, ...args: string[]) => Promise<void>;

export type CommandsRegistry = Record<string, CommandHandler>;

export function registerCommand(registry: CommandsRegistry, cmdName: string, handler: CommandHandler): void {
    registry[cmdName] = handler;
}

export async function runCommand(registry: CommandsRegistry, cmdName: string, ...args: string[]): Promise<void> {
    await registry[cmdName](cmdName, ...args);
}

function middlewareLoggedIn(handler: UserCommandHandler): CommandHandler {
    return async (cmdName: string, ...args: string[]) => {
        const config = readConfig();
        if (!config) {
            throw new Error("User not logged in. Please log in first.");
        }
        const userName = config.currentUserName;
        try {
            const selectedUser = await getUserByName(userName);
            if (!selectedUser) {
                throw new Error("User not found. Please log in first.");
            }
            await handler(cmdName, selectedUser, ...args);
        } catch (error) {
            throw new Error(`Error executing command ${cmdName}: ${error}`);
        }
    };
}

export function registerCommands(registry: CommandsRegistry): void {
    registerCommand(registry, 'login', handlerLogin);
    registerCommand(registry, 'register', handlerRegister);
    registerCommand(registry, 'reset', handlerReset);
    registerCommand(registry, 'users', handlerUsers);
    registerCommand(registry, 'agg', handlerAgg);
    registerCommand(registry, 'addfeed', middlewareLoggedIn(handlerAddFeed));
    registerCommand(registry, 'feeds', handlerFeeds);
    registerCommand(registry, 'follow', middlewareLoggedIn(handleFollow));
    registerCommand(registry, 'following', middlewareLoggedIn(handleFollowing));
}