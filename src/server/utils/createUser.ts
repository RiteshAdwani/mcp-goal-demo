import { User } from "../types";
import fs from "node:fs/promises";

/**
 * @description Creates a new user by reading the existing users from a JSON file, adding the new user to the list, and writing the updated list back to the file. 
 * The function generates a new user ID based on the current number of users and returns the ID of the newly created user.
 */
export const createUser = async (user: User) => {
  const users = await import("../../data/users.json", {
    with: { type: "json" },
  }).then((m) => m.default);

  const id = users.length + 1;
  users.push({ id, ...user });

  await fs.writeFile("./src/data/users.json", JSON.stringify(users, null, 2));
  return id;
};
