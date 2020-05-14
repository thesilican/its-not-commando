# It's Not Commando

## About
[Commando](https://github.com/discordjs/Commando) is the official command framework for [discord.js](https://github.com/discordjs/discord.js).
It is flexible, fully object-oriented, easy to use, and makes it trivial to create your own powerful commands.
Additionally, it makes full use of ES2017's `async`/`await` functionality for clear, concise code that is simple to write and easy to comprehend.

This repository, however, is not commando. It's Not Commando is a simple discord.js framework that is feature-light and
simple to use, yet has enough features to get what you want done

## Features
- Plain command names and aliases
- Parsing of arguments
- Sophisticated argument system
	* Type system with rules, automatic validation, and parsing to usable values
		- Basic types (string, integer, float, boolean)
		- Discord objects (user, member, role, channel, message)
		- User-defined custom types
		- Union types
	* Optional arguments with default values
    * Multi-arguments that take multiple split values
    * Support for sub-commands
- Built-in help, shutdown, and ping commands
- Easy to use!

## Installation
**Node 8.6.0 or newer is required.**  
`npm install its-not-commando`

## Basic Usage
First, create a file called `app.js` (or whatever you prefer) which will be used for the base.

To initiate a client, use this.
```js
const its-not-commando = require("its-not-commando");

const client = new its-not-commando.Client({
  ownerID : "your-user-id",
  prefix: ";",
});

client.login("your-bot-token-here");
```

This will initiate a bot client with the token that you include. 
You can change the prefix and the [ownerID](https://support.discord.com/hc/en-us/articles/206346498-Where-can-I-find-my-User-Server-Message-ID-).

## Documentation
