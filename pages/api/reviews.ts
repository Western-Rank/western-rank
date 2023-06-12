import type { NextApiRequest, NextApiResponse } from "next";
import {
  Course_Review_Create,
  createReview,
  deleteReview,
  getReviewsbyCourse,
  getReviewsbyUser,
  upsertReview,
} from "../../services/review";
import { Course_Review } from "@prisma/client";

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
    const { course_code, email } = req.query as {
      course_code?: string;
      email?: string;
    };
    if (course_code && !email) {
      const reviews = await getReviewsbyCourse(course_code);
      return res.status(200).json(reviews);
    } else if (email && !course_code) {
      const reviews = await getReviewsbyUser(email);
      return res.status(200).json(reviews);
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
    return res.send(`Error: ${err.message}\nDetails: ${err.details}`);
  }
}

/**
 * Post a review to the database.
 * @param req A request containing the course review formatted as a JSON in the body.
 * @param res
 */
async function handlePostReview(req: NextApiRequest, res: NextApiResponse) {
  try {
    const review = req.body as Course_Review_Create;
    await createReview(review);
    return res.status(200).json({ message: "Review updated" });
  } catch (err: any) {
    return res.send(`Error: ${err.message}\nDetails: ${err.details}`);
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
    return res.send(`Error: ${err.message}\nDetails: ${err.details}`);
  }
}
