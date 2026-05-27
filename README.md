# MCP Server and Client

A modular implementation of a Model Context Protocol (MCP) server and client, designed for extensibility and ease of use. This project provides a CLI-based interface to interact with tools, resources, and prompts, and demonstrates a clean separation between client and server logic. User data is persisted in a [Neon](https://neon.tech) PostgreSQL database.

## Features

- **MCP Client CLI**: Interactively select and execute tools, resources, and prompts.
- **Modular Handlers**: Each menu item (tools, resources, prompts, query) is handled by a dedicated, type-safe utility.
- **Resource & Tool Management**: Easily add new tools, resources, and prompts by extending the respective directories.
- **Type Safety**: Uses TypeScript types for all core entities (tools, resources, prompts, etc.).
- **Neon PostgreSQL**: Cloud database for persistent user storage.
- **Environment Configuration**: Supports `.env` files for both server and client configuration.

## Project Structure

```
├── src/
│   ├── client/
│   │   ├── client.ts                # Entry point for the CLI client
│   │   ├── .env                     # Client environment variables (git-ignored)
│   │   ├── .env.example             # Client environment variable template
│   │   ├── utils/
│   │   │   ├── menuHandlers.ts      # Menu item handlers (tools, resources, prompts, query)
│   │   │   ├── showMainMenu.ts      # Main menu loop
│   │   │   ├── handleTool.ts        # Tool execution logic
│   │   │   ├── handleResource.ts    # Resource execution logic
│   │   │   ├── handlePrompt.ts      # Prompt execution logic
│   │   │   ├── handleQuery.ts       # Query execution logic
│   │   ├── config/                  # Client configuration (transport, MCP client)
│   │   ├── constants/               # Constant values
│   │   ├── types.ts                 # Shared types
│   ├── server/
│   │   ├── server.ts                # Server entry point
│   │   ├── .env                     # Server environment variables (git-ignored)
│   │   ├── .env.example             # Server environment variable template
│   │   ├── builders/                # Resource, tool, and prompt builders
│   │   ├── config/
│   │   │   ├── mcpServer.ts         # MCP server instance
│   │   │   └── database.ts          # Neon PostgreSQL connection pool
│   │   ├── constants/               # Server constants
│   │   ├── schemas/                 # Validation schemas (Zod)
│   │   ├── utils/                   # Server utilities
├── build/                           # Compiled output
├── package.json
├── tsconfig.json
```

## Getting Started

### 1. Clone the Repository

```bash
git clone <repo-url>
cd mcp-server-and-client
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Neon Database

1. Create a free project at [https://neon.tech](https://neon.tech)
2. Copy the connection string from the **Connection** tab (select **Node.js**)
3. The `users` table is created automatically on first server start

### 4. Configure Environment Variables

**Server** — create `src/server/.env`:
```
DATABASE_URL=postgresql://user:password@host/dbname?sslmode=require
```

**Client** — create `src/client/.env`:
```
GOOGLE_GENERATIVE_AI_API_KEY=your-api-key
```

See `src/server/.env.example` and `src/client/.env.example` for templates.

### 5. Run the Client

The client automatically starts the server in the background:

```bash
npm run client:dev
```

## Development

**Run server only:**
```bash
npm run server:dev
```

**Build for production:**
```bash
npm run build
```

**Start compiled server:**
```bash
npm start
```

## Deployment (Railway)

1. Push to GitHub
2. Connect repo to [Railway](https://railway.app)
3. Add environment variables in Railway dashboard:
   - `DATABASE_URL` — your Neon connection string
4. Railway auto-runs `npm run build` then `npm start`

## Usage

- Run `npm run client:dev` to open the interactive CLI menu
- Select **Tools**, **Resources**, **Prompts**, or **Query**
- **Tools**: Create users (manually or AI-generated)
- **Resources**: Fetch all users or a specific user by ID
- **Prompts**: Generate fake user data via AI
- Add new tools/resources/prompts by extending the builders directories

## Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.
