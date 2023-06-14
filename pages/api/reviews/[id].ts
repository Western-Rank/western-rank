import { deleteReview } from "@/services/review";
import type { NextApiRequest, NextApiResponse } from "next";

/**
 * Delete a review from the database.
 * @param req A request containing query parameters:
 *  - email: the email of the review to remove
 *  - course_code: the course_code for the review
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { id } = req.query as {
      id: string;
    };
    const delete_res = await deleteReview(parseInt(id));
    console.log(`Deleted ${delete_res.review_id} ${delete_res?.course_code} ${delete_res?.email}`);
    return res.status(200).json({ message: `Review ${id} deleted` });
  } catch (err: any) {
    console.log(err.message);
    return res.status(500).send(`Error: ${err.message}\nDetails: ${err.details}`);
  }
}
