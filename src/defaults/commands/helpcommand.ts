import { Command } from "../../command";
import { Client } from "../../client";
import { CommandMessage } from "../../commandmessage";

export class HelpCommand extends Command {
  constructor() {
    super({
      name: "help",
      group: "util",
      description:
        "List all the available commands, or get help for a particular command",
      usage: [
        {
          name: "command",
          multi: true,
          optional: true,
        },
      ],
      examples: [
        ["help", "List out all the help commands"],
        ["help ping", "Get help for the `ping` command"],
      ],
      dmAllowed: true,
    });
  }

  public async run(
    msg: CommandMessage,
    args: string[],
    client: Client
  ): Promise<void> {
    let messageText = "";
    if (args[0] === undefined) {
      // General help
      messageText += "**" + client.user.username + " Commands**\n";
      messageText +=
        "(Use `" +
        client.prefix +
        "help [command]` for more info on a single command)\n";
      let groupFound = false;
      for (const group of client.registry.groups) {
        groupFound = false;
        for (const command of client.registry.commands) {
          // Check name & ensure proper permissions
          if (
            command.group === group.name &&
            (!command.ownerOnly || client.owner === msg.author.id) &&
            !command.hidden
          ) {
            if (!groupFound) {
              messageText += "__" + group.displayName + "__\n";
              groupFound = true;
            }
            messageText += "  `" + client.prefix + command.name + "`";
            messageText += " - " + command.helpInfo.description;
            if (command.ownerOnly) {
              messageText += " (!)";
            }
            messageText += "\n";
          }
        }
      }
    } else {
      // Help for a specific command
      let command = client.registry.getCommand(args[0]);
      let group = client.registry.getGroup(args[0]);
      if (command !== null) {
        messageText += "`" + client.prefix + command.fullName() + "`:";
        // Description / Details
        if (command.helpInfo.details === "") {
          messageText += " " + command.helpInfo.description;
        } else {
          messageText += " " + command.helpInfo.details;
        }
        // Aliases
        if (command.aliases.length > 0) {
          messageText += "\n\n**Aliases:** ";
          messageText += command.aliases
            .map((a) => "`" + client.prefix + a + "`")
            .join(", ");
          messageText += "";
        }
        // Usage
        if (command.subcommands) {
          messageText +=
            "\n\n**Usage:** `" + client.prefix + command.fullName() + " ";
          messageText +=
            "(" + command.subcommands.map((s) => s.name).join("/") + ")`";
        } else {
          messageText +=
            "\n\n**Usage:** `" +
            client.prefix +
            command.fullName() +
            " " +
            command.usage.toString() +
            "`";
        }
        // Examples
        if (command.helpInfo.examples.length > 0) {
          messageText +=
            "\n\n**Examples:**\n" +
            command.helpInfo.examples
              .map((e) => "\t`" + client.prefix + e[0] + "` - " + e[1])
              .join("\n");
        }
      } else if (group !== null) {
        messageText += "__" + group.displayName + " commands__";
        messageText += "\n\t" + group.description;
        messageText += "\n\nCommands: ";
        messageText += client.registry.commands
          .filter((c) => c.group === group?.name)
          .map((c) => "`" + client.prefix + c.name + "`")
          .join(",");
      } else {
        messageText +=
          "Could not find command or command group `" + args[0] + "`";
      }
    }

    let dmChannel = msg.author.dmChannel;
    if (dmChannel === null) {
      try {
        await msg.author.createDM();
        msg.author.dmChannel.send(messageText);
        if (msg.channel.type !== "dm") {
          msg.say("📥 | Sent you a DM with information");
        }
      } catch (error) {
        msg.say("Unable to send you help DMs. You probably have DMs disabled");
      }
    } else {
      msg.author.dmChannel.send(messageText);
      if (msg.channel.type !== "dm") {
        msg.say("📥 | Sent you a DM with information");
      }
    }
  }
}
