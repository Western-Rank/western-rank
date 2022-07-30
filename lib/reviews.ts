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
    const reviews = await db.any(`SELECT * FROM reviews WHERE course_code = $1;`, courseCode);
    return reviews as CourseReview[];
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
  ) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9);`, [
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
  ]);
}

export {
  getReviews,
  postReview
};