import dotenv from 'dotenv';
dotenv.config({ path: './src/server/.env' });

import { ResourceTemplate } from "@modelcontextprotocol/sdk/server/mcp";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio";
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
  await initializeDatabase();
  const transport = new StdioServerTransport();
  await mcpServer.connect(transport);
};

await main();
