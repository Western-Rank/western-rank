/**
 * The component for submitting a review and its related information.
 */

import React from 'react';
import { useUser } from '@auth0/nextjs-auth0';

interface ReviewPromptProps {
  courseCode: string,
}

/**
 *  course_code,
    professor,
    review,
    email,
    difficulty,
    liked,
    attendance,
    enthusiasm,
    anon,
    date_created,
    last_edited
 */

const ReviewPrompt = ({ courseCode }: ReviewPromptProps) => {
  const { user } = useUser();
  return (
    <>
      <h1>Review</h1>
      <p>Minimum 15 words</p>
      <textarea name="review" form="review-form" />
  
      {/* i know we shouldn't use <br /> like this but this is just a mockup :) */}
      <form action="/api/reviews" method="post" id="review-form">
        {/* fixed inputs not chosen by the user */}
        <input type="hidden" name="course_code" defaultValue={courseCode} />
        <input type="hidden" name="email" defaultValue={user!.email!} />
        <input type="hidden" name="date_created" defaultValue={(new Date()).toDateString()} />
        <input type="hidden" name="last_edited" defaultValue={(new Date()).toDateString()} />
        
        <br />
        <label htmlFor="liked">Did you like this course?</label>
        <label htmlFor="liked-yes">Yes</label>
        <input type="radio" id="liked-yes" name="liked" value="true" required />
        <label htmlFor="liked-no">No</label>
        <input type="radio" id="liked-no" name="liked" value="false" required />

        <br />
        <label htmlFor="difficulty">How difficult was the course content and/or evaluations?</label>
        <input type="number" name="difficulty" min="1" max="5" required/> 
        
        <br />
        <label htmlFor="enthusiasm">How excited were you about the course?</label>
        <input type="number" name="enthusiasm" min="1" max="5" required/>

        <br />
        <label htmlFor="attendance">What % of lectures did you attend?</label>
        <input type="number" name="attendance" min="0" max="100" required/>
        
        <br />
        <label htmlFor="professor">Professor:</label>
        <input name="professor" required/>
        
        <br />
        <label htmlFor="anon">Submit anonymously</label>
        <label htmlFor="anon-yes">Yes</label>
        <input type="radio" id="anon-yes" name="anon" value="true" required />
        <label htmlFor="anon-no">No</label>
        <input type="radio" id="anon-no" name="anon" value="false" required />
        
        <br />
        <input type="submit"></input>
      </form>
    </>
  );
}

export default ReviewPrompt;