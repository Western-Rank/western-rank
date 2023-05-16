import { and, eq } from 'drizzle-orm';
import { db } from './database/db';
import { course_reviews } from './database/schema';

type Term = 'fall' | 'winter' | 'summer';
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
  last_edited: Date,
  term_taken: Term,
  year_taken: number,
};

/**
 * Get the school semester/term given the month (as a number).
 * @param month (0-11) representation of the month
 * @returns the school term of type Term ('fall', 'winter', 'summer')
 */
function getTermFromMonth(month: number): Term {
    /**
   * fall: sept (9), oct (10), nov (11), dec (12)
   * winter: jan (1), feb (2), march (3), april (4)
   * summer: may (5), june (6), july (7), august (8)
   */

  if (9 <= month && month <= 12)
    return 'fall'
  else if (1 <= month && month <= 4)
    return 'winter'
  else
    return 'summer'
}

/**
 * Get the school term and year from a JavaScript date object.
 * @param date A JavaScript date object.
 * @returns the school term and year as an array [term: Term, year: number]
 */
function convertDateToTermAndYear(date: Date): [Term, number] {
  const year = date.getFullYear();
  const term = getTermFromMonth(date.getMonth());

  return [term, year];
}

/**
 * Get reviews for a specific course.
 * @param courseCode The course code of the course
 */
async function getReviews(courseCode: string) {
  const all_reviews = await db.select({
    course_code: course_reviews.course_code,
    professor: course_reviews.professor,
    review: course_reviews.review,
    email: course_reviews.email,
    difficulty: course_reviews.difficulty,
    liked: course_reviews.liked,
    attendance: course_reviews.attendance,
    enthusiasm: course_reviews.enthusiasm,
    anon: course_reviews.anon,
    date_created: course_reviews.date_created,
    last_edited: course_reviews.last_edited,
    date_taken: course_reviews.date_taken,
  }).from(course_reviews).where(
    eq(course_reviews.course_code, courseCode)
  )

  return all_reviews.map(review => {
    const { date_taken, ...review_without_date_taken } = review;
    const [term_taken, year_taken] = convertDateToTermAndYear(date_taken as Date)

    return {
      term_taken,
      year_taken,
      ...review_without_date_taken
    }
  }) as CourseReview[];
}

/**
 * Get reviews for a specific user.
 * @param email The email of the user
 */
async function getUserReviews(email: string) {
  const all_user_reviews = await db.select({
    course_code: course_reviews.course_code,
    professor: course_reviews.professor,
    review: course_reviews.review,
    email: course_reviews.email,
    difficulty: course_reviews.difficulty,
    liked: course_reviews.liked,
    attendance: course_reviews.attendance,
    enthusiasm: course_reviews.enthusiasm,
    anon: course_reviews.anon,
    date_created: course_reviews.date_created,
    last_edited: course_reviews.last_edited
  }).from(course_reviews).where(
    eq(course_reviews.email, email)
  )
  console.log('All reviews from the user with email ', email, all_user_reviews)
  return all_user_reviews as CourseReview[];
}

/**
 * Delete specific review.
 * @param email The email of the user
 * @param courseCode The course code
 */
async function deleteReview(email: string, courseCode: string) {
  console.log('Deleting Review from user ', email, ' for course ', courseCode);
  await db.delete(course_reviews).where(and(
    eq(course_reviews.email, email),
    eq(course_reviews.course_code, courseCode)
  ))
}

/**
 * Post a review.
 * @param courseReview The review to post
 */
async function postReview(courseReview: CourseReview) {
  console.log("Inserting Review\n", courseReview);
  await db.insert(course_reviews).values(courseReview);
}

export {
  getReviews,
  getUserReviews,
  deleteReview,
  postReview,
};