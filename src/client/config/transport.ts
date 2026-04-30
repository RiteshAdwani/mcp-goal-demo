import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio";

export const transport = new StdioClientTransport({
  command: "node",
  args: ["build/server.js"],
  stderr: "ignore",
});