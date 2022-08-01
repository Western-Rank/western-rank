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
  Grid,
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
  const theme = useTheme();
  return (
    <>
      <header><Navbar searchBar /></header>

      <br />

      <Box id="main" width="90%" maxWidth="1100px" margin="auto" >
        <Card>
          <CardContent>
            <Typography variant="h4">{thisCourse.course_code}</Typography>
            <Typography variant="h5">{thisCourse.course_name}</Typography>
            <Typography>{thisCourse.description}</Typography>
          </CardContent>
        </Card>

        <br />

        <Grid 
          container 
          columns={{ xs: 4, s: 4, md: 12, lg: 12 }} 
          spacing={2}
          direction={{ xs: "column-reverse", s: "column-reverse", md: "row", lg: "row" }}>


          <Grid item xs={8}>
            <ReviewList courseCode={thisCourse.course_code} reviews={testReviews} />
          </Grid>

          <Grid item xs={4}>
            <Card id="infoPanel" sx={{ padding: "15px" }}>
              <h2>Prerequisites</h2>
              <p>{thisCourse.prerequisites || "None"}</p>
              <h2>Antirequisites</h2>
              <p>{thisCourse.antirequisites || "None"}</p>
              <h2>Extra Info</h2>
              <p>{thisCourse.extra_info || "None"}</p>
              <h2>Locations</h2>
              <p>{thisCourse.location.replace(",", ", ")}</p>
            </Card>
          </Grid>
        </Grid>
      </Box>

      
    </>
  )
}

export default Course



