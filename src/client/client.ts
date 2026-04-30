import {
  CreateMessageRequestSchema,
  PromptMessage,
} from "@modelcontextprotocol/sdk/types";
import dotenv from "dotenv";
import { mcpClient } from "./config/mcpClient";
import { transport } from "./config/transport";
import { handleServerMessagePrompt } from "./utils/handleServerMessagePrompt";
import { AI_MODEL } from "./constants/aiModel.constants";
import { showMainMenu } from "./utils/showMainMenu";

dotenv.config();

const main = async () => {
  await mcpClient.connect(transport);

  const [{ tools }, { prompts }, { resources }, { resourceTemplates }] =
    await Promise.all([
      mcpClient.listTools(),
      mcpClient.listPrompts(),
      mcpClient.listResources(),
      mcpClient.listResourceTemplates(),
    ]);

  mcpClient.setRequestHandler(CreateMessageRequestSchema, async (request) => {
    const texts: string[] = [];
    for (const message of request.params.messages) {
      const text = await handleServerMessagePrompt(message as PromptMessage);
      if (text != null) texts.push(text);
    }

    return {
      role: "user",
      model: AI_MODEL,
      stopReason: "endTurn",
      content: {
        type: "text",
        text: texts.join("\n"),
      },
    };
  });

  console.log("You are connected!");
  await showMainMenu(tools, prompts, resources, resourceTemplates);
};

await main();
