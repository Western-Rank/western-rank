import { Course_Review, Prisma } from "@prisma/client";
import { prisma } from "../lib/db";
import { SortKey, SortOrder } from "@/components/ReviewList";
import { count } from "console";

export type Course_Review_Create = Omit<
  Course_Review,
  "review_id" | "date_created" | "last_edited"
>;

/**
 * Create a review for a course.
 * @param review review to be created
 * @returns the review created
 */
export async function createReview(review: Course_Review_Create) {
  const userReview = await prisma.course_Review.findFirst({
    where: {
      course_code: review.course_code,
      email: review.email,
    },
  });

  if (userReview) {
    throw new Error(`Review for ${review.course_code} from ${review.email} already exists`);
  }

  return prisma.course_Review.create({
    data: review,
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
  email,
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
      email: {
        not: email,
      },
    },
    orderBy: {
      [sortKey]: sortOrder,
    },
    take: take,
  });

  const userReview = prisma.course_Review.findFirst({
    where: {
      course_code: courseCode,
      email: email,
    },
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

  if (email) {
    return prisma.$transaction([reviewsQuery, countQuery, userReview]);
  } else {
    return prisma.$transaction([reviewsQuery, countQuery]);
  }
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
export function deleteReview(review_id: number) {
  return prisma.course_Review.delete({
    where: {
      review_id: review_id,
    },
  });
}
