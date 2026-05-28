import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp";

const serverUrl = process.env.SERVER_URL;

export const transport = serverUrl
  ? new StreamableHTTPClientTransport(new URL(`${serverUrl}/mcp`))
  : new StdioClientTransport({
      command: "npx",
      args: ["tsx", "src/server/server.ts"],
      stderr: "ignore",
    });