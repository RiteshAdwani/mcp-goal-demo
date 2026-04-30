import { select } from "@inquirer/prompts";
import { handleTool } from "../utils/handleTool";
import { handleResource } from "../utils/handleResource";
import { handlePrompt } from "../utils/handlePrompt";
import {
  Resource,
  Tool,
  ResourceTemplate,
  Prompt,
} from "@modelcontextprotocol/sdk/types";

/**
 * @description Prompts the user to select a tool from the provided list, then executes the selected tool using handleTool.
 * If the tool is not found, logs an error.
 * @param tools List of available tools.
 */
export const handleToolsOption = async (tools: Tool[]) => {
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
  } else {
    await handleTool(tool);
  }
};

/**
 * @description Prompts the user to select a resource or resource template from the provided lists.
 * Determines the correct URI based on the selection and executes it using handleResource.
 * If the resource is not found, logs an error.
 * @param resources List of available resources.
 * @param resourceTemplates List of available resource templates.
 */
export const handleResourcesOption = async (
  resources: Resource[],
  resourceTemplates: ResourceTemplate[],
) => {
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

  const uri =
    resources.find((r) => r.uri === resourceUri)?.uri ??
    resourceTemplates.find((r) => r.uriTemplate === resourceUri)?.uriTemplate;
  if (uri == null) {
    console.error("Resource not found.");
  } else {
    await handleResource(uri);
  }
};

/**
 * @description Prompts the user to select a prompt from the provided list, then executes the selected prompt using handlePrompt.
 * If the prompt is not found, logs an error.
 * @param prompts List of available prompts.
 */
export const handlePromptsOption = async (prompts: Prompt[]) => {
  const promptName = await select({
    message: "Select a prompt",
    choices: prompts.map((prompt) => ({
      name: prompt.name,
      value: prompt.name,
      description: prompt.description,
    })),
  });
  const prompt = prompts.find((p) => p.name === promptName);
  if (prompt == null) {
    console.error("Prompt not found.");
  } else {
    await handlePrompt(prompt);
  }
};

/**
 * @description Forwards the provided list of tools to the handleQuery function, which handles user queries and tool invocation.
 * @param tools List of available tools.
 */
export const handleQueryOption = async (tools: Tool[]) => {
  await handleQueryOption(tools);
};
