import { Course_Review_Create, deleteReview, upsertReview } from "@/services/review";
import type { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case "PUT":
      return handlePutReview(req, res);
    case "DELETE":
      return handleDeleteReview(req, res);
    default:
      return res.status(403).send("Invalid API route");
  }
}

/**
 * Update a review in the database.
 * @param req A request containing the course review formatted as a JSON in the body.
 * @param res
 */
async function handlePutReview(req: NextApiRequest, res: NextApiResponse) {
  try {
    const review = JSON.parse(req.body) as Course_Review_Create;
    const { id } = req.query as {
      id: string;
    };
    const upsert_res = await upsertReview(parseInt(id), review);
    console.log(`Updated ${upsert_res.review_id} ${upsert_res?.course_code} ${upsert_res?.email}`);
    return res.status(200).json({ message: "Review updated" });
  } catch (err: any) {
    return res.status(500).send(`Error: ${err.message}\nDetails: ${err.details}`);
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
