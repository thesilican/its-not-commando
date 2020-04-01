import { CommandMessage } from "./commandmessage";
import { MessageReaction, User, DMChannel } from "discord.js";

export type ReactionMenuCallback = (reaction: MessageReaction, message: CommandMessage) => Promise<boolean>;

export type ReactionMenuTimeout = (message: CommandMessage) => Promise<void>;

export type ReactionMenuOptions = {
    seconds?: number;
    onTimeout?: ReactionMenuTimeout;
}

export class ReactionMenu {
    message: CommandMessage;
    timespan: number
    emojis: string[];
    onReaction: ReactionMenuCallback;
    onTimeout?: ReactionMenuTimeout;

    constructor(message: CommandMessage, emojis: string[], onReaction: ReactionMenuCallback, options: ReactionMenuOptions | undefined) {
        this.message = message;
        this.emojis = emojis;
        this.onReaction = onReaction;
        this.timespan = (options?.seconds ?? 60) * 1000;
        this.onTimeout = options?.onTimeout;

        // Verification
        if (this.message.channel instanceof DMChannel) {
            throw "Reaction menus cannot be used in DMs";
        }
    }

    async start() {
        const filter = (reaction: MessageReaction, user: User) => this.emojis.includes(reaction.emoji.name) && user.bot === false;

        let loop = true;
        for (let i = 0; i < this.emojis.length; i++) {
            await this.message.react(this.emojis[i]);
        }
        while (loop) {
            try {
                let messageReactions = await this.message.awaitReactions(filter, { max: 1, time: this.timespan });
                let reaction = messageReactions.first();

                let user = reaction.users.filter(u => u.id !== this.message.client.user.id).first();
                await reaction.remove(user);
                loop = await this.onReaction(reaction, this.message);
            } catch (error) {
                console.log(error);
                loop = false;
            }
        }
        if (this.onTimeout) {
            this.onTimeout(this.message);
        }
    }
}