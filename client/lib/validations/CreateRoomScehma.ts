import z from "zod";

export const createRoomSchema = z.object({
  username: z
    .string()
    .min(3, "Username must contain at least 3 characters")
    .max(50, "Username must not contain more than 50 characters"),
});
