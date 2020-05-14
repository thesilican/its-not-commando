import { ArgumentOptions } from "./argument";
import { UsageOptions, Usage } from "./usage";
import { SubCommand, SubCommandOptions } from "./subcommand";
import { CommandMessage } from "./commandmessage";
import { Client } from "./client";

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
  usage?: UsageOptions;
  subcommands?: SubCommandClass[];
  details?: string;
  examples?: [string, string][];
};

export abstract class CommandBase {
  public readonly name: string;
  public readonly usage: Usage;
  public readonly aliases: string[];
  public readonly subcommands?: SubCommand[];
  public readonly helpInfo: CommandHelpInfo;

  protected constructor(options: CommandBaseOptions) {
    this.name = options.name;
    this.usage = new Usage(options.usage ?? []);
    this.subcommands =
      options.subcommands?.map((s) => new s().setParent(this)) ?? undefined;
    this.aliases = options.aliases ?? [];
    this.helpInfo = {
      description: options.description,
      details: options.details ?? "",
      examples: options.examples ?? [],
    };
  }

  public execute(
    commandText: string,
    msg: CommandMessage,
    client: Client
  ): boolean {
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
      let result = this.usage.match(args);
      if (result !== null) {
        this.run(msg, result, client);
        return true;
      } else {
        let messageText =
          "The correct usage is `" +
          client.prefix +
          this.fullName() +
          " " +
          this.usage.toString() +
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
    throw "Command has not impemented a run method";
  }

  public abstract fullName(): string;
}
