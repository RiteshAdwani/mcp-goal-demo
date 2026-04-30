import { input } from "@inquirer/prompts";
import { mcpClient } from "../config/mcpClient";
import { Prompt } from "@modelcontextprotocol/sdk/types";
import { handleServerMessagePrompt } from "./handleServerMessagePrompt";

/**
 * @description Handles a prompt by collecting user input for its arguments and processing the server's response messages.
 * The function iterates through the prompt's arguments, prompting the user for input values. 
 * It then calls the MCP client's getPrompt method with the collected arguments and processes each message in the response using the handleServerMessagePrompt function, outputting the results to the console.
 * @param prompt The prompt object containing the name and arguments to be processed.
 */
export const handlePrompt = async (prompt: Prompt) => {
  const args: Record<string, string> = {};
  for (const arg of prompt.arguments ?? []) {
    args[arg.name] = await input({
      message: `Enter value for ${arg.name}:`,
    });
  }

  const response = await mcpClient.getPrompt({
    name: prompt.name,
    arguments: args,
  });

  for (const message of response.messages) {
    console.log(await handleServerMessagePrompt(message));
  }
}
