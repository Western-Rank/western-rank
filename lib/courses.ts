import { Course } from "@prisma/client";

export type FullCourseName = `${Course["course_code"]}: ${Course["course_name"]}`;

/**
 * Concatenate course code and course name into one entry, e.g. CALC 1000: Calculus I
 * @param courseCode
 * @param courseName
 * @returns The concatenated full course name
 */
export function formatFullCourseName(courseCode: string, courseName: string): FullCourseName {
  return `${courseCode}: ${courseName}`;
}
