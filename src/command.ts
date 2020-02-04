import Discord from "discord.js";
import { Usage } from "./usage";
import { Client } from "./client";
import { ArgumentOptions, Argument } from "./argument";

export type CommandOptions = {
	name: string;
	description: string;
	group?: string;
	usage?: ArgumentOptions[];
	subcommands?: Command[];
	aliases?: string[];
	details?: string;
	examples?: [string, string][];
	ownerOnly?: boolean;
	hidden?: boolean;
};

export class Command {
	public readonly name: string;
	public readonly description: string;
	public readonly group: string;
	public readonly usage: Usage;
	public readonly subcommands?: Command[];
	public readonly aliases: string[];
	public readonly details: string;
	public readonly examples: [string, string][];
	public readonly ownerOnly: boolean;
	public readonly hidden: boolean;
	public parent?: Command;

	protected constructor(client: Client, options: CommandOptions) {
		this.name = options.name;
		this.description = options.description;
		this.usage = new Usage({
			args: options.usage?.map(a => new Argument(a)) ?? []
		});
		this.subcommands = options.subcommands;
		if (this.subcommands !== undefined) {
			this.subcommands.forEach(s => s.setParent(this));
		}
		this.group = options.group ?? "default";
		this.aliases = options.aliases ?? [];
		this.details = options.details ?? options.description;
		this.examples = options.examples ?? [];
		this.ownerOnly = options.ownerOnly ?? false;
		this.hidden = options.ownerOnly ?? false;
	}

	public execute(commandText: string, message: Discord.Message, client: Client): void {
		// Initial checks
		if (this.ownerOnly && message.member.id !== client.owner) {
			message.channel.send("This command can only be used by the owner");
			return;
		}

		let splits = commandText.split(" ");
		let args = splits.slice(1);

		// Subcommand
		if (this.subcommands !== undefined) {
			for (const sub of this.subcommands) {
				if (args.length > 0 && args[0] === sub.name || sub.name.includes(args[0])) {
					sub.execute(args.join(" "), message, client);
					return;
				}
			}
			message.channel.send("Please use one of `" + client.prefix + this.usageString() + "`.\n" +
			"(Use `" + client.prefix + "help " + this.getFullName() + "` for more details)");
		} else { // Normal commands
			let result = this.usage.match(args);
			if (result === null) {
				let messageText = "The correct usage is `" + client.prefix + this.usageString() + "`";
				if (this.examples.length > 0) {
					messageText += "\nExamples:\n";
					messageText += this.examples
						.map(s => "\t`" + client.prefix + s[0] + "` - " + s[1])
						.join("\n");
				}
				messageText += "\n(Use `" + client.prefix + "help " + this.getFullName() + "` for more details)";
				message.channel.send(messageText);
				return;
			}
			this.run(message, result, client);
		}
	}

	public async run(msg: Discord.Message, args: string[], client: Client): Promise<void> {
		throw "You must provide a 'run' method for this command class";
	}

	public getFullName(): string {
		if (this.parent === undefined) {
			return this.name;
		} else {
			return this.parent.getFullName() + " " + this.name;
		}
	}

	public usageString(): string {
		if (this.subcommands !== undefined) {
			return this.getFullName() + " " + this.subcommands.map(s => s.name).join("/");
		} else {
			return this.getFullName() + (" " + this.usage.toString()).trimRight();
		}
	}

	public setParent(command: Command) {
		this.parent = command;
	}
}
