import { Client } from "..";
import dotenv from "dotenv";
import GitCommand from "./commands/GitCommand";
import QuizCommand from "./commands/QuizCommand";
import SurveyCommand from "./commands/SurveyCommand";
import CalculatorCommand from "./commands/CalculatorCommand";
import OnionCommand from "./commands/OnionCommand";
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

client.registry.registerCommands([
  CalculatorCommand,
  GitCommand,
  OnionCommand,
  QuizCommand,
  SurveyCommand,
]);

client.start();
