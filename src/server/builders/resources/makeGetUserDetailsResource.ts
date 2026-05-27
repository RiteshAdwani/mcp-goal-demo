import { getPool } from "../../config/database";

/**
 * @description Function that creates configuration and callback for the get user details resource. 
 * The resource retrieves a user's details from the database based on a provided user ID. 
 * If the user is found, their details are returned in JSON format; otherwise, an error message is returned indicating that the user was not found.
 * @returns An object containing the resource's configuration and callback function.
 */
export const makeGetUserDetailsResource = () => {
  const config = {
    description: "Get a user's details from th database",
    title: "User Details",
    mimeType: "application/json",
  };

  const callback = async (
    uri: URL,
    { userId }: { userId?: string | string[] },
  ): Promise<{ contents: Array<{ uri: string; text: string; mimeType: string }> }> => {
    const result = await getPool().query(
      'SELECT id, name, email, address, phone FROM users WHERE id = $1',
      [userId as string]
    );
    const user = result.rows[0];

    if (user == null) {
      return {
        contents: [
          {
            uri: uri.href,
            text: JSON.stringify({ error: "User not found" }),
            mimeType: "application/json",
          },
        ],
      };
    }

    return {
      contents: [
        {
          uri: uri.href,
          text: JSON.stringify(user),
          mimeType: "application/json",
        },
      ],
    };
  };

  return { config, callback };
};
