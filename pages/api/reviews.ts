import type { NextApiRequest, NextApiResponse } from "next"
import { createReview, deleteReview, upsertReview } from "../../services/review"
import { Course_Review } from "@prisma/client"

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case "DELETE":
      handleDeleteReview(req, res)
      break
    case "PUT":
    case "POST":
      handlePostReview(req, res)
      break
    default:
      res.send("Invalid API route")
      break
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
      email: string
      course_code: string
    }
    await deleteReview(email, course_code)
    res.status(200).end()
  } catch (err: any) {
    res.send(`Error: ${err.message}\nDetails: ${err.details}`)
  }
}

/**
 * Post a review to the database.
 * @param req A request containing the course review formatted as a JSON in the body.
 * @param res
 */
async function handlePostReview(req: NextApiRequest, res: NextApiResponse) {
  try {
    const review = req.body as Course_Review
    await upsertReview(review)
    res.status(200).end()
  } catch (err: any) {
    res.send(`Error: ${err.message}\nDetails: ${err.details}`)
  }
}
