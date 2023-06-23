import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { deleteUserByEmail } from "@/services/user";
import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case "DELETE":
      return await handleDeleteUser(req, res);
    default:
      return res.status(405).send("Invalid API route");
  }
}

export async function handleDeleteUser(req: NextApiRequest, res: NextApiResponse) {
  try {
    const data = await getServerSession(req, res, authOptions);
    if (!data?.user) {
      throw new Error("Failed to authenticate.");
    }

    const email = req.query.email as string;
    if (data?.user.email !== email) {
      throw new Error(`User ${data.user.email} is not allowed to delete user ${email}`);
    }

    const deletedUser = await deleteUserByEmail(email);
    console.log(`Deleted ${deletedUser.id} ${deletedUser?.email}`);
    return res.status(200).json({ message: `User ${deletedUser?.email} deleted` });
  } catch (err: any) {
    console.log(err);
    return res.status(500).send(`Error: ${err.message}\nDetails: ${err.details}`);
  }
}
