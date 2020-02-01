import { ClientRegistry } from "./clientregistry";
import Discord from "discord.js";
import { Command } from "./command";

export type ClientOptions = {
    token: string;
    owner: string;
    prefix: string;
};

export class Client extends Discord.Client {
    public readonly owner: string;
    public readonly prefix: string;
    public readonly registry: ClientRegistry;

    constructor(options: ClientOptions) {
        super();

        this.owner = options.owner;
        this.prefix = options.prefix;
        this.token = options.token;

        this.registry = new ClientRegistry();

        this.on("ready", this.onReady);
        this.on("message", this.onMessage);
        this.on("error", this.onError);
    }

    public start() {
        this.login(this.token).then(_ => {
            this.user.setActivity("Use " + this.prefix + "help");
        });
    }

    public stop() {
        console.log("Shutting down bot...");
        this.destroy().then(_ => {
            setTimeout(process.exit, 1000, 0);
        });
    }

    private onReady() {
        console.log("Logged in as " + this.user.tag);
    }

    private onMessage(message: Discord.Message) {
        // Ignore bot input
        if (message.author.bot) {
            return;
        }

        // Ignore DMs
        if (message.channel instanceof Discord.DMChannel) {
            return;
        }

        // Parse message text
        if (!message.content.startsWith(this.prefix)) {
            return;
        }

        let messageText = message.content.slice(this.prefix.length);
        let pivot = messageText.indexOf(" ");
        let commandText = pivot === -1 ? messageText : messageText.slice(0, pivot);

        let command = this.registry.getCommand(commandText);
        if (!command) {
            message.channel.send("Command not found: `" + commandText + "`");
            return;
        }
        command.execute(messageText, message, this);
    }

    private onError(error: Error) {
        let errorMessage = "Unhandled Exception " + error.name + ": " + error.message + "\n" + error.stack;
        this.users.get(this.owner)?.sendMessage(errorMessage);
        console.error(errorMessage);
    }
}
