import { McpServer } from "@modelcontextprotocol/sdk/server/mcp";

export const mcpServer = new McpServer({
  name: "My MCP Server",
  version: "1.0.0",
  description:
    "A simple MCP server example that supports resources, tools and prompts",
});
