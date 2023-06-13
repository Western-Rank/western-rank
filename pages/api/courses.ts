import type { NextApiRequest, NextApiResponse } from "next";
import { getAllCourses } from "../../services/course";
import { formatFullCourseName } from "../../lib/courses";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case "GET":
      return await handleGetCourses(req, res);
    default:
      return res.status(405).send("Invalid API route");
  }
}

/**
 * Get all courses from the database.
 * @param req The Next.js API request object
 * @param res The Next.js API response object
 */
async function handleGetCourses(req: NextApiRequest, res: NextApiResponse) {
  try {
    const format = req.query.format as string;

    const courses = await getAllCourses();

    if (format === "names") {
      return res
        .status(200)
        .json(
          courses.map((course) => formatFullCourseName(course.course_code, course.course_name)),
        );
    } else {
      return res.status(200).json(
        courses.map((course) => {
          return {
            course_code: course.course_code,
            course_name: course.course_name,
          };
        }),
      );
    }
  } catch (err: any) {
    return res.status(500).send(`Error: ${err.message}\nDetails: ${err.details}`);
  }
}
