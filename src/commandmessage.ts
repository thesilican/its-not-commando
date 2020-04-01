import { Message, MessageOptions, RichEmbed, Attachment, CollectorFilter } from "discord.js";
import { ReactionMenu, ReactionMenuCallback, ReactionMenuOptions } from "./reactionmenu";

export class CommandMessage extends Message {
    static create(message: Message): CommandMessage {
        // Sketchy
        let proto = Object.getPrototypeOf(message);
        proto.say = CommandMessage.prototype.say;
        proto.prompt = CommandMessage.prototype.prompt;
        proto.promptText = CommandMessage.prototype.promptText;
        proto.createMenu = CommandMessage.prototype.createMenu;
        return message as CommandMessage;
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

    async prompt(userID: string, filter?: (msg: CommandMessage) => boolean, options?: { seconds?: number }): Promise<CommandMessage | null> {
        const textFilter = (response: Message) => {
            if (response.author.id !== userID) {
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
                return CommandMessage.create(messages.first());
            }
        } catch (error) {
            return null;
        }
    }

    async promptText(content: string, filter?: (msg: CommandMessage) => boolean, options?: { seconds?: number }): Promise<string | null> {
        let res = await (await this.say(content)).prompt(this.author.id, filter, options);
        if (res === null) {
            return null;
        } else {
            return res.content;
        }
    }

    createMenu(emojis: string[], onReaction: ReactionMenuCallback, options?: ReactionMenuOptions) {
        let menu = new ReactionMenu(this, emojis, onReaction, options);
        menu.start();
        return menu;
    }
}
