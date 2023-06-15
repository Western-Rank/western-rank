import Navbar from "@/components/Navbar";
import { CourseSearchItem } from "@/components/Searchbar";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { getAllCourses } from "@/services/course";
import { getReviewsbyUser } from "@/services/review";
import { getUserByEmail } from "@/services/user";
import { Box, Card, Grid, Typography, useTheme } from "@mui/material";
import { Course_Review, User } from "@prisma/client";
import { GetServerSideProps } from "next";
import { getServerSession } from "next-auth";
import Image from "next/image";

interface ProfileProps {
  user: User;
  reviews: Course_Review[];
  courses: CourseSearchItem[];
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getServerSession(context.req, context.res, authOptions);

  if (!session || !session.user?.email) {
    return {
      redirect: {
        destination: "/api/auth/signin",
        permanent: false,
      },
    };
  }

  const user = await getUserByEmail(session.user.email);
  const reviews = (await getReviewsbyUser(session.user.email)) || [];
  const courses = await getAllCourses();

  return {
    props: {
      user,
      reviews,
      courses: courses.map((course) => {
        return {
          course_code: course.course_code,
          course_name: course.course_name,
        };
      }),
    },
  };
};

function Profile({ courses, reviews, user }: ProfileProps) {
  const theme = useTheme();
  return null;

  return (
    <>
      <Navbar searchBar></Navbar>
      <br></br>
      <Box id="main" width="90%" maxWidth="1100px" margin="auto">
        <Grid
          container
          columns={{ xs: 4, s: 4, md: 12, lg: 12 }}
          spacing={2}
          direction={{ xs: "column", s: "column", md: "row", lg: "row" }}
        >
          <Grid item xs={2}>
            <Card id="userInfo" sx={{ padding: "15px", display: "inline-block" }}>
              <Image src={user.image ?? ""} alt={user.name ?? ""} width={96} height={96} />
              <Typography>{user.email}</Typography>
            </Card>
          </Grid>

          <Grid item xs={10}>
            {/* <ReviewList></ReviewList> */}
          </Grid>
        </Grid>
      </Box>
    </>
  );
}

export default Profile;
