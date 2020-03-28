import { Command, CommandMessage, Client } from "../";
import { SubCommand } from "../subcommand";
import { Validator } from "../validators";
import { TextChannel } from 'discord.js';

export default class TestCommand extends Command {
    constructor() {
        super({
            name: "test",
            aliases: ["t"],
            group: "util",
            description: "Testing out commando",
            subcommands: [PrefixSubCommand, ValidatorSubCommand],
            dmAllowed: true
        });
    }

    public async run(msg: CommandMessage, args: string[], client: Client) {
        msg.say("Hello!");
    }
}

class PrefixSubCommand extends SubCommand {
    constructor() {
        super({
            name: "prefix",
            description: "Displays the client prefix"
        })
    }

    public async run(msg: CommandMessage, args: string[], client: Client) {
        msg.say("The prefix is " + client.prefix);
    }
}

class ValidatorSubCommand extends SubCommand {
    constructor() {
        super({
            name: "validator",
            aliases: ["v", "val"],
            description: "Options for command validation",
            details: "Options for command validation. Epic!",
            examples: [
                ["test validator channel #general", "Get info for the general channel"],
                ["test validator user @MrSiliconGuy", "Get info about MrSiliconGuy"]
            ],
            subcommands: [ChannelValidatorCommand, UserValidationCommand, NumberValidationCommand]
        })
    }
}

class ChannelValidatorCommand extends SubCommand {
    constructor() {
        super({
            name: "channel",
            aliases: ["ch"],
            usage: [{
                name: "channel",
                validator: Validator.Channel
            }],
            description: "Options for channel validation",
            details: "Options for channel validation. Yay!",
            examples: [
                ["test val channel #general", "Get info for the general channel"]
            ]
        })
    }

    public async run(msg: CommandMessage, args: string[], client: Client) {
        console.log(args[0]);
        let textChannel = client.channels.get(args[0]);
        if (textChannel instanceof TextChannel) {
            let messageText = "Info about `#" + textChannel.name + "`\n";
            messageText += "\tID: `" + textChannel.id + "`\n";
            messageText += "\tGuild: `" + textChannel.guild.name + "`\n";
            messageText += "\tTopic: `" + textChannel.topic + " `\n";
            messageText += "\tNSFW? `" + textChannel.nsfw + "`\n";
            msg.say(messageText);
        } else {
            msg.say("That is not a valid text channel.")
        }
    }
}

class UserValidationCommand extends SubCommand {
    constructor() {
        super({
            name: "user",
            aliases: ["us"],
            usage: [{
                name: "user",
                validator: Validator.User
            }],
            description: "Options for channel validation",
            details: "Options for channel validation. Yay!",
            examples: [
                ["test val channel @MrSiliconGuy", "Get info for MrSiliconGuy"]
            ]
        })
    }

    public async run(msg: CommandMessage, args: string[], client: Client) {
        let user = client.users.get(args[0]);
        if (user) {
            let messageText = "Info about `#" + user.username + "`\n";
            messageText += "\tID: `" + user.id + "`\n";
            messageText += "\tTag: `" + user.tag + "`\n";
            messageText += "\tStatus: `" + user.presence.status + "`\n";
            messageText += "\tGame: `" + user.presence.game + "`\n";
            messageText += "\tDate created: `" + user.createdAt.toISOString() + "`\n";
            msg.say(messageText);
        } else {
            msg.say("Could not find user")
        }
    }
}

class NumberValidationCommand extends SubCommand {
    constructor() {
        super({
            name: "number",
            aliases: ["num"],
            usage: [{
                name: "0-100",
                multi: true,
                validator: Validator.IntegerRange(0, 100)
            }],
            description: "Number validation"
        })
    }

    public async run(msg: CommandMessage, args: string[], client: Client) {
        msg.say((parseFloat(args[0]) / 9 * 3).toFixed(100));
    }
}