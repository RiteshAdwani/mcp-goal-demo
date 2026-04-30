import { Tool } from "@modelcontextprotocol/sdk/types";
import { input } from "@inquirer/prompts";
import { mcpClient } from "../config/mcpClient";

/**
 * @description Handles executing a tool by collecting user input for its arguments and processing the tool's response.
 * The function iterates through the tool's input schema, prompting the user for input values. 
 * It then calls the MCP client's callTool method with the collected arguments and outputs the results to the console.
 * @param tool The tool object containing the name and input schema to be processed.
 */
export const handleTool = async (tool: Tool) => {
  const args: Record<string, string> = {};
  for (const [key, value] of Object.entries(
    tool.inputSchema.properties ?? {},
  )) {
    args[key] = await input({
      message: `Enter value for ${key} (${(value as { type: string }).type}):`,
    });
  }

  const res = await mcpClient.callTool({
    name: tool.name,
    arguments: args,
  });

  console.log((res.content as [{ text: string }])[0].text);
}
