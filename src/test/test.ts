import { Client } from "../";
import auth from "./auth.json";
import { Command } from "../command";
import { CommandGroup } from "../commandgroup";
import { Validator } from "../argument";
import { Message } from "discord.js";

class RandomCommand extends Command {
    constructor(client: Client) {
        super(client, {
            name: "random",
            description: "Generates a random number in a specified range",
            group: "fun",
            usage: [{
                name: "min",
                validator: Validator.Integer
            }, {
                name: "max",
                validator: Validator.Integer
            }]
        })
    }

    public async run(msg: Message, args: string[]) {
        let messageText = "";
        let min = parseInt(args[0], 10);
        let max = parseInt(args[1], 10);

        if (min > max) {
            messageText += "max must be equal to or greater than min";
        } else {
            let num = Math.floor(Math.random() * (max - min)) + min;
            messageText += msg.author.username + ", your randomly generated number is " + num;
        }
        msg.channel.send(messageText);
    }
}

class GitCommand extends Command {
    constructor(client: Client) {
        super(client, {
            name: "git",
            description: "It's like the real thing",
            group: "fun",
            subcommands: [
                new GitCloneCommand(client),
                new GitPushCommand(client),
            ]
        });
    }
}

class GitPushCommand extends Command {
    constructor(client: Client) {
        super(client, {
            name: "push",
            description: "Pushes things to the main repository"
        });
    }

    public async run(msg: Message, args: string[], client: Client) {
        msg.channel.send("You have successfully pushed your repository to the cloud");
    }
}

class GitCloneCommand extends Command {
    constructor(client: Client) {
        super(client, {
            name: "clone",
            description: "Clone things to your local repository",
            usage: [{
                name: "repo_name",
                multi: true
            }]
        });
    }

    public async run(msg: Message, args: string[], client: Client) {
        msg.channel.send("You have cloned '" + args[0] + "' to your local machine");
    }
}

class UserCommand extends Command {
    constructor(client: Client) {
        super(client, {
            name: "user",
            description: "Get a user",
            group: "fun",
            usage: [{
                name: "user",
                validator: Validator.User(client)
            }],
            examples: [
                ["user @Kevin", "Ping @Kevin"]
            ]
        });
    }

    public async run(msg: Message, args: string[], client: Client) {
        msg.channel.send(args.join(", "));
    }
}

class ChannelCommand extends Command {
    constructor(client: Client) {
        super(client, {
            name: "channel",
            description: "Get a channel",
            group: "fun",
            usage: [{
                name: "channel",
                validator: Validator.TextChannel(client)
            }]
        });
    }

    public async run(msg: Message, args: string[], client: Client) {
        msg.channel.send(args);
    }
}

const client = new Client({
    owner: "294169610679484417",
    prefix: "p.",
    token: auth.token,
    validator: (message, client) => {
        if (message.mentions.users.get(client.user.id) !== undefined) {
            message.channel.send("Please don't ping me in a command -_-")
            return false;
        }
        return true;
    }
});

client.registry.registerDefaults(client)
    .registerGroup(new CommandGroup({
        name: "fun",
        description: "For fun",
    }))
    .registerCommand(new RandomCommand(client))
    .registerCommand(new GitCommand(client))
    .registerCommand(new UserCommand(client))
    .registerCommand(new ChannelCommand(client));

client.start();