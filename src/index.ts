import { argv } from "node:process";
import { readConfig } from "./config"
import { CommandsRegistry, registerCommands, runCommand } from "./handlers/command_handler"

async function main() {
  if (argv.length < 3) {
    console.error(`No arguments passed to the command.`);
    process.exit(1);
  }
  const args = argv.slice(2);
  const commandName = args[0];
  const commandRegistry: CommandsRegistry = {};
  registerCommands(commandRegistry);
  try {
    await runCommand(commandRegistry, commandName, ...args.slice(1));
    const configJson = JSON.stringify(readConfig());
  } catch (err) {
    console.error(`Command "${commandName}" failed: ${err}`);
    process.exit(1);
  }
  process.exit(0);
}

main();
