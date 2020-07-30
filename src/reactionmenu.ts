import { MessageReaction, User, Message } from "discord.js";
import { CommandMessage } from "./commandmessage";

export type ReactionMenuCallback = (
  emoji: string,
  user: User,
  reaction: MessageReaction,
  message: Message
) => Promise<boolean | void>;
export type ReactionMenuFinish = (message: CommandMessage) => Promise<void>;
export type ReactionFilter = (reaction: MessageReaction, user: User) => boolean;

export type ReactionMenuOptions = {
  seconds?: number;
  maxTotalReactions?: number;
  noStart?: boolean;
  filter?: ReactionFilter;
};

export type ReactionEvent = "reaction" | "finish";

export class ReactionMenu {
  message: CommandMessage;
  emojis: string[];
  seconds: number;
  numReactions?: number;
  filter?: ReactionFilter;
  reactionCallback: ReactionMenuCallback;
  finishCallback: ReactionMenuFinish;

  constructor(
    message: CommandMessage,
    emojis: string[],
    options?: ReactionMenuOptions
  ) {
    this.message = message;
    this.emojis = emojis;
    this.seconds = options?.seconds ?? 60;
    this.numReactions = options?.maxTotalReactions;
    this.filter = options?.filter;
    this.reactionCallback = async () => {};
    this.finishCallback = async () => {};
    if (!options?.noStart) {
      this.start();
    }
  }

  async start() {
    const filter = (reaction: MessageReaction, user: User) => {
      return (
        this.emojis.includes(reaction.emoji.name) &&
        user.bot === false &&
        (!this.filter || this.filter(reaction, user))
      );
    };

    try {
      await this.message.reactions.removeAll();
      for (let i = 0; i < this.emojis.length; i++) {
        await this.message.react(this.emojis[i]);
      }
    } catch {
      throw new Error("Unable to perform reaction menu in DM channel");
    }

    for (let i = 0; i < (this.numReactions ?? Infinity); i++) {
      try {
        const reactions = await this.message.awaitReactions(filter, {
          max: 1,
          time: this.seconds * 1000,
        });
        const reaction = reactions.first();
        if (!reaction) break;
        const user = (await reaction.users.fetch())
          .filter((u) => u.id !== this.message.author.id)
          .first();
        if (!user) continue;
        // Run callback
        const res = await this.reactionCallback(
          reaction.emoji.toString(),
          user,
          reaction,
          reaction.message
        );
        if (res) break;

        // Remove reactions
        reaction.users.remove(user);
      } catch (error) {
        break;
      }
    }
    this.finishCallback(this.message);
  }

  on(type: "reaction", callback: ReactionMenuCallback): this;
  on(type: "finish", callback: ReactionMenuFinish): this;
  on(
    type: ReactionEvent,
    callback: ReactionMenuCallback | ReactionMenuFinish
  ): this {
    if (type === "reaction") {
      this.reactionCallback = callback as ReactionMenuCallback;
    } else if (type === "finish") {
      this.finishCallback = callback as ReactionMenuFinish;
    }
    return this;
  }
}
