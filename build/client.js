import { input, select } from "@inquirer/prompts";
import { Client } from "@modelcontextprotocol/sdk/client";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio";
const mcpClient = new Client({
    name: "My MCP Client",
    version: "1.0.0",
    description: "A simple MCP client example that interacts with the MCP server",
}, {
    capabilities: {
        sampling: {},
    },
});
const transport = new StdioClientTransport({
    command: "node",
    args: ["build/server.js"],
    stderr: "ignore",
});
async function handleTool(tool) {
    const args = {};
    for (const [key, value] of Object.entries(tool.inputSchema.properties ?? {})) {
        args[key] = await input({
            message: `Enter value for ${key} (${value.type}):`,
        });
    }
    const res = await mcpClient.callTool({
        name: tool.name,
        arguments: args,
    });
    console.log(res.content[0].text);
}
async function handleResource(uri) {
    let finalUri = uri;
    const paramMatches = uri.match(/{([^}]+)}/g);
    if (paramMatches != null) {
        for (const paramMatch of paramMatches) {
            const paramName = paramMatch.replace("{", "").replace("}", "");
            const paramValue = await input({
                message: `Enter value for ${paramName}:`,
            });
            finalUri = finalUri.replace(paramMatch, paramValue);
        }
    }
    const res = await mcpClient.readResource({
        uri: finalUri,
    });
    console.log(JSON.stringify(JSON.parse(res.contents[0].text), null, 2));
}
async function main() {
    await mcpClient.connect(transport);
    const [{ tools }, { prompts }, { resources }, { resourceTemplates }] = await Promise.all([
        mcpClient.listTools(),
        mcpClient.listPrompts(),
        mcpClient.listResources(),
        mcpClient.listResourceTemplates(),
    ]);
    console.log("You are connected!");
    while (true) {
        const option = await select({
            message: "What would you like to do?",
            choices: ["Query", "Tools", "Resources", "Prompts"],
        });
        switch (option) {
            case "Tools": {
                const toolName = await select({
                    message: "Select a tool",
                    choices: tools.map((tool) => ({
                        name: tool.annotations?.title || tool.name,
                        value: tool.name,
                        description: tool.description,
                    })),
                });
                const tool = tools.find((t) => t.name === toolName);
                if (tool == null) {
                    console.error("Tool not found.");
                }
                else {
                    await handleTool(tool);
                }
                break;
            }
            case "Resources": {
                const resourceUri = await select({
                    message: "Select a resource",
                    choices: [
                        ...resources.map((resource) => ({
                            name: resource.name,
                            value: resource.uri,
                            description: resource.description,
                        })),
                        ...resourceTemplates.map((template) => ({
                            name: template.name,
                            value: template.uriTemplate,
                            description: template.description,
                        })),
                    ],
                });
                const uri = resources.find((r) => r.uri === resourceUri)?.uri ??
                    resourceTemplates.find((r) => r.uriTemplate === resourceUri)
                        ?.uriTemplate;
                if (uri == null) {
                    console.error("Resource not found.");
                }
                else {
                    await handleResource(uri);
                }
                break;
            }
        }
    }
}
await main();
