import { Command } from "./command";
import { CommandGroup, CommandGroupOptions } from "./commandgroup";
import { PingCommand } from "./defaults/commands/pingcommand";
import { HelpCommand } from "./defaults/commands/helpcommand";
import { ShutdownCommand } from "./defaults/commands/shutdowncommand";
import { CommandBase } from "./commandbase";
import { SubCommand } from "./subcommand";

type CommandClass = { new (): Command };

export class ClientRegistry {
  public readonly commands: Command[];
  public readonly groups: CommandGroup[];

  constructor() {
    this.commands = [];
    this.groups = [];

    // There must always be a default group
    this.registerGroup({
      name: "default",
      description: "Default group for ungrouped commands",
    });
  }

  public getCommand(name: string): Command | SubCommand | null {
    let splits = name.split(" ");
    return this._getCommandRecursive(splits, this.commands);
  }
  private _getCommandRecursive(
    splits: string[],
    commands: (Command | SubCommand)[]
  ): Command | SubCommand | null {
    let commandName = splits[0];
    let subcommandNames = splits.slice(1);
    for (const command of commands) {
      if (
        commandName === command.name ||
        command.aliases.includes(commandName)
      ) {
        if (subcommandNames.length > 0) {
          return this._getCommandRecursive(
            subcommandNames,
            command.subcommands ?? []
          );
        } else {
          return command;
        }
      }
    }
    return null;
  }

  public getGroup(name: string): CommandGroup | null {
    for (const group of this.groups) {
      if (name === group.name) {
        return group;
      }
    }
    return null;
  }

  public registerCommand(commandClass: CommandClass) {
    let command = new commandClass();
    for (const c of this.commands) {
      if (c.name === command.name) {
        throw "Command with name '" + command.name + "' already exists";
      }
      if (command.aliases.includes(c.name)) {
        throw "Command with alias " + command.name + "' already exists";
      }
      if (this.getGroup(command.group) === null) {
        throw (
          "No command group '" +
          command.group +
          "' found for command " +
          command.name
        );
      }
    }
    this.commands.push(command);
    return this;
  }

  public registerCommands(commands: CommandClass[]) {
    for (const command of commands) {
      this.registerCommand(command);
    }
  }

  public registerGroup(options: CommandGroupOptions) {
    let group = new CommandGroup(options);
    for (const g of this.groups) {
      if (g.name === options.name) {
        throw "Group with name '" + options.name + "' already exists";
      }
    }
    this.groups.push(group);
    return this;
  }

  public registerGroups(options: CommandGroupOptions[]) {
    for (const option of options) {
      this.registerGroup(option);
    }
    return this;
  }

  public registerDefaults() {
    this.registerDefaultGroups();
    this.registerDefaultCommands();
    return this;
  }

  public registerDefaultGroups() {
    this.registerGroup({
      name: "util",
      description: "Built-in commands",
    });
    return this;
  }

  public registerDefaultCommands() {
    this.registerCommand(PingCommand);
    this.registerCommand(HelpCommand);
    this.registerCommand(ShutdownCommand);
    return this;
  }
}
