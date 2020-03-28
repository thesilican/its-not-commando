import { CommandMessage } from "./commandmessage";
import { MessageReaction, User } from "discord.js";

export type ReactionMenuCallback = (reaction: MessageReaction, message: CommandMessage) => Promise<void>;

export type ReactionMenuOptions = {
    seconds?: number
}

export class ReactionMenu {
    message: CommandMessage;
    timespan: number
    emojis: string[];
    onReaction: ReactionMenuCallback;

    constructor(message: CommandMessage, emojis: string[], onReaction: ReactionMenuCallback, options: ReactionMenuOptions | undefined) {
        this.message = message;
        this.emojis = emojis;
        this.onReaction = onReaction;
        this.timespan = (options?.seconds ?? 60) * 1000;
    }

    async start() {
        const filter = (reaction: MessageReaction, user: User) => this.emojis.includes(reaction.emoji.name) && user.bot === false;

        let loop = true;
        while (loop) {
            try {
                let messageReactions = await this.message.awaitReactions(filter, { max: 1, time: this.timespan });
                let reaction = messageReactions.first();
                await this.onReaction(reaction, this.message);
            } catch (error) {
                loop = false;
            }
        }
    }
}