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
  const courses = await db.any(`
    SELECT course_code, course_name 
    FROM courses 
    WHERE 
      course_code LIKE '%$1#%'
      OR course_name LIKE '%$1#%'
  `, query.toUpperCase());
  return courses.map(
    ({ course_code, course_name }) => formatFullCourseName(course_code, course_name)
  );
}

/**
 * Get all courses stored in the database.
 * @returns The list of courses formatted as '<COURSE_CODE>: <COURSE_NAME>'
 */
async function getCourses() {
  const courses = await db.any('SELECT course_code, course_name FROM courses;');
  return courses.map(
    ({ course_code, course_name }) => formatFullCourseName(course_code, course_name)
  );
}

/**
 * Get the course information stored in the database for a given course.
 * @param courseCode The course code of the course to fetch
 * @returns The course information stored in the database
 */
async function getCourse(courseCode: string) {
  const course = await db.one('SELECT course_code, course_name, antirequisites, prerequisites, description, location, extra_info from courses where course_code = $1', courseCode) as Course;
  return course;
}

export {
  getCourses,
  getCourse,
  searchCourses,
};