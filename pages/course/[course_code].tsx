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
    term_taken: 'fall',
    year_taken: 2021
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
    term_taken: 'winter',
    year_taken: 2022
  }
];

interface CourseProps {
  reviews: CourseReview[], // all course reviews for this course
  thisCourse: Course, // the course information for the course displayed on this page
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  // provided by the dynamic route, e.g. /course/CALC1000
  const { course_code } = context.params as { course_code: string };
  console.log(course_code);
  return {
    props: {
      reviews: JSON.parse(JSON.stringify(await getReviews(course_code))),
      thisCourse: await getCourse(course_code),
    }
  }
}

const Course = ({ reviews, thisCourse }: CourseProps) => {
  const theme = useTheme();
  console.log(thisCourse);
  
  return (
    <>
      <header><Navbar searchBar /></header>

      <br />

      <Box id="main" width="90%" maxWidth="1100px" margin="auto" >
        <Card>
          <CardContent>
            <Typography variant="h4">{thisCourse.course_code}</Typography>
            <Typography variant="h5">{thisCourse.course_name}</Typography>
            <Typography>{thisCourse?.description}</Typography>
          </CardContent>
        </Card>

        <br />

        <Grid 
          container 
          columns={{ xs: 4, s: 4, md: 12, lg: 12 }} 
          spacing={2}
          direction={{ xs: "column-reverse", s: "column-reverse", md: "row", lg: "row" }}>

          <Grid item xs={8}>
            <ReviewList isProfile={false} courseCode={thisCourse.course_code} reviews={reviews} />
          </Grid>

          <Grid item xs={4}>
            <Card id="infoPanel" sx={{ padding: "15px" }}>
              <Typography variant='h5'>Prerequisites</Typography>
              <Typography>{thisCourse?.prerequisites || "None"}</Typography>
              <Typography variant='h5'>Antirequisites</Typography>
              <Typography>{thisCourse?.antirequisites || "None"}</Typography>
              <Typography variant='h5'>Extra Info</Typography>
              <Typography>{thisCourse?.extra_info || "None"}</Typography>  
              <Typography variant='h5'>Locations</Typography>
              <Typography>{thisCourse.location?.replace(",", ", ")}</Typography>
            </Card>
          </Grid>
        </Grid>
      </Box>

      
    </>
  )
}

export default Course;