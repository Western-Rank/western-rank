import { and, eq } from 'drizzle-orm';
import { db } from './database/db';
import { course_reviews } from './database/schema';

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
    last_edited: course_reviews.last_edited
  }).from(course_reviews).where(
    eq(course_reviews.course_code, courseCode)
  )
  return all_reviews as CourseReview[];
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
  return all_user_reviews as CourseReview[];
}

/**
 * Delete specific review.
 * @param email The email of the user
 * @param courseCode The course code
 */
async function deleteReview(email: string, courseCode: string) {
  return await db.delete(course_reviews).where(and(
    eq(course_reviews.email, email),
    eq(course_reviews.course_code, courseCode)
  ))
}

/**
 * Post a review.
 * @param courseReview The review to post
 */
async function postReview(courseReview: CourseReview) {
  await db.insert(course_reviews).values(courseReview);
}

export {
  getReviews,
  getUserReviews,
  deleteReview,
  postReview,
};