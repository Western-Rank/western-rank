import type { NextApiRequest, NextApiResponse } from 'next'

import db from './database/database';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'GET': getCourses(req, res); break;
    default: res.send('Invalid API route'); break;
  }
}

/**
 * Get all courses from the database.
 * @param req 
 * @param res 
 */
async function getCourses(req: NextApiRequest, res: NextApiResponse) {
  try {
    const courses = await db.any('SELECT * FROM courses;');
    res.send(courses);
  } catch (err: any) {
    res.send(`Error: ${err.message}\nDetails: ${err.details}`);
  }
}