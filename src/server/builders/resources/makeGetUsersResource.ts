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
    const users = await import("../../../data/users.json", {
      with: { type: "json" },
    }).then((m) => m.default);

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
