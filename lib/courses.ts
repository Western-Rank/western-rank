import { getCourse } from "@/services/course";
import { Course } from "@prisma/client";

export type FullCourseName = `${Course["course_code"]}: ${Course["course_name"]}`;
export type FullCourse = Awaited<ReturnType<typeof getCourse>>;

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
