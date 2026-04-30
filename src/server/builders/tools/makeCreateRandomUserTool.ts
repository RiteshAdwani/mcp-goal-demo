import { CreateMessageResultSchema } from "@modelcontextprotocol/sdk/types";
import { mcpServer } from "../../config/mcpServer";
import { createUser } from "../../utils/createUser";

/**
 * @description Function that creates configuration and callback for the create random user tool.
 * The tool generates a random user with fake data, including a realistic name, email, address, and phone number.
 * @returns An object containing the tool's configuration and callback function.
 */
export const makeCreateRandomUserTool = () => {
  const config = {
    title: "Create Random User",
    description: "Create a random user with fake data",
    annotations: {
      readOnlyHint: false,
      destructiveHint: false,
      idempotentHint: false,
      openWorldHint: true,
    },
  };

  const callback = async (): Promise<{ content: Array<{ type: "text"; text: string }> }> => {
    const res = await mcpServer.server.request(
      {
        method: "sampling/createMessage",
        params: {
          messages: [
            {
              role: "user",
              content: {
                type: "text",
                text: "Generate fake user data. The user should have a realistic name, email, address, and phone number. Return this data as a JSON object with no other text or formatter so it can be used with JSON.parse.",
              },
            },
          ],
          maxTokens: 1024,
        },
      },
      CreateMessageResultSchema,
    );

    if (res.content.type !== "text") {
      return {
        content: [{ type: "text", text: "Failed to generate user data" }],
      };
    }
    try {
      const fakeUser = JSON.parse(
        res.content.text
          .trim()
          .replace(/^```json/, "")
          .replace(/```$/, "")
          .trim(),
      );

      const id = await createUser(fakeUser);
      return {
        content: [{ type: "text", text: `User ${id} created successfully` }],
      };
    } catch {
      return {
        content: [{ type: "text", text: "Failed to generate user data" }],
      };
    }
  };

  return {
    config,
    callback,
  };
};
