import { createUser } from "../../utils/createUser";
import { createUserInputSchema } from "../../schemas/createUserSchema";
import { ShapeOutput } from "@modelcontextprotocol/sdk/server/zod-compat";

/**
 * @description Function that creates configuration and callback for the create user tool. 
 * The tool allows users to input specific details (name, email, address, phone) to create a new user in the database.
 * @returns An object containing the tool's configuration and callback function.
 */
export const makeCreateUserTool = () => {
  const config = {
    title: "Create User",
    description: "Create a new user in the database",
    inputSchema: createUserInputSchema,
    annotations: {
      readOnlyHint: false,
      destructiveHint: false,
      idempotentHint: false,
      openWorldHint: true,
    },
  };

  const callback = async (
    params: ShapeOutput<typeof createUserInputSchema>,
  ): Promise<{ content: Array<{ type: "text"; text: string }> }> => {
    try {
      const userId = await createUser(params);
      return {
        content: [{ type: "text", text: `User created with ID: ${userId}` }],
      };
    } catch {
      return {
        content: [{ type: "text", text: "Failed to save user" }],
      };
    }
  };

  return {
    config,
    callback,
  };
};
