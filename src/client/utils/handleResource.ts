import { input } from "@inquirer/prompts";
import { mcpClient } from "../config/mcpClient";

/**
 * @description Handles reading a resource from the MCP server. If the URI contains parameters (e.g., users://{userId}/profile), 
 * it prompts the user to input values for those parameters before making the request. 
 * Finally, it logs the formatted response content to the console.
 * @argument uri The URI of the resource to be read, which may contain parameters in the format {paramName}.
 */
export const handleResource = async (uri: string) => {
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

  const content = res.contents[0];
  console.log(
    JSON.stringify(
      JSON.parse("text" in content ? content.text : content.blob),
      null,
      2,
    ),
  );
}
