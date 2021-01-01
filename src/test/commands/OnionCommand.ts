import { Client, Command, CommandMessage } from "../..";
import { SubCommand } from "../../subcommand";

export default class OnionCommand extends Command {
  constructor() {
    super({
      name: "onion",
      group: "fun",
      description: "Showing off onion subcommands",
      subcommands: [OuterLayerCommand],
    });
  }
}

class OuterLayerCommand extends SubCommand {
  constructor() {
    super({
      name: "layer",
      description: "First layer",
      subcommands: [InnerLayerCommand],
    });
  }
}

class InnerLayerCommand extends SubCommand {
  constructor() {
    super({
      name: "layer",
      description: "Second layer",
      subcommands: [new CoreCommand()],
    });
  }
}

class CoreCommand extends SubCommand {
  constructor() {
    super({
      name: "core",
      description: "The inside of the onion!",
    });
  }

  async run(msg: CommandMessage, args: string[], client: Client) {
    msg.say("You have just run 3 subcommands");
  }
}
