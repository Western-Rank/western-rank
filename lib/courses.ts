import db from './database/database';

async function getCourses() {
  return await db.any('SELECT course_code, course_name FROM courses;');
}

export {
  getCourses
};