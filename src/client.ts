import Discord from "discord.js";
import { ClientRegistry } from "./clientregistry";
import { CommandMessage } from "./commandmessage";

interface ClientLogger {
  log(...message: string[]): void;
  error(...message: string[]): void;
}

type MessageValidator = (mesage: Discord.Message, client: Client) => boolean;

export type ClientOptions = {
  owner: string;
  prefix: string;
  token: string;
  validator?: MessageValidator;
  logger?: ClientLogger;
  registerDefaultCommands?: boolean;
} & Discord.ClientOptions;

export class Client extends Discord.Client {
  public readonly owner: string;
  public readonly prefix: string;
  public readonly registry: ClientRegistry;
  public readonly validator?: MessageValidator;
  public readonly logger: ClientLogger;

  constructor(options: ClientOptions) {
    super(options);

    this.owner = options.owner;
    this.token = options.token;
    this.prefix = options.prefix;
    this.validator = options.validator;
    this.logger = options.logger ?? console;

    this.registry = new ClientRegistry();
    if (options.registerDefaultCommands ?? true) {
      this.registry.registerDefaults();
    }

    this.on("ready", this.onReady);
    this.on("message", this.onMessage);
    this.on("error", this.onError);
  }

  public async start() {
    await this.login();
    if (!this.user) {
      this.logger.error("Unable to log in as user");
      this.stop();
      return;
    }
    this.user.setActivity("Use " + this.prefix + "help");

    // Throw an error if the user doesn't exist
    try {
      await this.users.fetch(this.owner);
    } catch {
      this.logger.error(
        "Owner with Discord user id of '" + this.owner + "' is invalid."
      );
      this.stop();
    }
  }

  public async stop() {
    this.logger.log("Shutting down bot...");
    this.destroy();
    setTimeout(process.exit, 10000, 0);
  }

  private onReady() {
    this.logger.log("Logged in as " + this.user?.tag);
  }

  private onMessage(message: Discord.Message) {
    // Ignore bot input
    if (message.author.bot) {
      return;
    }

    // Parse message text
    if (!message.content.startsWith(this.prefix)) {
      return;
    }

    // Custom validation
    if (this.validator !== undefined) {
      if (this.validator(message, this) === false) {
        return;
      }
    }

    let messageText = message.content.slice(this.prefix.length);
    if (messageText === "") {
      return;
    }
    let commandText = messageText.split(" ")[0];

    let command = this.registry.getCommand(commandText);
    if (!command) {
      message.channel.send("Command not found: `" + commandText + "`");
      return;
    }
    command.execute(messageText, CommandMessage.create(message), this);
  }

  private onError(error: Error) {
    let errorMessage =
      "Unhandled Exception " +
      error.name +
      ": " +
      error.message +
      "\n" +
      error.stack;
    this.users.resolve(this.owner)?.send(errorMessage);
    this.logger.error(errorMessage);
  }
}
