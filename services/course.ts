import { prisma } from "@/lib/db";

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

export function getAllCoursesSearch() {
  return prisma.course.findMany({
    select: {
      course_code: true,
      course_name: true,
    },
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
  const course_query = prisma.course.findUnique({
    where: {
      course_code: courseCode,
    },
    include: {
      prerequisites: true,
      antirequisites: true,
      corequisites: true,
      precorequisites: true,
    },
  });

  const aggregate_query = prisma.course_Review.aggregate({
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

  const count_liked_query = prisma.course_Review.count({
    where: {
      course_code: courseCode,
      liked: true,
    },
  });

  const [course, aggregate, count_liked] = await prisma.$transaction([
    course_query,
    aggregate_query,
    count_liked_query,
  ]);

  return {
    ...course,
    ...aggregate,
    count_liked,
  };
}
