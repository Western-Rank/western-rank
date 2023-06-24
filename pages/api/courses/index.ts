import { BreadthCategories, SortKeys, SortOrderOptions } from "@/lib/courses";
import { getAllCoursesSearch, getCourses, type ExploreCourse } from "@/services/course";
import type { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";

const PAGE_SIZE = 20;

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
  noprereqs: z
    .enum(["true", "false"])
    .transform((val) => val === "true")
    .pipe(z.boolean())
    .optional()
    .default("false"),
  minratings: z
    .string()
    .transform((val) => parseInt(val))
    .pipe(z.number().int().min(0))
    .optional(),
  breadth: z.enum(["A", "B", "C", "AB", "AC", "BC", "ABC"]).optional(),
  cursor: z
    .string()
    .transform((val) => parseInt(val))
    .pipe(z.number().int().min(0))
    .optional()
    .default("0"),
  cat: z.string().optional(),
});

export type GetCoursesResponse = {
  courses: ExploreCourse[];
  _count: number;
  next_cursor: number | undefined;
};

/**
 * Get all courses from the database.
 * @param req The Next.js API request object
 * @param res The Next.js API response object
 */
async function handleGetCourses(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { sortkey, sortorder, minratings, noprereqs, breadth, format, cursor, cat } =
      querySchema.parse(req.query);

    if (format === "search") {
      const courses = await getAllCoursesSearch();
      return res.status(200).json(courses);
    } else {
      const { courses, length } = await getCourses({
        sortOrder: sortorder,
        sortKey: sortkey,
        minratings: minratings,
        noprereqs: noprereqs,
        breadth: breadth?.split("") as BreadthCategories,
        pageSize: PAGE_SIZE,
        cursor: cursor,
        cat: cat,
      });

      const next_cursor = cursor + PAGE_SIZE < length ? cursor + PAGE_SIZE : undefined;

      const response: GetCoursesResponse = {
        courses: courses,
        _count: length,
        next_cursor: next_cursor,
      };

      return res.status(200).json(response);
    }
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return res.status(400).send(`Invalid query parameters: ${err.message}`);
    }

    return res.status(500).send(`Error: ${err.message}\nDetails: ${err.details}`);
  }
}
