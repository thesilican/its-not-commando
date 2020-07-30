import { Client, Command, CommandMessage } from "../../";

export default class AboutCommand extends Command {
  constructor() {
    super({
      name: "about",
      description: "About this command",
    });
  }
  async run(msg: CommandMessage, args: string[], client: Client) {
    msg.say(
      "`its-not-commando` is a free to use discord.js command framework!"
    );
  }
}
