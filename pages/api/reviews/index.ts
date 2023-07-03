import type { SortKey, SortOrder } from "@/lib/reviews";
import type { Course_Review } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { createReview, getReviewsbyCourse } from "../../../services/review";
import { authOptions } from "../auth/[...nextauth]";
import { createReviewSchema } from "./[id]";

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
    case "POST":
      return handlePostReview(req, res);
    default:
      return res.status(403).send("Invalid API route");
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
      const [reviews, [count, userReview]] = await getReviewsbyCourse({
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
    console.log(err);
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
    const data = await getServerSession(req, res, authOptions);
    if (!data?.user) {
      throw new Error("Failed to authenticate.");
    }

    const review = createReviewSchema.parse(JSON.parse(req.body));

    const result = await createReview(review);

    console.log(`Created the review: ${result.review_id}`);

    return res.status(200).json({ message: "Review created" });
  } catch (err: any) {
    console.log(err);
    console.log(req.body.date_taken);
    return res.status(500).send(`Error: ${err.message}\nDetails: ${err.details}`);
  }
}
