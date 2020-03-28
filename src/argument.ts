import { Validator, ArgumentValidator } from "./validators";

export type ArgumentOptions = {
    name: string,
    validator?: ArgumentValidator,
    multi?: boolean,
    optional?: boolean,
    defaultValue?: string
}

export class Argument {
    public readonly name: string;

    public readonly validator: ArgumentValidator;
    public readonly optional: boolean;
    public readonly defaultValue?: string;
    public readonly multi: boolean;

    public constructor(options: ArgumentOptions) {
        this.name = options.name;
        this.validator = options.validator ?? Validator.String;
        this.multi = options.multi ?? false;
        this.optional = options.optional ?? false;
        this.defaultValue = options.defaultValue;
    }

    public toString() {
        let str = "";
        str += this.optional ? "[" : "<";
        str += this.name;
        str += this.optional ? "]" : ">";
        return str;
    }

    public match(argument: string): string | null {
        return this.validator(argument);
    }
}
