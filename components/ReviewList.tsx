/**
 * The modal displaying all reviews on the course page.
 */

import React from 'react';
import { CourseReview } from '../lib/reviews';
import Review from './Review';
import ReviewPrompt from './ReviewPrompt';
import { useUser } from '@auth0/nextjs-auth0';
import { useRouter } from 'next/router';
import { Box, Grid, Stack, Button, Typography } from '@mui/material'

interface ReviewListProps {
  isProfile: boolean,
  courseCode?: string,
  reviews: CourseReview[]
}

const ReviewList = ({ isProfile, courseCode, reviews }: ReviewListProps) => {
  const [showReviewPrompt, setShowReviewPrompt] = React.useState(false);
  const { user } = useUser();
  const router = useRouter();

  const userHasReview = !user || reviews.some(({ email }) => user.email === email);
  const reviewButtonText = !user
    ? 'Log in to write a review'
    : userHasReview ? 'Edit your review' : 'Write a review';

  const onShowReview = () => {
    if (!user) 
      alert("You must be logged in to post a review");
    else
      setShowReviewPrompt((oldValue: boolean) => !oldValue);
  }

  // called after the review deletes itself to update the review list
  const onDeleteReview = () => {
    router.replace(router.asPath);
  }

  return (
    <>
      <Stack>
        <Stack direction="row" justifyContent="space-between">
          <Typography>Course Reviews ({reviews.length})</Typography>
          {
            !isProfile && 
            <Button color="secondary" onClick={onShowReview} disabled={!user}>
              {reviewButtonText}
            </Button>
          }
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
        {reviews.map(courseReview => <Review
          key={courseReview.email}
          courseReview={courseReview}
          onDelete={onDeleteReview}
        />)}
      </Stack>
    </>
  );
}

export default ReviewList;