import { Command } from "../../command";
import { Client } from "../../client";
import Discord from "discord.js";
import { Validator } from "../../argument";

export class HelpCommand extends Command {
	constructor(client: Client) {
		super(client, {
			name: "help",
			// aliases: ["wtf"], // lol
			usage: [{
				name: "command",
				multi: true,
				optional: true
			}],
			description: "List all the available commands, or get help for a particular command",
			group: "util",
			examples: [
				["help", "List out all the help commands"],
				["help ping", "Get specific help text for the `ping` command"]
			],
		});
	}

	public async run(msg: Discord.Message, args: string[], client: Client): Promise<void> {
		let messageText = "";
		if (args[0] === undefined) {
			// General help
			messageText += "**" + client.user.username + " Commands**\n";
			messageText += "(Use `" + client.prefix + "help [command]` for more info on a single command)\n";
			let groupFound = false;
			for (const group of client.registry.groups) {
				groupFound = false;
				for (const command of client.registry.commands) {
					// Check name & ensure proper permissions
					if (command.group === group.name &&
						(!command.ownerOnly || client.owner === msg.member.id)) {
						if (!groupFound) {
							messageText += "__" + group.displayName + "__\n";
							groupFound = true;
						}
						messageText += "  `" + client.prefix + command.name + "`";
						messageText += " - " + command.description;
						if (command.ownerOnly) {
							messageText += " (!)";
						}
						messageText += "\n";
					}
				}
			}
		} else {
			// Help for a specific command
			let command = client.registry.getCommand(args[0]);
			let group = client.registry.getGroup(args[0]);
			if (command !== null) {
				messageText += "`" + client.prefix + command.name + "`:";
				messageText += " " + command.description;
				if (command.aliases.length > 0) {
					messageText +=
						"\n\n**Aliases**: " +
						command.aliases.map(a => "`" + client.prefix + a + "`").join(", ");
				}
				// TODO: Change usages[0] to something that actually prints all usages
				messageText += "\n\n**Usage:**: `" + client.prefix + command.usageString() + "`";
				if (command.examples.length > 0) {
					messageText += "\n\n**Examples:**\n" +
						command.examples.map(e => "\t`" + client.prefix + e[0] + "` - " + e[1]).join("\n");
				}
			} else if (group !== null) {
				messageText += group.displayName + " commands:";
				messageText += "    " + group.description;
			}
			else {
				messageText += "Could not find command or command group `" + args[0] + "`";
			}
		}

		msg.channel.send(messageText);
	}
}
