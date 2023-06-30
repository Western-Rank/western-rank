import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { getUserByEmail } from "@/services/user";
import { User } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case "GET":
      return await handleGetUser(req, res);
    default:
      return res.status(405).send("Invalid API route");
  }
}

export async function handleGetUser(req: NextApiRequest, res: NextApiResponse) {
  try {
    const data = await getServerSession(req, res, authOptions);
    if (!data?.user || !data?.user?.email) {
      throw new Error("Failed to authenticate and/or find user.");
    }
    const user = await getUserByEmail(data.user.email);
    return res.status(200).json(JSON.parse(JSON.stringify(user)) as User);
  } catch (err: any) {
    console.log(err);
    return res.status(500).send(`Error: ${err.message}\nDetails: ${err.details}`);
  }
}
