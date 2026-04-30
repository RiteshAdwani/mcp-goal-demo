import { Client } from "@modelcontextprotocol/sdk/client";

export const mcpClient = new Client(
  {
    name: "My MCP Client",
    version: "1.0.0",
    description:
      "A simple MCP client example that interacts with the MCP server",
  },
  {
    capabilities: {
      sampling: {},
    },
  },
);
