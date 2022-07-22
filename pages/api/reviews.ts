import type { NextApiRequest, NextApiResponse } from 'next'

import db from './database/database';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'GET': getReviews(req, res); break;
    case 'POST': postReviews(req, res); break;
    default: res.send('Invalid API route'); break;
  }
}

/**
 * Get reviews for a specific course.
 * @param req
 * @param res
 */
async function getReviews(req: NextApiRequest, res: NextApiResponse) {
  try {
    let course_code = req.query.course_code;
    const reviews = await db.any(`SELECT * FROM reviews WHERE course_code='${course_code}';`);
    res.send(reviews);
  } catch (err: any) {
    res.send(`Error: ${err.message}\nDetails: ${err.details}`);
  }
}

/**
 * Post a review for a specific course.
 * @param req 
 * @param res 
 */
async function postReviews(req: NextApiRequest, res: NextApiResponse) {
  console.log(req.body);
  const {
    course_code,
    professor,
    review,
    email,
    difficulty,
    liked,
    attendance,
    enthusiasm
  } = req.body;
  try {
    await db.none(`INSERT INTO reviews(
      course_code,
      professor,
      review,
      email,
      difficulty,
      liked,
      attendance,
      enthusiasm
    ) VALUES(
      '${course_code}',
      '${professor}',
      '${review}',
      '${email}',
      ${parseFloat(difficulty)},
      ${liked},
      ${parseInt(attendance)},
      ${parseInt(enthusiasm)}
    );`);
    const msg = `POST /api/reviews: ${JSON.stringify(req.body)}`;
    res.send(msg);
  } catch (err: any) {
    res.send(`Error: ${err.message}\nDetails: ${err.details}`);
  }
}