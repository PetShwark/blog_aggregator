import { handlerAgg } from "./handler_agg";
import { handlerFeeds } from "./handler_feeds";
import { handlerLogin } from "./handler_login";
import { handlerRegister } from "./handler_register";
import { handlerReset } from "./handler_reset";
import { handlerUsers } from "./handler_users";
import { handlerAddFeed } from "./handler_addfeed";

export type CommandHandler = (cmdName: string, ...args: string[]) => Promise<void>;

export type CommandsRegistry = Record<string, CommandHandler>;

export function registerCommand(registry: CommandsRegistry, cmdName: string, handler: CommandHandler): void {
    registry[cmdName] = handler;
}

export async function runCommand(registry: CommandsRegistry, cmdName: string, ...args: string[]): Promise<void> {
    await registry[cmdName](cmdName, ...args);
}

export function registerCommands(registry: CommandsRegistry): void {
    registerCommand(registry, 'login', handlerLogin);
    registerCommand(registry, 'register', handlerRegister);
    registerCommand(registry, 'reset', handlerReset);
    registerCommand(registry, 'users', handlerUsers);
    registerCommand(registry, 'agg', handlerAgg);
    registerCommand(registry, 'addfeed', handlerAddFeed);
    registerCommand(registry, 'feeds', handlerFeeds);
}