import { getCourse } from "@/services/course";
import { Course } from "@prisma/client";

export type FullCourseName = `${Course["course_code"]}: ${Course["course_name"]}`;
export type FullCourse = Awaited<ReturnType<typeof getCourse>>;

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
