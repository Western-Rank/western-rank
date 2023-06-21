import { BreadthCategories, SortKeys, SortOrderOptions } from "@/lib/courses";
import { getAllCoursesSearch, getCourses } from "@/services/course";
import type { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case "GET":
      return await handleGetCourses(req, res);
    default:
      return res.status(405).send("Invalid API route");
  }
}

const querySchema = z.object({
  format: z.enum(["search"]).optional(),
  sortkey: z.enum(SortKeys).optional(),
  sortorder: z.enum(SortOrderOptions).optional(),
  hasprereqs: z
    .enum(["true", "false"])
    .transform((val) => val === "true")
    .pipe(z.boolean())
    .optional(),
  minratings: z
    .string()
    .transform((val) => parseInt(val))
    .pipe(z.number())
    .optional(),
  breadth: z.enum(["A", "B", "C", "AB", "AC", "BC", "ABC"]).optional(),
  cursor: z
    .string()
    .transform((val) => parseInt(val))
    .pipe(z.number().int().min(0))
    .optional()
    .default("0"),
});

/**
 * Get all courses from the database.
 * @param req The Next.js API request object
 * @param res The Next.js API response object
 */
async function handleGetCourses(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { sortkey, sortorder, minratings, hasprereqs, breadth, format, cursor } =
      querySchema.parse(req.query);

    if (format === "search") {
      const courses = await getAllCoursesSearch();
      return res.status(200).json(courses);
    } else {
      const [courses, length] = await getCourses({
        sortOrder: sortorder,
        sortKey: sortkey,
        minratings: minratings,
        hasprereqs: hasprereqs,
        breadth: breadth?.split("") as BreadthCategories,
        pageSize: 20,
        cursor: cursor,
      });

      const next_cursor = Math.min(cursor + 20, length - (length % 20));

      return res
        .status(200)
        .json({ courses: courses, _count: courses.length, next_cursor: next_cursor });
    }
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return res.status(400).send(`Invalid query parameters: ${err.message}`);
    }

    return res.status(500).send(`Error: ${err.message}\nDetails: ${err.details}`);
  }
}
