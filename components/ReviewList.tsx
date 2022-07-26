/**
 * The modal displaying all reviews on the course page.
 */

import React from 'react';
import { CourseReview } from '../lib/reviews';
import Review from './Review';
import ReviewPrompt from './ReviewPrompt';
import { useUser } from '@auth0/nextjs-auth0';

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
      setShowReviewPrompt(true);
  }

  return (
    <>
      <p>Course Reviews (247)</p>
      <label htmlFor="sort">Sort By</label>

      <select name="sort">
        <option value="recent">Recent</option>
        <option value="top">Top</option>
      </select>

      <button onClick={onShowReview}>Write a review</button>

      {showReviewPrompt && <ReviewPrompt courseCode={courseCode} />}

      {reviews.map(courseReview => <Review courseReview={courseReview} />)}
    </>
  );
}

export default ReviewList;