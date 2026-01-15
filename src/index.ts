import { setUser, readConfig } from "./config"

function main() {
  setUser("petshwark");
  const configJson = JSON.stringify(readConfig());
  if (configJson) {
    console.log('Configuration data:')
    console.log(configJson);
  } else {
    console.error('No configuration data read.')
  }
}

main();
