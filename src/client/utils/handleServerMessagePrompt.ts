import { PromptMessage } from "@modelcontextprotocol/sdk/types";
import { generateText } from "ai";
import { confirm } from "@inquirer/prompts";
import { google } from "../config/google";
import { AI_MODEL } from "../constants/aiModel.constants";

/**
 * @description Handles a server message prompt by displaying its content and optionally generating a response using an AI model.
 * The function first checks if the message content is of type "text". If so, it logs the text to the console and prompts the user to confirm whether they want to run the prompt. 
 * If the user confirms, it generates a response using the specified AI model and returns the generated text.
 * @param message The PromptMessage object received from the server, which may contain text content to be processed.
 * @returns The generated text response if the user chooses to run the prompt, or undefined if the prompt is not run or if the message content is not text. 
 */
export const handleServerMessagePrompt = async (message: PromptMessage) => {
  if (message.content.type !== "text") return;

  console.log(message.content.text);
  const run = await confirm({
    message: "Would you like to run the above prompt",
    default: true,
  });

  if (!run) return;

  const { text } = await generateText({
    model: google(AI_MODEL),
    prompt: message.content.text,
  });

  return text;
}
