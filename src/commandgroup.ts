export type CommandGroupOptions = {
  name: string;
  description: string;
  displayName?: string;
};

export class CommandGroup {
  public readonly name: string;
  public readonly displayName: string;
  public readonly description: string;

  constructor(options: CommandGroupOptions) {
    const capitalize = (s: string) => s[0].toUpperCase() + s.slice(1);

    this.name = options.name;
    this.description = options.description;
    this.displayName = options.displayName ?? capitalize(options.name);
  }
}
