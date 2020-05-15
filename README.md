# It's Not Commando

## About

[Commando](https://github.com/discordjs/Commando) is the official command framework for [discord.js](https://github.com/discordjs/discord.js).
It is flexible, fully object-oriented, easy to use, and makes it trivial to create your own powerful commands.
Additionally, it makes full use of ES2017's `async`/`await` functionality for clear, concise code that is simple to write and easy to comprehend.

This repository, however, is not commando. It's Not Commando is a simple discord.js framework that is feature-light and
simple to use, yet has enough features to get what you want done. In terms of design, it's pretty similar to commando.

## Features

- Plain command names and aliases
- Parsing of arguments
- Sophisticated argument system
  _ Type system with rules, automatic validation, and parsing to usable values - Basic types (string, integer, float, boolean) - Discord objects (user, member, role, channel, message) - User-defined custom types - Union types
  _ Optional arguments with default values
  - Multi-arguments that take multiple split values
  - Support for sub-commands
- Built-in help, shutdown, and ping commands
- Easy to use!

## Installation

**Node 8.6.0 or newer is required.**  
`npm install its-not-commando`

# Getting Started

Note: this project makes use of **typescript**, and **ES6 features**. You should use typescript too.

To initiate a client, use the following code:

```ts
import { Client } from "its-not-commando";
// Import the commands you are using.
import { SayHelloCommand } from "./SayHellocommand";
import { GitCommand } from "./GitCommand";

const client = new Client({
  owner: "your-user-id-here",
  prefix: "+", // Or whatever else you want.
  token: "your-bot-token-here",
});

// Register any used command groups here.
client.registry.registerGroup({
  name: "fun",
  description: "Fun commands to try",
});

// Register any commands used here.
client.registry.registerCommand(SayHelloCommand);
client.registry.registerCommand(GitCommand);

client.start();
```

This will initiate a bot client with the token that you include.
You can change the bot prefix and the [ownerID](https://support.discord.com/hc/en-us/articles/206346498-Where-can-I-find-my-User-Server-Message-ID-).

## Creating Command Groups

Commands are grouped into "command groups".

By default, there is already one group called the "util" group,
which is used by the built in `Help`, `Ping`, and `Shutdown` commands.

Add groups like this:

```ts
client.registry.registerGroup({
  name: "fun",
  description: "Fun commands to try",
});

client.registry.registerGroup({
  name: "money",
  description: "Commands related to money",
});
```

## Using Commands

A command is an ES6 `class` that inherits the `Command` or `SubCommand` classes.

Example:

```ts
import { Command, Client, CommandMessage } from "its-not-commando";

class SayHelloCommand extends Command {
  constructor() {
    super({
      name: "hello",
      aliases: ["h"],
      group: "fun",
      description: "Say hello",
    });
  }

  public async run(msg: CommandMessage, args: string[], client: Client) {
    msg.say("Hello World!");
  }
}
```

Then, you can register the command with the client.

```ts
client.registry.registerCommand(SayHelloCommand);
```

By default, the registry automatically will register the `Help`, `Ping`, and `Shutdown` commands which are included

You can then run your command in discord by typing
`+hello` or `+h` (alias).

### Arguments

You can add command line arguments to your commands with a `usage` option.

```ts
import { Command, CommandMessage, Client, Validator } from "its-not-commando";

class IsThirteenCommand extends Command {
  constructor() {
    super({
      name: "isthirteen",
      aliases: ["is13"],
      group: "fun",
      description: "Check if a number is 13",
      usage: [
        {
          name: "number",
          validator: Validator.Integer,
        },
      ],
    });
  }

  public async run(msg: CommandMessage, args: string[], client: Client) {
    const num = parseInt(args[0], 10);
    if (num === 13) {
      msg.say("Yay, your number is 13");
    } else {
      msg.say("Nope your number is not 13");
    }
  }
}
```

For arguments, there are various different validators for String (default validator, always returns true), Integers, Floats, Users (Discord @username), Channels (Discord #channel), Roles (Discord @Role), and others.

In discord:

- `+isthirteen 13` (`Yay, your number is 13`)
- `+is13 13` (`Yay, your number is 13`)
- `+isthirteen 17` (`Nope your number is not 13`)
- `+isthirteen Kevin` (`Incorrect command usage. The proper usage is ...`)

You can have multiple command arguments, some of which are optional. Optional arguments must come after non-optional arguments.

```ts
import { Command, CommandMessage, Client, Validator } from "its-not-commando";

class IsThirteenCommand extends Command {
  constructor() {
    super({
      name: "isthirteen",
      aliases: ["is13"],
      group: "fun",
      description: "Check if a number is 13",
      usage: [
        {
          name: "number",
          validator: Validator.Integer,
        },
        {
          name: "fuzzy",
          validator: Validator.OneOf(["yes", "no"]),
          optional: true,
          defaultValue: "no",
        },
      ],
    });
  }

  public async run(msg: CommandMessage, args: string[], client: Client) {
    const num = parseInt(args[0], 10);
    const fuzzy = args[1];
    if (num === 13) {
      msg.say("Yay, your number is 13");
    } else {
      if (fuzzy === "yes" && 11 < num && 15 > num) {
        msg.say("Yay, your number is 13");
      }
      msg.say("Nope your number is not 13");
    }
  }
}
```

### Subcommands

Subcommands are the only reason I created this library. A subcommand is a command that is contained by other commands.

For example, if you are familiar with the `git` command in linux, `git` is a command and `git add`, `git commit` are subcommands.

Example:

```ts
import { Command, CommandMessage, Client, Validator } from "its-not-commando";

class GitCommand extends Command {
  constructor() {
    super({
      name: "git",
      aliases: [],
      group: "util",
      description: "Commands related to git",
      subCommands: [GitAddSubCommand, GitCommitSubCommand],
    });
  }

  // The run() function is not necessary if subcommands are used
}

class GitAddSubCommand extends SubCommand {
  constructor() {
    super({
      name: "add",
      description: "Adds file to the git stage",
    });
  }

  public async run(msg: CommandMessage, args: string[], client: Client) {
    msg.say("Adding kevin.txt to the git stage");
  }
}

class GitCommitSubCommand extends SubCommand {
  constructor() {
    super({
      name: "commit",
      description: "Commit files to your repository",
      usage: [
        {
          name: "commit_message",
          optional: true,
          defaultValue: "Changed some files",
        },
      ],
    });
  }

  public async run(msg: CommandMessage, args: string[], client: Client) {
    msg.say(args[0] + ": kevin.txt");
  }
}
```

## More Documentation

Maybe later, [you can help with documentation! (typescript knowledge required)](https://github.com/MrSiliconGuy/its-not-commando/tree/master/src)
