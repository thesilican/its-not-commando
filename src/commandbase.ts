import { Client } from "./client";
import { CommandMessage } from "./commandmessage";
import { RateLimitController, RateLimitOptions } from "./ratelimitcontroller";
import { SubCommand } from "./subcommand";
import { Usage, UsageOptions } from "./usage";

type SubCommandClass = { new (): SubCommand };

type CommandHelpInfo = {
  description: string;
  details: string;
  examples: [string, string][];
};

export type CommandBaseOptions = {
  name: string;
  description: string;
  aliases?: string[];
  arguments?: UsageOptions;
  subcommands?: SubCommandClass[];
  details?: string;
  examples?: [string, string][];
  rateLimit?: CommandRateLimitOptions;
};

type CommandRateLimitOptions = RateLimitOptions & {
  customMessage?: RateLimitMessage | string;
};
type RateLimitMessage = (seconds: number, msg: CommandMessage) => string;

function defaultRatelimitMessage(seconds: number, msg: CommandMessage) {
  const user = msg.author.username;
  const sec = Math.ceil(seconds);
  return `**${user}**, please cool down! (**${sec}** seconds left)`;
}

export abstract class CommandBase {
  public readonly name: string;
  public readonly arguments: Usage;
  public readonly aliases: string[];
  public readonly subcommands?: SubCommand[];
  public readonly helpInfo: CommandHelpInfo;
  public readonly rateLimit?: RateLimitController;
  public readonly rateLimitMessage?: RateLimitMessage;

  protected constructor(options: CommandBaseOptions) {
    this.name = options.name;
    this.arguments = new Usage(options.arguments ?? []);
    this.subcommands =
      options.subcommands?.map((s) => new s().setParent(this)) ?? undefined;
    this.aliases = options.aliases ?? [];
    this.helpInfo = {
      description: options.description,
      details: options.details ?? "",
      examples: options.examples ?? [],
    };
    if (options.rateLimit) {
      this.rateLimit = new RateLimitController(options.rateLimit);
      if (typeof options.rateLimit.customMessage === "string") {
        const msg = options.rateLimit.customMessage;
        this.rateLimitMessage = () => msg;
      } else {
        this.rateLimitMessage =
          options.rateLimit.customMessage ?? defaultRatelimitMessage;
      }
    }
  }

  public execute(
    commandText: string,
    msg: CommandMessage,
    client: Client
  ): boolean {
    // Rate limiting
    if (this.rateLimit) {
      const id = msg.author.id;
      const now = new Date().getTime();
      const res = this.rateLimit.hit(id, now);
      if (!res) {
        const seconds = this.rateLimit.getMsRemaining(id, now) / 1000;
        const delMsg = msg.say(this.rateLimitMessage!(seconds, msg));
        setTimeout(async () => {
          delMsg.then((msg) => msg.delete());
        }, 5000);
        return false;
      }
    }

    let splits = commandText.split(" ");
    let args = splits.slice(1);
    if (this.subcommands) {
      // Execute subcommand
      for (const sub of this.subcommands) {
        if (
          args.length > 0 &&
          (args[0] === sub.name || sub.aliases.includes(args[0]))
        ) {
          sub.execute(args.join(" "), msg, client);
          return true;
        }
      }
      let messageText =
        "The correct usage is `" + client.prefix + this.fullName() + " ";
      messageText +=
        "(" + this.subcommands.map((s) => s.name).join("/") + ")`\n";
      messageText +=
        "\n(Use `" +
        client.prefix +
        "help " +
        this.fullName() +
        "` for more details)";
      msg.say(messageText);
      return false;
    } else {
      // Match usage
      let result = this.arguments.match(args);
      if (result !== null) {
        this.run(msg, result, client);
        return true;
      } else {
        let messageText =
          "The correct usage is `" +
          client.prefix +
          this.fullName() +
          " " +
          this.arguments.toString() +
          "`\n\n";
        if (this.helpInfo.examples && this.helpInfo.examples.length > 0) {
          messageText += "Examples:\n";
          messageText += this.helpInfo.examples
            .map((s) => "\t`" + client.prefix + s[0] + "` - " + s[1])
            .join("\n");
          messageText += "\n";
        }
        messageText +=
          "(Use `" +
          client.prefix +
          "help " +
          this.fullName() +
          "` for more details)";
        msg.channel.send(messageText);
        return false;
      }
    }
  }

  public async run(
    msg: CommandMessage,
    args: string[],
    client: Client
  ): Promise<void> {
    throw new Error("Command has not impemented a run method");
  }

  public abstract fullName(): string;
}
