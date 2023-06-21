import { BreadthCategories, BreadthCategoryOptions, SortKey, SortOrder } from "@/lib/courses";
import { prisma } from "@/lib/db";

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

type GetCoursesParams = {
  sortKey?: SortKey;
  sortOrder?: SortOrder;
  filter?: GetCoursesFilterParams;
};

type GetCoursesFilterParams = {
  hasprereqs?: boolean;
  minratings?: number;
  cat?: string;
  breadth?: BreadthCategories;
};

/**
 * Get all courses stored in the database.
 * @returns List of all courses stored in the database
 */
export function getCourses({
  sortKey = "liked",
  sortOrder = "desc",
  filter = {
    hasprereqs: false,
    minratings: 0,
    breadth: ["A", "B", "C"],
  },
}: GetCoursesParams) {
  return prisma.course.findMany({
    where: {
      AND: [
        {
          category: {
            breadth: {
              hasSome: filter.breadth,
            },
            category_code: {
              equals: filter.cat,
            },
          },
          precorequisites_text: {
            equals: filter.hasprereqs ? undefined : "",
          },
        },
      ],
    },
  });
}

export function getCourseCount() {
  return prisma.course.count();
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
