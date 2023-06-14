import type { NextApiRequest, NextApiResponse } from "next";
import {
  Course_Review_Create,
  createReview,
  deleteReview,
  getReviewsbyCourse,
  getReviewsbyUser,
  upsertReview,
} from "../../services/review";
import type { Course_Review } from "@prisma/client";
import type { SortKey, SortOrder } from "@/components/ReviewList";
import { getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth]";

export type Course_ReviewsData = {
  reviews: Course_Review[];
  userReview?: Course_Review;
  _count: {
    review_id: number;
  };
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case "GET":
      return handleGetReviews(req, res);
    case "PUT":
      return handlePutReview(req, res);
    case "POST":
      return handlePostReview(req, res);
    case "DELETE":
      return handleDeleteReview(req, res);
    default:
      return res.send("Invalid API route");
  }
}

/**
 * Get reviews for a course given a course code from the database.
 * @param req A request containing query parameter(s):
 *  - course_code: the course_code of the course whose reviews that will be returned
 *  - email: the email of the user whose reviews will be returned
 * @param res
 */
async function handleGetReviews(req: NextApiRequest, res: NextApiResponse) {
  try {
    const data = await getServerSession(req, res, authOptions);
    const email = data?.user?.email;
    const { course_code, sortKey, sortOrder, take } = req.query as {
      course_code?: string;
      sortKey: SortKey;
      sortOrder: SortOrder;
      take?: string;
    };

    if (course_code) {
      const [reviews, count, userReview] = await getReviewsbyCourse({
        courseCode: course_code,
        sortKey: sortKey,
        sortOrder: sortOrder,
        take: take ? parseInt(take) : undefined,
        email: email ?? undefined,
      });
      return res.status(200).json({
        reviews: reviews,
        _count: count._count,
        userReview: userReview ?? undefined,
      } as Course_ReviewsData);
    } else {
      throw new Error("Must specify either a course code or email of reviews exclusively.");
    }
  } catch (err: any) {
    return res.send(`Error: ${err.message}\nDetails: ${err.details}`);
  }
}

/**
 * Delete a review from the database.
 * @param req A request containing query parameters:
 *  - email: the email of the review to remove
 *  - course_code: the course_code for the review
 */
async function handleDeleteReview(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { email, course_code } = req.query as {
      email: string;
      course_code: string;
    };
    await deleteReview(email, course_code);
    return res.status(200).json({ message: "Review deleted" });
  } catch (err: any) {
    return res.status(500).send(`Error: ${err.message}\nDetails: ${err.details}`);
  }
}

/**
 * Post a review to the database.
 * @param req A request containing the course review formatted as a JSON in the body.
 * @param res
 */
async function handlePostReview(req: NextApiRequest, res: NextApiResponse) {
  try {
    const review = JSON.parse(req.body);
    console.log(review);
    const result = await createReview(review);

    console.log(`Created the review: ${result.review_id}`);

    return res.status(200).json({ message: "Review created" });
  } catch (err: any) {
    return res.status(500).send(`Error: ${err.message}\nDetails: ${err.details}`);
  }
}

/**
 * Update a review in the database.
 * @param req A request containing the course review formatted as a JSON in the body.
 * @param res
 */
async function handlePutReview(req: NextApiRequest, res: NextApiResponse) {
  try {
    const review = req.body as Course_Review;
    await upsertReview(review);
    return res.status(200).json({ message: "Review updated" });
  } catch (err: any) {
    return res.status(500).send(`Error: ${err.message}\nDetails: ${err.details}`);
  }
}
