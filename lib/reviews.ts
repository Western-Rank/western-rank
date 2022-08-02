import db from './database/database';

export interface CourseReview {
  course_code: string,
  professor: string,
  review: string,
  email: string,
  difficulty: number,
  liked: boolean,
  attendance: number,
  enthusiasm: number,
  anon: boolean,
  date_created: Date,
  last_edited: Date
};

/**
 * Get reviews for a specific course.
 * @param courseCode The course code of the course
 */
async function getReviews(courseCode: string) {
    const reviews = await db.any(`SELECT course_code,
    professor,
    review,
    email,
    difficulty,
    liked,
    attendance,
    enthusiasm,
    anon,
    date_created,
    last_edited FROM reviews WHERE course_code = $1;`, courseCode);
    return reviews as CourseReview[];
}

/**
 * Get reviews for a specific user.
 * @param email The email of the user
 */
async function getUserReviews(email: string) {
  const reviews = await db.any(`SELECT course_code,
  professor,
  review,
  email,
  difficulty,
  liked,
  attendance,
  enthusiasm,
  anon,
  date_created,
  last_edited FROM reviews WHERE email = $1;`, email);
  return reviews as CourseReview[];
}

/**
 * Delete specific review.
 * @param email The email of the user
 * @param course_code The course code
 */
function deleteReview(email: string, course_code: string) {
  return db.none(`DELETE FROM reviews WHERE email = $1 AND course_code = $2`, 
    [email, course_code]);
}

/**
 * Post a review.
 * @param courseReview The review to post
 */
async function postReview(courseReview: CourseReview) {
  const {
    course_code,
    professor,
    review,
    email,
    difficulty,
    liked,
    attendance,
    enthusiasm,
    anon,
    date_created,
    last_edited
  } = courseReview;
  await db.none(`INSERT INTO reviews(
    course_code,
    professor,
    review,
    email,
    difficulty,
    liked,
    attendance,
    enthusiasm,
    anon,
    date_created,
    last_edited
  ) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11);`, [
    course_code,
    professor,
    review,
    email,
    difficulty*20,
    liked,
    attendance,
    enthusiasm*20,
    anon,
    date_created,
    last_edited
  ]);
}

export {
  getReviews,
  getUserReviews,
  deleteReview,
  postReview,
};