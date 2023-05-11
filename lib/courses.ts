import { eq, or, like } from "drizzle-orm";

import { db } from "./database/db";
import { courses } from "./database/schema";

export interface Course {
  course_code: string,
  course_name: string,
  antirequisites: string,
  prerequisites: string,
  description: string,
  location: string,
  extra_info: string,
};

/**
 * Concatenate course code and course name into one entry, e.g. CALC 1000: Calculus I
 * @param courseCode
 * @param courseName
 * @returns The concatenated full course name
 */
export function formatFullCourseName(courseCode: string, courseName: string) {
  return `${courseCode}: ${courseName}`;
}

/**
 * Search for courses stored in the database.
 * @param query The substring to match course names/codes with
 * @returns The list of courses that match the given query
 */
async function searchCourses(query: string) {
  const matched_courses = await db.select({
    course_code: courses.course_code,
    course_name: courses.course_name
  }).from(courses).where(
    or(
      like(courses.course_code, `%${query}%`), 
      like(courses.course_name, `%${query}%`)
    )
  );

  return matched_courses.map(
    ({ course_code, course_name }) => (
      formatFullCourseName(course_code, course_name)
    )
  );
}

/**
 * Get all courses stored in the database.
 * @returns The list of courses formatted as '<COURSE_CODE>: <COURSE_NAME>'
 */
async function getCourses() {
  const all_courses = await db.select({
    course_code: courses.course_code,
    course_name: courses.course_name
  }).from(courses);
  return all_courses.map(
    ({ course_code, course_name }) => (
      formatFullCourseName(course_code, course_name)
    )
  );
}

/**
 * Get the course information stored in the database for a given course.
 * @param courseCode The course code of the course to fetch
 * @returns The course information stored in the database
 */
async function getCourse(courseCode: string) {
  const course = await db.select({
    course_code: courses.course_code,
    course_name: courses.course_name,
    antirequisites: courses.antirequisites,
    prerequisites: courses.prerequisites,
    description: courses.description,
    location: courses.location,
    extra_info: courses.extra_info
  }).from(courses).where(
    eq(courses.course_code, courseCode)
  ).limit(1);

  return course;
}

export {
  getCourses,
  getCourse,
  searchCourses,
};