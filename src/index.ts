import { argv } from "node:process";
import { readConfig } from "./config"
import { CommandsRegistry, registerCommand, runCommand } from "./command_handler"
import { handlerLogin } from "./handlerLogin";

function main() {
  if (argv.length < 3) {
    console.error(`No arguments passed to the command.`);
    process.exit(1);
  }
  const args = argv.slice(2);
  const commandName = args[0];
  const commandRegistry: CommandsRegistry = {};
  registerCommand(commandRegistry, 'login', handlerLogin);
  console.log('Registered commands.');
  try {
    runCommand(commandRegistry, commandName, ...args.slice(1));
    const configJson = JSON.stringify(readConfig());
    if (configJson) {
      console.log('Configuration data:')
      console.log(configJson);
    } else {
      console.error('No configuration data read.')
    }
  } catch {
    console.error(`Command "${commandName}" failed.`);
    process.exit(1);
  }
}

main();
