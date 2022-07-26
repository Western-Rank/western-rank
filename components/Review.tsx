import React from 'react';
import {CourseReview} from '../lib/reviews';
import {} from '@auth0/nextjs-auth0';
import StatMeter, { MeterType } from './StatMeter';
import Link from 'next/link';

// profile pic, review text,

interface ReviewProps {
    courseReview: CourseReview
}

const Review = ({ courseReview }: ReviewProps) => {
    return (
        <>
            <div className="review">
                <img src="https://titles.trackercdn.com/valorant-api/agents/9f0d8ba9-4140-b941-57d3-a7ad57c6b417/displayicon.png" width="50" height="50" className="reviewPic"></img>
                <div className="reviewBody">
                    <p>{courseReview.review}</p>
                    <p><strong>{courseReview.anon ? "Anonymous" : courseReview.email.split("@")[0]}</strong></p>
                </div>
                <div className="statBlock">
                    <StatMeter title="Difficulty" value={courseReview.difficulty} type={MeterType.Star}></StatMeter>
                    <StatMeter title="Enthusiasm" value={courseReview.enthusiasm} type={MeterType.Star}></StatMeter>
                    <StatMeter title="Attended" value={courseReview.attendance} type={MeterType.Percentage}></StatMeter>
                    <StatMeter title="Liked" value={courseReview.liked} type={MeterType.Flag}></StatMeter>
                </div>
            </div>
        </>
    );
}

export default Review;