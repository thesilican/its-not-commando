import { MessageEmbed } from "discord.js";
import { Client, Command, CommandMessage } from "../..";

export default class EmbedCommand extends Command {
  constructor() {
    super({
      name: "embed",
      description: "Test `CommandMessage` embeds",
    });
  }
  async run(msg: CommandMessage, args: string[], client: Client) {
    const embed = new MessageEmbed()
      .setTitle("Test embed")
      .setColor("GOLD")
      .setDescription("Testing if message embeds work");
    msg.say(embed);
  }
}
