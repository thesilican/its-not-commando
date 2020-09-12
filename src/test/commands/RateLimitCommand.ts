import { Client, Command, CommandMessage } from "../..";

export default class RateLimitCommand extends Command {
  constructor() {
    super({
      name: "rate",
      description: "Test rate limit",
      rateLimit: {
        max: 2,
        seconds: 10,
      },
    });
  }
  async run(msg: CommandMessage, args: string[], client: Client) {
    msg.say("Hi");
  }
}
