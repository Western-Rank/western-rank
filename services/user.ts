import { prisma } from "../lib/db";

/**
 * Get a user by their email
 * @param email email of the user
 * @returns The user object in the database
 */
export async function getUserByEmail(email: string) {
  return prisma.user.findUnique({
    where: {
      email,
    },
  });
}
