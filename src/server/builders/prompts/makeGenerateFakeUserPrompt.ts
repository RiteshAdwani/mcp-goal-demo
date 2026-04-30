import z from "zod";

/**
 * @description Function that creates configuration and callback for the generate fake user prompt.
 * The prompt generates a fake user based on a given name, including a realistic email, address, and phone number.
 * @returns An object containing the prompt's configuration and callback function.
 */
export const makeGenerateFakeUserPrompt = () => {
  const config = {
    title: "Generate Fake User",
    description: "Generate a fake user based on a given name",
    argsSchema: {
      name: z.string(),
    },
  };
  const callback = ({ name }: { name: string }): {
    messages: Array<{
      role: "user";
      content: { type: "text"; text: string };
    }>;
  } => {
    return {
      messages: [
        {
          role: "user",
          content: {
            type: "text",
            text: `Generate a fake user with the name ${name}. The user should have a realistic email, address, and phone number.`,
          },
        },
      ],
    };
  };
  return { config, callback };
};
