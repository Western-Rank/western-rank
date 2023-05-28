import type { NextApiRequest, NextApiResponse } from "next"
import { getAllCourses } from "../../services/course"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  switch (req.method) {
    case "GET":
      await getCourses(req, res)
      break
    default:
      res.send("Invalid API route")
      break
  }
}

/**
 * Get all courses from the database.
 * @param req The Next.js API request object
 * @param res The Next.js API response object
 */
async function getCourses(req: NextApiRequest, res: NextApiResponse) {
  try {
    const courses = await getAllCourses()
    res.send(courses)
  } catch (err: any) {
    res.send(`Error: ${err.message}\nDetails: ${err.details}`)
  }
}
