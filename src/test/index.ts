import { Client } from "..";
import dotenv from "dotenv";
import GitCommand from "./commands/GitCommand";
import QuizCommand from "./commands/QuizCommand";
import SurveyCommand from "./commands/SurveyCommand";
import CalculatorCommand from "./commands/CalculatorCommand";
import OnionCommand from "./commands/OnionCommand";
import RateLimitCommand from "./commands/RateLimitCommand";
import EmbedCommand from "./commands/EmbedCommand";
dotenv.config();

const client = new Client({
  owner: process.env.OWNER!,
  prefix: process.env.PREFIX!,
  token: process.env.TOKEN!,
});

client.registry.registerGroups([
  {
    name: "fun",
    description: "Commands that are just for fun",
  },
  {
    name: "productivity",
    description: "Commands to help you get stuff done",
  },
]);

// Commands can be created with class name or class instance
client.registry.registerCommands([
  CalculatorCommand,
  GitCommand,
  OnionCommand,
  QuizCommand,
  new SurveyCommand(),
  new RateLimitCommand(),
  new EmbedCommand(),
]);

client.start();
