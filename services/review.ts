import { Course_Review } from "@prisma/client"
import { prisma } from "../lib/db"

/**
 * Create a review for a course.
 * @param review review to be created
 * @returns the review created
 */
export function createReview(review: Course_Review) {
  return prisma.course_Review.create({
    data: review,
  })
}

/**
 * Get reviews for a specific course.
 * @param courseCode Course code of the course
 * @returns List of reviews for the course
 */
export function getReviewsbyCourse(courseCode: string) {
  return prisma.course_Review.findMany({
    where: {
      course_code: courseCode,
    },
  })
}

/**
 * Get reviews for a specific user.
 * @param email email of the user
 * @returns List of reviews for the user
 */
export function getReviewsbyUser(email: string) {
  return prisma.course_Review.findMany({
    where: {
      email: email,
    },
  })
}

export function updateReview(review: Course_Review) {
  return prisma.course_Review.update({
    where: {
      review_id: review.review_id,
    },
    data: review,
  })
}

/**
 * Delete specific review by a user for a course.
 * @param email email of the user
 * @param courseCode course code of the course
 * @returns list of reviews for the user and course
 */
export function deleteReview(email: string, courseCode: string) {
  // use deleteMany() since delete() can only use review id
  return prisma.course_Review.deleteMany({
    where: {
      email: email,
      course_code: courseCode,
    },
  })
}
