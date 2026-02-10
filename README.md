# GATOR - An RSS feed aggregator guided project for Boot.dev course entitled "Build a Blog Aggregator in TypeScript"

## Prerequisites

- NVM
    - For installing Node.js and NPM
    - Version specified in .nvmrc file
- TypeScript
- PostgreSQL
    - Create a blank database named 'gator'

## Configuration file

The GATOR RSS feed aggregator system uses a configuration file named ".gatorconfig.json" in the users's home directory.  The structure of the file is as follows.

```
{
    "dbUrl": <PostgreSQL connection string (e.g. postgres://username:@localhost:5432/gator?sslmode=disable)>,
    "currentUserName": <the name of the currently logged-in user (created by the system)>,
}
```

## GATOR commands

Run them with the command:

```shell
npm run start <command_name> <arguments>
```

- addfeed
    - arguments
        - feed name: string
        - feed URL: string
    - Notes
        - Needs to have a logged in user to work
- agg
    - arguments
        - interval specifier: (e.g. 1m, 2s, 3h, 100ms; only 'ms', 's', 'm', 'h' valid)
    - Notes
        - Needs to have a logged in user to work
- browse
    - arguments
        - number of items to list: string parseable as a number
    - Notes
        - Needs to have a logged in user to work
- feeds
    - arguments
        - NONE
    - Notes
        - Needs to have a logged in user to work
- follow
    - arguments
        - feed URL: string
    - Notes
        - Needs to have a logged in user to work
- following
    - arguments
        - NONE
- login
    - arguments
        - user name: string
    - Notes
        - The user named needs have have been previously registered with the 'register' command
- register
    - arguments
        - user name: string
    - Notes
        - Registering a user also logs them in
        - No duplicates can be registered
- reset
    - arguments
        - NONE
    - Notes
        - Wipes all the database tables to have a fresh start
- unfollow
    - arguments
        - feed URL: string
    - Notes
        - Removes the RSS feed from the logged in user's followed list
- users
    - arguments
        - NONE
    - Notes
        - Lists all the users knows to the GATOR system
        - Indicates which user is currently logged in
