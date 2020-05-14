import { CommandBase, CommandBaseOptions } from "./commandbase";

export type SubCommandOptions = CommandBaseOptions & {
  // parent: CommandBase
};

export abstract class SubCommand extends CommandBase {
  parent: CommandBase;

  constructor(options: SubCommandOptions) {
    super(options);
    // Placeholder until setParent is called
    this.parent = {} as CommandBase;
  }

  public fullName(): string {
    return this.parent.fullName() + " " + this.name;
  }

  public setParent(parent: CommandBase) {
    this.parent = parent;
    return this;
  }
}
