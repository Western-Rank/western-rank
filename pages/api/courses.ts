import type { NextApiRequest, NextApiResponse } from "next"
import { getAllCourses } from "../../services/course"
import { formatFullCourseName } from "../../lib/courses"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  switch (req.method) {
    case "GET":
      await handleGetCourses(req, res)
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
async function handleGetCourses(req: NextApiRequest, res: NextApiResponse) {
  try {
    const format = req.query.format as string

    const courses = await getAllCourses()
      .then((courses) =>
        format === "names"
          ? courses.map((course) =>
              formatFullCourseName(course.course_code, course.course_name),
            )
          : courses,
      )
      .catch((err) => res.status(500).json({ error: "Something went wrong" }))

    res.status(200).json(courses)
  } catch (err: any) {
    res.send(`Error: ${err.message}\nDetails: ${err.details}`)
  }
}
