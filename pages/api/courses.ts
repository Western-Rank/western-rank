import type { NextApiRequest, NextApiResponse } from 'next'

import { getAllCourses } from '../../lib/courses';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'GET': await getCourses(req, res); break;
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
    const courses = await getAllCourses()
    res.send(courses);
  } catch (err: any) {
    res.send(`Error: ${err.message}\nDetails: ${err.details}`);
  }
}