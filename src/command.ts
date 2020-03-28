import { CommandBase, CommandBaseOptions } from "./commandbase";
import { Client } from "./client";
import { CommandMessage } from "./commandmessage";
import { DMChannel } from "discord.js";

export type CommandOptions = CommandBaseOptions & {
    group?: string,
    ownerOnly?: boolean,
    dmAllowed?: boolean,
    hidden?: boolean
}

export abstract class Command extends CommandBase {
    group: string;
    ownerOnly: boolean;
    dmAllowed: boolean;
    hidden: boolean;

    constructor(options: CommandOptions) {
        super(options);
        this.group = options.group ?? "default";
        this.ownerOnly = options.ownerOnly ?? false;
        this.dmAllowed = options.dmAllowed ?? false;
        this.hidden = options.hidden ?? false;
    }

    public execute(commandText: string, msg: CommandMessage, client: Client): boolean {
        if (this.ownerOnly && msg.author.id !== client.owner) {
            msg.say("This command may only be used by the owner");
            return false;
        }
        if (!this.dmAllowed && msg.channel instanceof DMChannel) {
            msg.say("This command may not be used in DMs");
            return false;
        }
        return super.execute(commandText, msg, client);
    }

    public fullName(): string {
        return this.name;
    }
}