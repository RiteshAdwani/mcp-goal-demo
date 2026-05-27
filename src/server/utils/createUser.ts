import { User } from "../types";
import { getPool } from "../config/database";

/**
 * @description Creates a new user in the database by inserting the user data into the users table.
 * Returns the ID of the newly created user.
 */
export const createUser = async (user: User) => {
  const result = await getPool().query(
    'INSERT INTO users (name, email, address, phone) VALUES ($1, $2, $3, $4) RETURNING id',
    [user.name, user.email, user.address, user.phone]
  );
  return result.rows[0].id;
};
