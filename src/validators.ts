import { GuildChannel, TextChannel, Client } from "discord.js";

export type ArgumentValidator = (argument: string) => string | null;

export const Validator = {
    String: function (value: string) {
        return value;
    },
    Integer: function (value: string): string | null {
        let num = parseInt(value, 10);
        if (isNaN(num)) {
            return null;
        }
        return value;
    },
    IntegerRange: function (min: number, max: number): ArgumentValidator {
        return function (value: string): string | null {
            let num = parseInt(value, 10);
            if (isNaN(num)) {
                return null;
            }
            if (num < min || num > max) {
                return null;
            }
            return value;
        }
    },
    Float: function (value: string): string | null {
        let num = parseFloat(value);
        if (isNaN(num)) {
            return null;
        }
        return value;
    },
    FloatRange: function (min: number, max: number): ArgumentValidator {
        return function (value: string): string | null {
            let num = parseFloat(value);
            if (isNaN(num)) {
                return null;
            }
            if (num < min || num > max) {
                return null;
            }
            return value;
        }
    },
    OneOf: function (constants: string[]): ArgumentValidator {
        return function (value: string): string | null {
            if (!constants.includes(value)) {
                return null;
            }
            return value;
        }
    },
    Boolean: function (value: string): string | null {
        if (!["true", "false"].includes(value)) {
            return null;
        }
        return value;
    },
    User: function (value: string): string | null {
        const pattern = /^<@!?[0-9]+>$/;
        const number = /[0-9]+/;
        let res = value.match(pattern);
        if (res === null) {
            return null;
        }
        return value.match(number)![0];
    },
    Channel: function (value: string): string | null {
        const pattern = /^<#[0-9]+>$/;
        const number = /[0-9]+/;
        let res = value.match(pattern);
        if (res === null) {
            return null;
        }
        return value.match(number)![0];
    }
}