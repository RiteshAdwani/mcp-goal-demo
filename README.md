# MCP Server and Client

A modular implementation of a Model Context Protocol (MCP) server and client, designed for extensibility and ease of use. This project provides a CLI-based interface to interact with tools, resources, and prompts, and demonstrates a clean separation between client and server logic.

## Features

- **MCP Client CLI**: Interactively select and execute tools, resources, and prompts.
- **Modular Handlers**: Each menu item (tools, resources, prompts, query) is handled by a dedicated, type-safe utility.
- **Resource & Tool Management**: Easily add new tools, resources, and prompts by extending the respective directories.
- **Type Safety**: Uses TypeScript types for all core entities (tools, resources, prompts, etc.).
- **Environment Configuration**: Supports `.env` for configuration.

## Project Structure

```
├── src/
│   ├── client/
│   │   ├── client.ts                # Entry point for the CLI client
│   │   ├── utils/
│   │   │   ├── menuHandlers.ts      # Menu item handlers (tools, resources, prompts, query)
│   │   │   ├── showMainMenu.ts      # Main menu loop
│   │   │   ├── handleTool.ts        # Tool execution logic
│   │   │   ├── handleResource.ts    # Resource execution logic
│   │   │   ├── handlePrompt.ts      # Prompt execution logic
│   │   │   ├── handleQuery.ts       # Query execution logic
│   │   ├── config/                  # Client configuration
│   │   ├── constants/               # Constant values
│   │   ├── types.ts                 # Shared types
│   ├── server/
│   │   ├── server.ts                # Server entry point
│   │   ├── builders/                # Resource, tool, and prompt builders
│   │   ├── config/                  # Server configuration
│   │   ├── constants/               # Server constants
│   │   ├── schemas/                 # Validation schemas
│   │   ├── utils/                   # Server utilities
│   ├── data/
│   │   └── users.json               # Example data
├── build/                           # Compiled output
├── package.json
├── tsconfig.json
```

## Getting Started

### 1. Clone the Repository

```
git clone <repo-url>
cd mcp-server-and-client
```

### 2. Install Dependencies

```
npm install
```

### 3. Create an Environment File

Copy the example below into a `.env` file at the project root:

```
GOOGLE_GENERATIVE_AI_API_KEY=your-api-key
```

### 4. Build the Project

```
npm run build
```

### 5. Run the Server

```
npm run start:server
```

### 6. Run the Client

In a separate terminal:

```
npm run start:client
```

## Usage

- When you run the client, you'll be presented with a menu to select Tools, Resources, Prompts, or Query.
- Follow the prompts to interact with the MCP server.
- Add new tools/resources/prompts by extending the respective directories and updating the menu handlers.

## Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.
