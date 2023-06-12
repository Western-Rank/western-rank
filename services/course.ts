import { Course } from "@prisma/client";
import { prisma } from "../lib/db";

export type FullCourse = Awaited<ReturnType<typeof getCourse>>;

/**
 * Search for courses stored in the database.
 * @param query Substring to match course names/codes with
 * @returns List of courses that match  the given query
 */
export function searchCourses(query: string) {
  return prisma.course.findMany({
    where: {
      OR: [{ course_code: { contains: query } }, { course_name: { contains: query } }],
    },
  });
}

/**
 * Get all courses stored in the database.
 * @returns List of all courses stored in the database
 */
export function getAllCourses() {
  return prisma.course.findMany({
    orderBy: {
      course_code: "asc",
    },
  });
}

/**
 * Get course by course code.
 * @param courseCode the course code of the course to fetch
 * @returns the course information stored in the database
 */
export async function getCourse(courseCode: string) {
  const course = await prisma.course.findUnique({
    where: {
      course_code: courseCode,
    },
  });

  const aggregate = await prisma.course_Review.aggregate({
    _avg: {
      difficulty: true,
      useful: true,
      attendance: true,
    },
    _count: {
      review_id: true,
    },
    where: {
      course_code: courseCode,
    },
  });

  const count_liked = await prisma.course_Review.count({
    where: {
      course_code: courseCode,
      liked: true,
    },
  });

  return {
    ...(course as Course),
    ...aggregate,
    count_liked,
  };
}
