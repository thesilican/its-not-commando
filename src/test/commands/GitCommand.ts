import { Client, Command, CommandMessage } from "../..";
import { SubCommand } from "../../subcommand";

export default class GitCommand extends Command {
  constructor() {
    super({
      name: "git",
      group: "productivity",
      description: "Git like commands",
      subcommands: [GitAddCommand, GitCommit, GitPush],
    });
  }
}

class GitAddCommand extends SubCommand {
  constructor() {
    super({
      name: "add",
      description: "Add files to your git index",
    });
  }
  async run(msg: CommandMessage, args: string[], client: Client) {
    msg.say("You have added your files to the git index");
  }
}

class GitCommit extends SubCommand {
  constructor() {
    super({
      name: "commit",
      description: "Commit messages to your repository",
      arguments: [
        {
          name: "commit_message",
          multi: true,
        },
      ],
    });
  }
  async run(msg: CommandMessage, args: string[], client: Client) {
    msg.say("Committed files to repository with commit message: " + args[0]);
  }
}

class GitPush extends SubCommand {
  constructor() {
    super({
      name: "push",
      description: "Push your changes to the remote repository",
    });
  }
  async run(msg: CommandMessage, args: string[], client: Client) {
    msg.say("Changes pushed to remote/origin");
  }
}
