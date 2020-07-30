import { Client } from "../";
import { token } from "./auth.json";
import GitCommand from "./commands/GitCommand";
import QuizCommand from "./commands/QuizCommand";
import SurveyCommand from "./commands/SurveyCommand";
import CalculatorCommand from "./commands/CalculatorCommand";
import OnionCommand from "./commands/OnionCommand";

const client = new Client({
  owner: "294169610679484417",
  prefix: "b.",
  token: token,
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
