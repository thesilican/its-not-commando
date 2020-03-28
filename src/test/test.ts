import { Client } from "../";
import TestCommand from "./testcommand";
import auth from "./auth.json";
import Discord from 'discord.js';
import { Message } from 'discord.js';

const client = new Client({
    owner: "294169610679484417",
    prefix: ".",
    token: auth.token,
    validator: (message: Discord.Message) => {
        if (message.mentions.users.get(client.user.id)) {
            message.channel.send("Please don't mention me");
            return false;
        }
        return true;
    },
    logger: {
        log(...message: any[]) {
            console.log(new Date().toISOString(), ...message);
        },
        error(...message: any[]) {
            console.log(new Date().toISOString(), ...message)
        }
    }
});

client.registry.registerCommand(TestCommand);

client.start();
