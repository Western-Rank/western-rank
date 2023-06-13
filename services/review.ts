import { Course_Review, Prisma } from "@prisma/client";
import { prisma } from "../lib/db";
import { SortKey, SortOrder } from "@/components/ReviewList";

export type Course_Review_Create = Omit<
  Course_Review,
  "review_id" | "date_created" | "last_edited"
>;

/**
 * Create a review for a course.
 * @param review review to be created
 * @returns the review created
 */
export function createReview(review: Course_Review_Create) {
  const new_review = {
    ...review,
    date_created: new Date(),
    last_edited: new Date(),
  } as Course_Review;
  return prisma.course_Review.create({
    data: new_review,
  });
}

/**
 * Get reviews for a specific course.
 * @param courseCode Course code of the course
 * @returns List of reviews for the course
 */
export function getReviewsbyCourse({
  courseCode,
  sortKey,
  sortOrder,
  take,
}: {
  courseCode: string;
  sortKey: SortKey;
  sortOrder: SortOrder;
  take?: number;
  email?: string;
}) {
  const reviewsQuery = prisma.course_Review.findMany({
    where: {
      course_code: courseCode,
      review: {
        not: null,
      },
    },
    orderBy: {
      [sortKey]: sortOrder,
    },
    take: take,
  });

  const countQuery = prisma.course_Review.aggregate({
    _count: {
      review_id: true,
    },
    where: {
      course_code: courseCode,
      review: {
        not: null,
      },
    },
    orderBy: {
      [sortKey]: sortOrder,
    },
  });

  const reviewsData = prisma.$transaction([reviewsQuery, countQuery]);

  return reviewsData;
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
  });
}

export function updateReview(review: Course_Review) {
  return prisma.course_Review.update({
    where: {
      review_id: review.review_id,
    },
    data: review,
  });
}

export function upsertReview(review: Course_Review) {
  return prisma.course_Review.upsert({
    where: {
      review_id: review.review_id,
    },
    create: review,
    update: review,
  });
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
  });
}
