import { input } from "@inquirer/prompts";
import { Tool } from "@modelcontextprotocol/sdk/types";
import { generateText, jsonSchema, ToolSet } from "ai";
import { google } from "../config/google";
import { AI_MODEL } from "../constants/aiModel.constants";
import { mcpClient } from "../config/mcpClient";

/**
 * @description Handles a user query by generating a response using an AI model and optionally invoking tools based on the query. 
 * The function prompts the user for a query, generates a response using the specified AI model, and executes any relevant tools if necessary. 
 * Finally, it outputs the generated text or tool results to the console.
 * @param tools An array of available tools that can be invoked based on the user's query.
 */
export const handleQuery = async (tools: Tool[]) => {
  const query = await input({ message: "Enter your query" });

  const { text, toolResults } = await generateText({
    model: google(AI_MODEL),
    prompt: query,
    tools: tools.reduce(
      (obj, tool) => ({
        ...obj,
        [tool.name]: {
          description: tool.description,
          inputSchema: jsonSchema(tool.inputSchema),
          execute: async (args: Record<string, any>) => {
            return await mcpClient.callTool({
              name: tool.name,
              arguments: args,
            });
          },
        },
      }),
      {} as ToolSet,
    ),
  });

  console.log(
    text || toolResults[0]?.output?.content?.[0]?.text || "No text generated.",
  );
};
