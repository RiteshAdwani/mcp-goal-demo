import { getPool } from "../../config/database";

/**
 * @description Function that creates configuration and callback for the get users resource. 
 * The resource retrieves all users' data from the database and returns it in JSON format.
 * @returns An object containing the resource's configuration and callback function.
 */
export const makeGetUsersResource = () => {
  const config = {
    description: "Get all users data from the database",
    title: "Users",
    mimeType: "application/json",
  };

  const callback = async (uri: URL) => {
    const result = await getPool().query('SELECT id, name, email, address, phone FROM users ORDER BY id');
    const users = result.rows;

    return {
      contents: [
        {
          uri: uri.href,
          text: JSON.stringify(users),
          mimeType: "application/json",
        },
      ],
    };
  };
  return { config, callback };
};
