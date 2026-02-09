import { argv } from "node:process";
import { readConfig } from "./config"
import { CommandsRegistry, registerCommand, runCommand } from "./command_handler"
import { handlerLogin } from "./handler_login";
import { handlerRegister } from "./handler_register";
import { handlerReset } from "./handler_reset";
import { handlerUsers } from "./handler_users";
import { handlerAgg } from "./handler_agg";
import { handlerAddFeed } from "./handler_addfeed";

async function main() {
  if (argv.length < 3) {
    console.error(`No arguments passed to the command.`);
    process.exit(1);
  }
  const args = argv.slice(2);
  const commandName = args[0];
  const commandRegistry: CommandsRegistry = {};
  registerCommand(commandRegistry, 'login', handlerLogin);
  registerCommand(commandRegistry, 'register', handlerRegister);
  registerCommand(commandRegistry, 'reset', handlerReset);
  registerCommand(commandRegistry, 'users', handlerUsers);
  registerCommand(commandRegistry, 'agg', handlerAgg);
  registerCommand(commandRegistry, 'addfeed', handlerAddFeed);
  console.log('Registered commands.');
  try {
    await runCommand(commandRegistry, commandName, ...args.slice(1));
    const configJson = JSON.stringify(readConfig());
    // if (configJson) {
    //   console.log('Configuration data:')
    //   console.log(configJson);
    // } else {
    //   console.error('No configuration data read.')
    // }
  } catch (err) {
    console.error(`Command "${commandName}" failed: ${err}`);
    process.exit(1);
  }
  process.exit(0);
}

main();
