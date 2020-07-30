import { Client, Command, CommandMessage } from "../../";
import { count } from "console";

export default class SurveyCommand extends Command {
  constructor() {
    super({
      name: "survey",
      aliases: ["svy"],
      group: "fun",
      description: "Get people to answer your servey",
    });
  }
  public async run(msg: CommandMessage, args: string[], client: Client) {
    const counts = {
      apple: 0,
      banana: 0,
    };
    const message = await msg.say(
      "What is your favorite fruit?\n" + "Apple: 0 Banana: 0"
    );
    const menu = message.createMenu(["🍎", "🍌"]);
    menu.on("reaction", async (emoji, user, reaction, msg) => {
      if (emoji === "🍎") {
        counts.apple++;
      } else if (emoji === "🍌") {
        counts.banana++;
      }
      msg.edit(
        "What is your favorite fruit?\n" +
          "Apple: " +
          counts.apple +
          " Banana: " +
          counts.banana
      );
    });
    menu.on("finish", async (msg) => {
      msg.edit(
        "Final counts:\n" +
          "Apple: " +
          counts.apple +
          " Banana: " +
          counts.banana
      );
    });
  }
}
