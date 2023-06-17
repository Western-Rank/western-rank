import { deleteUserByEmail } from "@/services/user";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case "DELETE":
      return await handleDeleteUser(req, res);
    default:
      return res.status(405).send("Invalid API route");
  }
}

export async function handleDeleteUser(req: NextApiRequest, res: NextApiResponse) {
  const email = req.query.email as string;
  const deletedUser = await deleteUserByEmail(email);
  console.log(`Deleted ${deletedUser.id} ${deletedUser?.email}`);
  return res.status(200).json({ message: `User ${deletedUser?.email} deleted` });
}
