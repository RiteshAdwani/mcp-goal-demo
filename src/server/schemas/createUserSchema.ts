import z from "zod";

export const createUserInputSchema = {
  name: z.string(),
  email: z.email(),
  address: z.string(),
  phone: z.string(),
};
