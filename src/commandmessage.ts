import {
  Message,
  MessageAdditions,
  MessageOptions,
  DMChannel,
} from "discord.js";
import { ReactionMenu, ReactionMenuOptions } from "./reactionmenu";
import { Command } from "./command";

type PromptOptions = {
  seconds?: number;
  filter?: (msg: CommandMessage) => boolean;
};

export class CommandMessage extends Message {
  static create(message: Message): CommandMessage {
    // Sketchy
    let proto = Object.getPrototypeOf(message);
    proto.say = CommandMessage.prototype.say;
    proto.createPrompt = CommandMessage.prototype.createPrompt;
    proto.createMenu = CommandMessage.prototype.createMenu;
    proto.prompt = CommandMessage.prototype.prompt;
    proto.promptReaction = CommandMessage.prototype.promptReaction;
    return message as CommandMessage;
  }

  async say(
    content: string,
    options?: MessageOptions | MessageAdditions
  ): Promise<CommandMessage> {
    let messages = await this.channel.send(content, options);
    let res: CommandMessage | CommandMessage[];
    if (Array.isArray(messages)) {
      res = CommandMessage.create(messages[0]);
    } else {
      res = CommandMessage.create(messages);
    }
    return res;
  }

  async createPrompt(options?: PromptOptions): Promise<CommandMessage | null> {
    const textFilter = (response: Message) => {
      // Cannot respond to your own prompt
      if (response.author.id === this.author.id) {
        return false;
      }
      if (options?.filter) {
        let commandMessage = CommandMessage.create(response);
        return options.filter(commandMessage);
      } else {
        return true;
      }
    };
    try {
      let messages = await this.channel.awaitMessages(textFilter, {
        max: 1,
        time: (options?.seconds ?? 60) * 1000,
      });
      const first = messages.first();
      if (!first) {
        return null;
      } else {
        return CommandMessage.create(first);
      }
    } catch (error) {
      return null;
    }
  }

  createMenu(emojis: string[], options?: ReactionMenuOptions) {
    let menu = new ReactionMenu(this, emojis, options);
    return menu;
  }

  async prompt(
    content: string,
    options?: PromptOptions
  ): Promise<string | null> {
    const msg = await this.say(content);
    let res = await msg.createPrompt({
      ...options,
      filter: (msg) => {
        if (msg.author.id !== this.author.id) return false;
        if (options?.filter) return options.filter(msg);
        return true;
      },
    });
    if (res === null) {
      return null;
    } else {
      return res.content;
    }
  }

  async promptReaction(
    message: string,
    reactions: string[],
    options?: {
      allowAnyone?: boolean;
      seconds?: number;
    }
  ): Promise<string | null> {
    const msg = await this.say(this.content);
    return new Promise<string | null>((res, rej) => {
      if (msg.channel instanceof DMChannel) {
        rej("Cannot create menu in DM channel");
      }
      const menu = new ReactionMenu(msg, reactions, {
        maxTotalReactions: 1,
        filter: (r, u) => (options?.allowAnyone ? true : u.id === this.id),
        seconds: options?.seconds,
      });
      menu.on("reaction", async (emoji) => {
        res(emoji);
      });
      menu.on("finish", async () => {
        res(null);
      });
    });
  }
}
