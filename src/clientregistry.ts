import { Command } from "./command";
import { CommandGroup, CommandGroupOptions } from "./commandgroup";
import { PingCommand } from "./defaults/commands/pingcommand";
import { HelpCommand } from "./defaults/commands/helpcommand";
import { ShutdownCommand } from "./defaults/commands/shutdowncommand";
import { Client } from "./client";

export class ClientRegistry {
    public readonly commands: Command[];
    public readonly groups: CommandGroup[];

    constructor() {
        this.commands = [];
        this.groups = [];

        // There must always be a default group
        this.registerGroup({
            name: "default",
            description: "Default group for ungrouped commands"
        });
    }

    public getCommand(name: string): Command | null {
        for (const command of this.commands) {
            if (name === command.name || command.aliases.includes(name)) {
                return command;
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

    public registerCommand(command: Command) {
        for (const c of this.commands) {
            if (c.name === command.name) {
                throw "Command with name '" + command.name + "' already exists";
            }
            if (command.aliases.includes(c.name)) {
                throw "Command with alias " + command.name + "' already exists";
            }
            if (this.getGroup(command.group) === null) {
                throw "No command group '" + command.group + "' found for command " + command.name;
            }
        }
        this.commands.push(command);
        return this;
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
            this.registerGroup(option)
        }
        return this;
    }

    public registerDefaults(client: Client) {
        this.registerDefaultGroups();
        this.registerDefaultCommands(client);
        return this;
    }

    public registerDefaultGroups() {
        this.registerGroup({
            name: "util",
            description: "Built-in commands"
        });
        return this;
    }

    public registerDefaultCommands(client: Client) {
        this.registerCommand(new PingCommand(client));
        this.registerCommand(new HelpCommand(client));
        this.registerCommand(new ShutdownCommand(client));
        return this;
    }
}
