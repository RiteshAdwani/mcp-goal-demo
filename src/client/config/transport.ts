import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio";

export const transport = new StdioClientTransport({
  command: "npx",
  args: ["tsx", "src/server/server.ts"],
  stderr: "ignore",
});