import { Command } from "../../command";
import { Client } from "../../client";
import Discord from "discord.js";
import { CommandMessage } from "../../commandmessage";

export class ShutdownCommand extends Command {
  constructor() {
    super({
      name: "shutdown",
      group: "util",
      description: "Shutdown the bot",
      details: "Gracefully shuts down the bot. This will make the bot offline!",
      ownerOnly: true,
      dmAllowed: true,
    });
  }

  public async run(
    msg: CommandMessage,
    args: string[],
    client: Client
  ): Promise<void> {
    await msg.say("Shutting down bot...");
    client.stop();
  }
}
