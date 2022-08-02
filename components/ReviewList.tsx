/**
 * The modal displaying all reviews on the course page.
 */

import React from 'react';
import { CourseReview } from '../lib/reviews';
import Review from './Review';
import ReviewPrompt from './ReviewPrompt';
import { useUser } from '@auth0/nextjs-auth0';
import { Box, Grid, Stack, Button } from '@mui/material'

interface ReviewListProps {
  isProfile: boolean,
  courseCode?: string,
  reviews: CourseReview[]
}

const ReviewList = ({ isProfile, courseCode, reviews }: ReviewListProps) => {
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
          <p>Course Reviews ({reviews.length})</p>
          {!isProfile && <Button color="secondary" onClick={onShowReview}>Write a review</Button>}
        </Stack>
      </Stack>
      <label htmlFor="sort">Sort By</label>

      <select name="sort">
        <option value="recent">Recent</option>
        <option value="top">Top</option>
      </select>
      
      <br></br>

      {!isProfile && showReviewPrompt && <ReviewPrompt courseCode={courseCode!} />}

      <Stack spacing={2}>
        {reviews.map(courseReview => <Review key={courseReview.email} courseReview={courseReview} />)}
      </Stack>
    </>
  );
}

export default ReviewList;