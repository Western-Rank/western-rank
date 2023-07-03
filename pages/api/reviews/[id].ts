import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { deleteReview, getReviewById, upsertReview } from "@/services/review";
import { Term } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { z } from "zod";

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

export const createReviewSchema = z.object({
  course_code: z.string({ invalid_type_error: "Invalid Course Code" }).nonempty(),
  email: z.string({ invalid_type_error: "Invalid Email" }).email(),
  professor_name: z
    .string({
      invalid_type_error: "Invalid Professor Name",
      required_error: "Professor is required",
    })
    .nonempty("Professor is required"),
  professor_id: z
    .number({ invalid_type_error: "Invalid Professor Id", required_error: "Professor is required" })
    .int(),
  review: z.string({ invalid_type_error: "Invalid Review" }).min(30).max(800).nullable(),
  liked: z.boolean({
    invalid_type_error: "Invalid Liked (True or False)",
    required_error: "Liked is required",
  }),
  difficulty: z
    .number({
      invalid_type_error: "Invalid Difficulty",
      required_error: "Difficulty is required",
    })
    .min(0)
    .max(10),
  useful: z
    .number({
      invalid_type_error: "Invalid Useful",
      required_error: "Useful is required",
    })
    .min(0)
    .max(10),
  attendance: z
    .number({
      invalid_type_error: "Invalid Attendance",
      required_error: "Attendance is required",
    })
    .min(0)
    .max(100),
  anon: z.boolean({
    invalid_type_error: "Invalid Anonymous",
    required_error: "Choose if you want the review to be anonymous or not",
  }),
  date_taken: z.coerce
    .date()
    .max(new Date(), "Date taken cannot be in the future")
    .min(new Date(2010, 1, 1), "Date taken cannot be before 2010"),
  term_taken: z.nativeEnum(Term, {
    invalid_type_error: "Only Fall, Winter, or Summer are valid terms",
  }),
});

const putReviewQuerySchema = z.object({
  id: z
    .string({ invalid_type_error: "Invalid Review Id" })
    .transform((val) => parseInt(val))
    .pipe(z.number().int()),
});

/**
 * Update a review in the database.
 * @param req A request containing the course review formatted as a JSON in the body.
 * @param res
 */
async function handlePutReview(req: NextApiRequest, res: NextApiResponse) {
  try {
    const data = await getServerSession(req, res, authOptions);
    if (!data?.user) {
      throw new Error("Failed to authenticate.");
    }

    const { id } = putReviewQuerySchema.parse(req.query);
    const review = createReviewSchema.parse(JSON.parse(req.body));

    if (data?.user.email !== review.email) {
      throw new Error(`User ${data.user.email} not authenticated to update review ${id}`);
    }

    const upsert_res = await upsertReview(id, review);
    console.log(`Updated ${upsert_res.review_id} ${upsert_res?.course_code} ${upsert_res?.email}`);
    return res.status(200).json({ message: "Review updated" });
  } catch (err: any) {
    return res.status(500).send(`Error: ${err.message}\nDetails: ${err.details}`);
  }
}

/**
 * Delete a review from the database.
 * @param req A request containing query parameters:
 *  - id: the review_id of the review to be deleted.
 */
async function handleDeleteReview(req: NextApiRequest, res: NextApiResponse) {
  try {
    const data = await getServerSession(req, res, authOptions);
    if (!data?.user) {
      throw new Error("Failed to authenticate.");
    }

    const { id } = req.query as {
      id: string;
    };
    const review = await getReviewById(parseInt(id));

    if (data?.user?.email != review?.email) {
      throw new Error("You are not authorized to delete this review.");
    }

    const delete_res = await deleteReview(parseInt(id));
    console.log(`Deleted ${delete_res.review_id} ${delete_res?.course_code} ${delete_res?.email}`);
    return res.status(200).json({ message: `Review ${id} deleted` });
  } catch (err: any) {
    console.log(err.message);
    return res.status(500).send(`Error: ${err.message}\nDetails: ${err.details}`);
  }
}
