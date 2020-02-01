import { Argument } from "./argument";

export type UsageOptions = {
    args: Argument[]
}

export class Usage {
    public readonly args: Argument[]

    public constructor(options: UsageOptions) {
        this.args = options.args;
        this.validate();
    }

    private validate() {
        // Rule: Optional arguments must come after
        let encounterOptional = false;
        // Rule: Multi-arguments must always be the last argument
        let encounterMulti = false;

        for (let i = 0; i < this.args.length; i++) {
            const arg = this.args[i];
            if (encounterOptional && !arg.optional) {
                throw "All optional arguments must come after mandatory ones";
            }
            if (encounterMulti) {
                throw "Multistrings must always be the last argument";
            }

            if (arg.optional) {
                encounterOptional = true;
            }
            if (arg.multi) {
                encounterMulti = true;
            }
        }
    }

    public toString() {
        return this.args.map(a => a.toString()).join(" ");
    }

    public match(commandArgs: string[]): string[] | null {
        // Special case for no arguments:
        let mandatory = 0;
        let optional = 0;
        let multi = false;
        for (const argument of this.args) {
            if (argument.multi) {
                multi = true;
            }
            if (argument.optional) {
                optional++;
            } else {
                mandatory++;
            }
        }

        if (commandArgs.length < mandatory) {
            // Not enough arguments
            return null;
        }
        if (commandArgs.length > mandatory + optional && !multi) {
            // Too many arguments
            return null;
        }

        let results: string[] = [];
        for (let i = 0; i < commandArgs.length || i < this.args.length; i++) {
            let arg = this.args[i];
            // Special case for optional arguments
            if (commandArgs.length <= i) {
                results.push(arg.defaultValue!);
                continue;
            }

            let argStr = arg.multi ? commandArgs.slice(i).join(" ") : commandArgs[i];
            let val = arg.match(argStr);
            if (val === null) {
                return null;
            }
            results.push(argStr);
            if (arg.multi) {
                break;
            }
        }
        return results;
    }
}