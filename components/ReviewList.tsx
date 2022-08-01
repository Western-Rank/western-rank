/**
 * The modal displaying all reviews on the course page.
 */

import React from 'react';
import { CourseReview } from '../lib/reviews';
import Review from './Review';
import ReviewPrompt from './ReviewPrompt';
import { useUser } from '@auth0/nextjs-auth0';
import { Box, Grid, Stack } from '@mui/material'

interface ReviewListProps {
  courseCode: string,
  reviews: CourseReview[]
}

const ReviewList = ({ courseCode, reviews }: ReviewListProps) => {
  const [showReviewPrompt, setShowReviewPrompt] = React.useState(false);
  const { user } = useUser();

  const onShowReview = () => {
    if (!user) 
      alert("You must be logged in to post a review");
    else
      setShowReviewPrompt((oldValue: boolean) => !oldValue);
  }

  return (
    <>
      <Stack>
        <Stack direction="row" justifyContent="space-between">
          <p>Course Reviews (247)</p>
          <button onClick={onShowReview}>Write a review</button>
        </Stack>
      </Stack>
      <label htmlFor="sort">Sort By</label>

      <select name="sort">
        <option value="recent">Recent</option>
        <option value="top">Top</option>
      </select>
      
      <br></br>

      {showReviewPrompt && <ReviewPrompt courseCode={courseCode} />}

      <Stack spacing={2}>
        {reviews.map(courseReview => <Review key={courseReview.email} courseReview={courseReview} />)}
      </Stack>
    </>
  );
}

export default ReviewList;