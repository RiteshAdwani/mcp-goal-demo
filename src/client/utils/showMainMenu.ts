import { select } from "@inquirer/prompts";
import { MENU_OPTION_CHOICES } from "../constants/menuChoices.constants";
import {
  handlePromptsOption,
  handleQueryOption,
  handleResourcesOption,
  handleToolsOption,
} from "./menuHandlers";
import { MenuOptionChoice } from "../types";
import {
  Tool,
  Prompt,
  Resource,
  ResourceTemplate,
} from "@modelcontextprotocol/sdk/types";

/**
 * @description Displays the main menu to the user, allowing them to select an option for interacting with tools, resources, prompts, or queries.
 * The function runs in an infinite loop, continuously showing the menu after each action until the program is terminated. 
 * Based on the user's selection, it calls the appropriate handler function to manage tools, resources, prompts, or queries.
 * @param tools List of available tools.
 * @param prompts List of available prompts.
 * @param resources List of available resources.
 * @param resourceTemplates List of available resource templates.
 */
export const showMainMenu = async (
  tools: Tool[],
  prompts: Prompt[],
  resources: Resource[],
  resourceTemplates: ResourceTemplate[],
) => {
  while (true) {
    const option = await select({
      message: "What would you like to do?",
      choices: MENU_OPTION_CHOICES,
    });

    switch (option) {
      case MenuOptionChoice.Tools:
        await handleToolsOption(tools);
        break;
      case MenuOptionChoice.Resources:
        await handleResourcesOption(resources, resourceTemplates);
        break;
      case MenuOptionChoice.Prompts:
        await handlePromptsOption(prompts);
        break;
      case MenuOptionChoice.Query:
        await handleQueryOption(tools);
        break;
    }
  }
};
