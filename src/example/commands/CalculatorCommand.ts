import { Client, Command, CommandMessage } from "../../";
import { Validator } from "../../validators";

export default class CalculatorCommand extends Command {
  constructor() {
    super({
      name: "calculator",
      aliases: ["calc"],
      group: "productivity",
      description: "Do some quick maths",
      arguments: [
        {
          name: "num1",
          validator: Validator.FloatRange(-100, 100),
        },
        {
          name: "operator",
          validator: Validator.OneOf(["+", "-", "*", "/"]),
        },
        {
          name: "num2",
          validator: Validator.FloatRange(-100, 100),
        },
      ],
    });
  }
  public async run(msg: CommandMessage, args: string[], client: Client) {
    const num1 = parseFloat(args[0]);
    const num2 = parseFloat(args[2]);
    let res = 0;
    switch (args[1]) {
      case "+":
        res = num1 + num2;
        break;
      case "-":
        res = num1 - num2;
        break;
      case "*":
        res = num1 * num2;
        break;
      case "/":
        res = num1 / num2;
        break;
    }
    msg.say(num1 + " " + args[1] + " " + num2 + " = " + res);
  }
}
