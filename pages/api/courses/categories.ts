import { getCourseCategories } from "@/services/course";
import type { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case "GET":
      return await handleGetCategories(req, res);
    default:
      return res.status(405).send("Invalid API route");
  }
}

async function handleGetCategories(req: NextApiRequest, res: NextApiResponse) {
  try {
    const categories = await getCourseCategories();

    return res.status(200).json(categories.map((category) => category.category_code));
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return res.status(400).send(`Invalid query parameters: ${err.message}`);
    }

    return res.status(500).send(`Error: ${err.message}\nDetails: ${err.details}`);
  }
}
