import { Command } from "../../command";
import Discord from "discord.js";
import { Client } from "../../client";

export class PingCommand extends Command {
	private static readonly PONG_REPLIES = [
		"Pong!",
		"Yes, I'm still alive",
		"What's up, {}?",
		"Hwwapinggg!",
	];

	constructor() {
		super({
			name: "ping",
			group: "util",
			description: "Check if the bot is alive",
			details: "Ping the bot to check if the bot is still alive",
			dmAllowed: true
		});
	}

	public async run(msg: Discord.Message): Promise<void> {
		let random = Math.floor(Math.random() * PingCommand.PONG_REPLIES.length);
		let reply = PingCommand.PONG_REPLIES[random].replace(
			/\{\}/,
			msg.author.username
		);
		msg.channel.send(reply);
	}
}
