import type { NextApiRequest, NextApiResponse } from 'next'

import { postReview, CourseReview } from '../../lib/reviews';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'POST': handlePostReview(req, res); break;
    default: res.send('Invalid API route'); break;
  }
}

// review, enthusiasm, attendance, liked, email, course
/**
 * Post a review to the database.
 * @param req A request containing the course review formatted as a JSON in the body.
 * @param res 
 */
async function handlePostReview(req: NextApiRequest, res: NextApiResponse) {
  try {
    const review = req.body as CourseReview;
    await postReview(review);
  } catch (err: any) {
    res.send(`Error: ${err.message}\nDetails: ${err.details}`);
  }
}