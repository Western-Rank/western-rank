import { ExploreCourse, getCourse } from "@/services/course";
import { Course } from "@prisma/client";

export type FullCourseName = `${Course["course_code"]}: ${Course["course_name"]}`;
export type FullCourse = Awaited<ReturnType<typeof getCourse>>;

export const SortKeys = [
  "coursecode",
  "ratings",
  "liked",
  "difficulty",
  "attendance",
  "useful",
  "rank",
] as const;
export type SortKey = (typeof SortKeys)[number];

export const SortOrderOptions = ["asc", "desc"] as const;
export type SortOrder = (typeof SortOrderOptions)[number];

export const BreadthCategoryOptions = ["A", "B", "C"] as const;
export type BreadthCategories = (typeof BreadthCategoryOptions)[number][];

type _PresortExploreCourse = Omit<ExploreCourse, "rank">;
export const SORT_MAP_DESC = new Map<
  string,
  (a: _PresortExploreCourse, b: _PresortExploreCourse) => number
>([
  ["ratings", (a, b) => (b?._count?.review_id ?? 0) - (a?._count?.review_id ?? 0)],
  ["liked", (a, b) => (b?._count?.liked ?? 0) - (a?._count?.liked ?? 0)],
  ["useful", (a, b) => (b?._avg?.useful ?? 0) - (a?._avg?.useful ?? 0)],
  ["attendance", (a, b) => (b?._avg?.attendance ?? 0) - (a?._avg?.attendance ?? 0)],
  ["difficulty", (a, b) => (b?._avg?.difficulty ?? 0) - (a?._avg?.difficulty ?? 0)],
]);

export const SORT_MAP_ASC = new Map<
  string,
  (a: _PresortExploreCourse, b: _PresortExploreCourse) => number
>([
  ["ratings", (a, b) => (a?._count?.review_id ?? 0) - (b?._count?.review_id ?? 0)],
  ["liked", (a, b) => (a?._count?.liked ?? 0) - (b?._count?.liked ?? 0)],
  ["useful", (a, b) => (a?._avg?.useful ?? 0) - (b?._avg?.useful ?? 0)],
  ["attendance", (a, b) => (a?._avg?.attendance ?? 0) - (b?._avg?.attendance ?? 0)],
  ["difficulty", (a, b) => (a?._avg?.difficulty ?? 0) - (b?._avg?.difficulty ?? 0)],
]);

export const requisiteTypes = [
  "Prerequisites",
  "Corequisites",
  "Antirequisites",
  "Pre-or-Corequisites",
] as const;

export const requisiteDescription = {
  Prerequisites:
    "a course or criteria that must be completed in order to register for this course.",
  Corequisites: "a course that must be taken concurrently with this course.",
  Antirequisites:
    "a course that has very similar content with this course, so only one course can be taken for credit.",
  "Pre-or-Corequisites":
    "a course that must be completed before taking or concurrently with this course.",
};

/**
 * Concatenate course code and course name into one entry, e.g. CALC 1000: Calculus I
 * @param courseCode
 * @param courseName
 * @returns The concatenated full course name
 */
export function formatFullCourseName(courseCode: string, courseName: string): FullCourseName {
  return `${courseCode}: ${courseName}`;
}

export function encodeCourseCode(courseCode: string) {
  return courseCode.replace(" ", "-").replaceAll("/", ":").toLowerCase();
}

export function decodeCourseCode(courseCode: string) {
  return courseCode.replace("-", " ").replaceAll(":", "/").toUpperCase();
}

type RankCourseParams = {
  ratings: number;
  liked: number;
  difficulty: number;
  attendance: number;
  useful: number;
};
export function rankCourse(agg: RankCourseParams): number {
  return (
    agg.liked * 0.4 -
    agg.difficulty * 0.2 +
    agg.useful * 0.2 +
    agg.attendance * 0.1 +
    agg.ratings * 0.05
  );
}
