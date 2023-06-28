import { getAllProfessorsSearch } from "@/services/professor";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case "GET":
      return await handleGetProfessors(req, res);
    default:
      return res.status(405).send("Invalid API route");
  }
}

/**
 * Get all courses from the database.
 * @param req The Next.js API request object
 * @param res The Next.js API response object
 */
async function handleGetProfessors(req: NextApiRequest, res: NextApiResponse) {
  try {
    const format = req.query.format as string;

    if (format === "compact") {
      const professors = await getAllProfessorsSearch();
      return res.status(200).json(professors);
    }
  } catch (err: any) {
    return res.status(500).send(`Error: ${err.message}\nDetails: ${err.details}`);
  }
}
