import { Command } from "../../command";
import { Client } from "../../client";
import Discord from "discord.js";

export class ShutdownCommand extends Command {
	constructor(client: Client) {
		super(client, {
			name: "shutdown",
			description: "Shutdown the bot",
			group: "util",
			ownerOnly: true,
			details: "Gracefully shuts down the bot. This will make the bot offline!",	
		});
	}

	public async run(msg: Discord.Message, args: string[], client: Client): Promise<void> {
		await msg.channel.send("Shutting down bot...");
		client.stop();
	}
}
