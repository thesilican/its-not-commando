import { Client } from "./client";
import { GuildChannel, TextChannel } from "discord.js";

export type ArgumentOptions = {
    name: string,
    validator?: ArgumentValidator,
    multi?: boolean,
    optional?: boolean,
    defaultValue?: string
}

export type ArgumentValidator = (argument: string) => boolean;

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
        if (!this.validator(argument)) {
            return null;
        } else {
            return argument;
        }
    }
}

export const Validator = {
    String: function (value: string): boolean {
        return true;
    },
    Integer: function (value: string): boolean {
        let num = parseInt(value, 10);
        return !isNaN(num);
    },
    IntegerRange: function (min: number, max: number): ArgumentValidator {
        return function (value: string): boolean {
            let num = parseInt(value, 10);
            if (isNaN(num)) {
                return false;
            }
            return num >= min && num <= max;
        }
    },
    Float: function (value: string): boolean {
        let num = parseFloat(value);
        return !isNaN(num);
    },
    FloatRange: function (min: number, max: number): ArgumentValidator {
        return function (value: string): boolean {
            let num = parseFloat(value);
            if (isNaN(num)) {
                return false;
            }
            return num >= min && num <= max;
        }
    },
    OneOf: function (constants: string[]): ArgumentValidator {
        return function (value: string): boolean {
            return constants.includes(value);
        }
    },
    Boolean: function (value: string): boolean {
        let values = [
            "true", "false"
        ]
        return values.includes(value);
    },
    User: function (client: Client): ArgumentValidator {
        const pattern = /<@!?[0-9]+>/;
        const num = /[0-9]+/;
        return function (value: string): boolean {
            let res = value.match(pattern);
            if (res !== null) {
                let id = value.match(num);
                if (id === null) {
                    return false;
                }
                return client.users.get(id[0]) !== undefined;
            } else {
                return client.users.filter(u => u.username.toLowerCase()
                    === value.toLowerCase()).size > 0;
            }
        }
    },
    GuildChannel: function (client: Client): ArgumentValidator {
        const pattern = /<#[0-9]+>/;
        const num = /[0-9]+/;
        return function (value: string): boolean {
            let res = value.match(pattern);
            if (res !== null) {
                let id = value.match(num);
                if (id === null) {
                    return false;
                }
                return client.channels.get(id[0]) !== undefined;
            } else {
                return client.channels.filter(u => u.type !== "dm" &&
                    (u as GuildChannel).name === value.toLowerCase()).size > 0;
            }
        }
    },
    TextChannel: function (client: Client): ArgumentValidator {
        const pattern = /<#[0-9]+>/;
        const num = /[0-9]+/;
        return function (value: string): boolean {
            let res = value.match(pattern);
            if (res !== null) {
                let id = value.match(num);
                if (id === null) {
                    return false;
                }
                return client.channels.get(id[0]) !== undefined;
            } else {
                return client.channels.filter(u => u.type === "text" &&
                    (u as TextChannel).name === value.toLowerCase()).size > 0;
            }
        }
    }
}