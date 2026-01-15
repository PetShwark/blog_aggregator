import os from 'os';
import fs from 'fs';

export type Config = {
    dbUrl: string;
    currentUserName: string;
};

export function setUser(userName: string): void {
    const configFilePath = getConfigFilePath();
    const configData: Config = {
        dbUrl: dbUrl(),
        currentUserName: userName,
    }
    const jsonString: string = JSON.stringify(configData, null, 2);
    try {
        fs.writeFileSync(configFilePath, jsonString);
    } catch (error) {
        console.error(`Unable to write config file (${configFilePath}): ${error}`)
    };
}

export function readConfig(): Config | undefined {
    const configPath = getConfigFilePath();
    let configOut: Config = {} as Config;
    try {
        let readFile = fs.readFileSync(configPath, 'utf-8');
        configOut = JSON.parse(readFile);
        return configOut;
    } catch (error) {
        console.error(`Unable to read config file (${configPath}): ${error}`);
    }
}

function getConfigFilePath(): string {
    const homeDir = os.homedir();
    return `${homeDir}/.gatorconfig.json`;
}

function dbUrl(): string {
    return "postgres://example";
}