import { prisma } from "../lib/db";

/**
 * Search for courses stored in the database.
 * @param query Substring to match course names/codes with
 * @returns List of courses that match the given query
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
  return prisma.course.findMany();
}

/**
 * Get course by course code.
 * @param courseCode the course code of the course to fetch
 * @returns the course information stored in the database
 */
export function getCourse(courseCode: string) {
  return prisma.course.findUnique({
    where: {
      course_code: courseCode,
    },
  });
}
