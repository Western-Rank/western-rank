import db from './database/database';

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
 * Get all course stored in the database.
 * @returns The list of courses formatted as '<COURSE_CODE>: <COURSE_NAME>'
 */
async function getCourses() {
  const courses = await db.any('SELECT course_code, course_name FROM courses;');
  // concatenate course_code and course_name into one entry, e.g. CALC 1000: Calculus 1
  return courses.map(({ course_code, course_name }) => `${course_code}: ${course_name}`);
}

/**
 * Get the course information stored in the database for a given course.
 * @param courseCode The course code of the course to fetch
 * @returns The course information stored in the database
 */
async function getCourse(courseCode: string) {
  const course = await db.one('SELECT * from courses where course_code = $1', courseCode) as Course;
  return course;
}

export {
  getCourses,
  getCourse,
};