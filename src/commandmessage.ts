import { Message, MessageOptions, RichEmbed, Attachment, CollectorFilter } from "discord.js";
import { ReactionMenu, ReactionMenuCallback, ReactionMenuOptions } from "./reactionmenu";

export class CommandMessage extends Message {
    static create(message: Message): CommandMessage {
        let commandMessage = Object.create(CommandMessage.prototype);
        Object.assign(commandMessage, message);
        return commandMessage;
    }

    async say(content: string, options?: MessageOptions | RichEmbed | Attachment): Promise<CommandMessage> {
        let messages = await this.channel.send(content, options);
        let res: CommandMessage | CommandMessage[];
        if (Array.isArray(messages)) {
            res = CommandMessage.create(messages[0]);
        } else {
            res = CommandMessage.create(messages);
        }
        return res;
    }

    async prompt(content: string, filter?: (msg: CommandMessage) => boolean, options?: { seconds?: number }): Promise<string | null> {
        this.say(content);
        const textFilter = (response: Message) => {
            if (response.author.id !== this.author.id) {
                return false;
            }
            if (filter) {
                let commandMessage = CommandMessage.create(response);
                return filter(commandMessage);
            } else {
                return true;
            }
        };
        try {
            let messages = await this.channel.awaitMessages(textFilter, {
                maxMatches: 1,
                time: (options?.seconds ?? 60) * 1000
            });
            if (!messages.first()) {
                return null;
            } else {
                return messages.first().content;
            }
        } catch (error) {
            return null;
        }
    }

    createMenu(emojis: string[], onReaction: ReactionMenuCallback, options?: ReactionMenuOptions) {
        let menu = new ReactionMenu(this, emojis, onReaction, options);
        menu.start();
        return menu;
    }
}
