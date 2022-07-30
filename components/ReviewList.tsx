/**
 * The modal displaying all reviews on the course page.
 */

import React from 'react';
import { CourseReview } from '../lib/reviews';
import Review from './Review';
import ReviewPrompt from './ReviewPrompt';
import { useUser } from '@auth0/nextjs-auth0';
import { Box, Stack } from '@mui/material'

interface ReviewListProps {
  courseCode: string,
  reviews: CourseReview[]
}

const ReviewList = ({ courseCode, reviews }: ReviewListProps) => {
  return (
    <>
      <p>Course Reviews (247)</p>
      <label htmlFor="sort">Sort By</label>

      <select name="sort">
        <option value="recent">Recent</option>
        <option value="top">Top</option>
      </select>
      
      <br></br>

      <Stack
        spacing={2}
        width="95%"
        maxWidth="1000px"
        margin="auto">
        {reviews.map(courseReview => <Review courseReview={courseReview} />)}
      </Stack>
    </>
  );
}

export default ReviewList;