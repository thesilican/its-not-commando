import { Client, Command, CommandMessage } from "../../";

const quizQuestions = [
  {
    question: "What is the capital of Canada?",
    answer: "Toronto",
  },
  {
    question: "What is 17 times 6?",
    answer: "102",
  },
  {
    question: "What is the air speed velocity of an unladen swallow?",
    answer: "What do you mean? An African or European swallow?",
  },
];

export default class QuizCommand extends Command {
  constructor() {
    super({
      name: "quiz",
      group: "fun",
      description: "Quiz yourself with a few questions",
    });
  }
  public async run(msg: CommandMessage, args: string[], client: Client) {
    msg.say(
      "Welcome to the quiz game show! Answer three questions and you win!"
    );
    for (let i = 0; i < quizQuestions.length; i++) {
      const question = quizQuestions[i].question;
      const answer = quizQuestions[i].answer;
      const prompt = "Question " + (i + 1) + ": " + question;

      const response = await msg.prompt(prompt);

      if (response !== answer) {
        msg.say("Incorrect! Better luck next time!");
        return;
      }
    }
    msg.say("You've answered all 3 questions correctly! You win!");
  }
}
