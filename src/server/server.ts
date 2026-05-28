import dotenv from 'dotenv';
dotenv.config({ path: './src/server/.env' });

import { createServer } from 'node:http';
import { ResourceTemplate } from "@modelcontextprotocol/sdk/server/mcp";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp";
import { mcpServer } from "./config/mcpServer";
import { initializeDatabase } from "./config/database";
import { makeCreateUserTool } from "./builders/tools/makeCreateUserTool";
import { makeGetUsersResource } from "./builders/resources/makeGetUsersResource";
import { makeGetUserDetailsResource } from "./builders/resources/makeGetUserDetailsResource";
import { makeCreateRandomUserTool } from "./builders/tools/makeCreateRandomUserTool";
import { makeGenerateFakeUserPrompt } from "./builders/prompts/makeGenerateFakeUserPrompt";
import { PromptNames, ResourceNames, ToolNames } from "./types";
import { RESOURCE_URIS } from "./constants/resourceUris.constants";

// Extract tool configuration and callback from the builder function for the create user tool
const { config: createUserToolConfig, callback: createUserToolCallback } =
  makeCreateUserTool();

// Register the create user tool with the MCP server using the extracted configuration and callback
mcpServer.registerTool(
  ToolNames.CreateUser,
  createUserToolConfig,
  createUserToolCallback,
);

// Extract resource configuration and callback from the builder function for the get users resource
const { config: getUsersResourceConfig, callback: getUsersResourceCallback } =
  makeGetUsersResource();

// Register the get users resource with the MCP server using the extracted configuration and callback
mcpServer.registerResource(
  ResourceNames.Users,
  RESOURCE_URIS.Users,
  getUsersResourceConfig,
  getUsersResourceCallback,
);

// Extract resource configuration and callback from the builder function for the get user details resource
const {
  config: getUserDetailsResourceConfig,
  callback: getUserDetailsResourceCallback,
} = makeGetUserDetailsResource();

// Register the get user details resource with the MCP server using the extracted configuration and callback
mcpServer.registerResource(
  ResourceNames.UserDetails,
  new ResourceTemplate(RESOURCE_URIS.UserDetails, { list: undefined }),
  getUserDetailsResourceConfig,
  getUserDetailsResourceCallback,
);

// Extract prompt configuration and callback from the builder function for the generate fake user prompt
const {
  config: generateFakeUserPromptConfig,
  callback: generateFakeUserPromptCallback,
} = makeGenerateFakeUserPrompt();

// Register the generate fake user prompt with the MCP server using the extracted configuration and callback
mcpServer.registerPrompt(
  PromptNames.GenerateFakeUser,
  generateFakeUserPromptConfig,
  generateFakeUserPromptCallback,
);

// Extract tool configuration and callback from the builder function for the create random user tool
const {
  config: createRandomUserToolConfig,
  callback: createRandomUserToolCallback,
} = makeCreateRandomUserTool();

// Register the create random user tool with the MCP server using the extracted configuration and callback
mcpServer.registerTool(
  ToolNames.CreateRandomUser,
  createRandomUserToolConfig,
  createRandomUserToolCallback,
);

const main = async () => {
  if (process.env.PORT) {
    // HTTP mode — used when deployed (e.g. Render)
    const transport = new StreamableHTTPServerTransport({
      sessionIdGenerator: undefined, // stateless
    });

    await mcpServer.connect(transport);

    const server = createServer(async (req, res) => {
      if (req.url === '/mcp') {
        let body: unknown;
        if (req.method === 'POST') {
          const chunks: Buffer[] = [];
          for await (const chunk of req) chunks.push(chunk as Buffer);
          try {
            body = JSON.parse(Buffer.concat(chunks).toString());
          } catch {
            body = undefined;
          }
        }
        await transport.handleRequest(req, res, body);
      } else {
        res.writeHead(404);
        res.end('Not found');
      }
    });

    const port = Number(process.env.PORT) || 3000;
    server.listen(port, () => {
      console.log(`MCP HTTP server listening on port ${port}`);
    });

    // Initialize DB after server is already listening
    initializeDatabase().catch((err) => {
      console.error('Database initialization failed:', err);
    });
  } else {
    // Stdio mode — used locally
    await initializeDatabase();
    const transport = new StdioServerTransport();
    await mcpServer.connect(transport);
  }
};

await main();
