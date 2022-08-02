import React from 'react';
import { GetServerSideProps } from 'next';
import { getSession, useUser, withPageAuthRequired } from '@auth0/nextjs-auth0';
import Navbar from "../components/Navbar";
import {
  useTheme,
  Box,
  Grid,
  Card,
  Typography
} from '@mui/material';
import { CourseReview, getUserReviews } from '../lib/reviews';
import ReviewList from '../components/ReviewList';

interface ProfileProps {
  reviews: CourseReview[]
}

export const getServerSideProps: GetServerSideProps = withPageAuthRequired({
  async getServerSideProps(context) {
    const authUser = getSession(context.req, context.res);
    return {
      props: {
        reviews: JSON.parse(JSON.stringify(await getUserReviews(authUser?.user.email)))
      }
    }
  }
});

function Profile({ reviews }: ProfileProps) {
  const theme = useTheme();
  const { user, error, isLoading } = useUser();
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error.message}</div>;
  if (!user) return (
  <div>
      <h1>You must be logged in to view your profile.</h1>
  </div>
  );

  return (
    <>
      <Navbar searchBar></Navbar>
      <br></br>
      <Box id="main" width="90%" maxWidth="1100px" margin="auto" >
        <Grid 
            container 
            columns={{ xs: 4, s: 4, md: 12, lg: 12 }} 
            spacing={2}
            direction={{ xs: "column", s: "column", md: "row", lg: "row" }}>
            
            <Grid item xs={2}>
              <Card id="userInfo" sx={{ padding: "15px", display: "inline-block" }}>
                <img src={user.picture ?? ""} alt={user.name ?? ""} />
                <Typography>{user.email}</Typography>
              </Card>
            </Grid>

            <Grid item xs={10}>
              <ReviewList isProfile={true} courseCode={""} reviews={reviews}></ReviewList>
            </Grid>
        </Grid>
      </Box>

    </>
  );
}

export default Profile