/**
 * Course review page for the given course_code
 */

import { GetServerSideProps } from 'next';
import { Course, getCourse } from '../../lib/courses';
import { getReviews, postReview, CourseReview } from '../../lib/reviews';
import Navbar from '../../components/Navbar';
import ReviewList from '../../components/ReviewList';
import ReviewPrompt from '../../components/ReviewPrompt';
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Stack,
  Typography,
  useTheme
} from '@mui/material'
import React from 'react';
import { useUser } from '@auth0/nextjs-auth0';

const testReviews: CourseReview[] = [
  {
    course_code: "AAAA 1000",
    professor: "Professor A",
    review: "An amazing adult awesomely aggregrating additive assignments",
    email: "a@awwscar.ca",
    difficulty: 1,
    liked: true,
    attendance: 11,
    enthusiasm: 24,
    anon: false,
    date_created: new Date(),
    last_edited: new Date(),
  },
  {
    course_code: "BBBB 2222",
    professor: "Professor B",
    review: "Bad, barely beautiful, boring. BAD!",
    email: "b@bing.com",
    difficulty: 10,
    liked: false,
    attendance: 22,
    enthusiasm: 30,
    anon: true,
    date_created: new Date(),
    last_edited: new Date(),
  }
];

interface CourseProps {
  reviews: CourseReview[], // all course reviews for this course
  thisCourse: Course, // the course information for the course displayed on this page
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  // provided by the dynamic route, e.g. /course/CALC1000
  const { course_code } = context.params as { course_code: string };
  return {
    props: {
      reviews: await getReviews(course_code),
      thisCourse: await getCourse(course_code),
    }
  }
}

const Course = ({ reviews, thisCourse }: CourseProps) => {
  const [showReviewPrompt, setShowReviewPrompt] = React.useState(false);
  const { user } = useUser();

  const onShowReview = () => {
    if (!user) 
      alert("You must be logged in to post a review");
    else
      setShowReviewPrompt(true);
  }
  const theme = useTheme();
  return (
    <>
      <header><Navbar searchBar /></header>

      <br></br>

      <Box id="main" width="90%" maxWidth="1270px" margin="auto" >
        <Card sx={{ margin: "auto", padding: "15px", maxWidth: "1000px" }}>
          <CardContent>
            <Typography variant="h4">{thisCourse.course_code}</Typography>
            <Typography variant="h5">{thisCourse.course_name}</Typography>
            <Typography>{thisCourse.description}</Typography>
          </CardContent>

          <CardMedia>
          </CardMedia>
        </Card>
        
        <Box>
          <button onClick={onShowReview}>Write a review</button>
          {showReviewPrompt && <ReviewPrompt courseCode={thisCourse.course_code} />}
        </Box>

        <Stack display="flex" flexWrap="wrap" direction={{ xs: "column", lg: "row"}} spacing={2}>
          <Box maxWidth="900px" margin="auto">
            <ReviewList courseCode={thisCourse.course_code} reviews={testReviews} />
          </Box>
          
          <Box margin="auto">
            <Card id="infoPanel" sx={{ margin: "auto", padding: "15px", maxWidth: "300px"}}>
              <h2>Prerequisites</h2>
              <p>{thisCourse.prerequisites}</p>
              <h2>Antirequisites</h2>
              <p>{thisCourse.antirequisites || "None"}</p>
              <h2>Extra Info</h2>
              <p>{thisCourse.extra_info}</p>
              <h2>Locations</h2>
              <p>{thisCourse.location}</p>
            </Card>
          </Box>
        </Stack>
      </Box>

      
    </>
  )
}

export default Course



