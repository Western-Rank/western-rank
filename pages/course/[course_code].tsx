import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  useTheme,
} from "@mui/material"
import { Course, Course_Review } from "@prisma/client"
import { GetServerSideProps } from "next"
import Navbar from "../../components/Navbar"
import ReviewList from "../../components/ReviewList"
import { getCourse } from "../../services/course"
import { getReviewsbyCourse } from "../../services/review"

/**
 * Course review page for the given course_code
 */
const testReviews: Course_Review[] = [
  {
    review_id: 1,
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
    term_taken: "Fall",
    date_taken: new Date(),
  },
  {
    review_id: 2,
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
    term_taken: "Winter",
    date_taken: new Date(),
  },
]

interface CourseProps {
  reviews: Course_Review[] // all course reviews for this course
  course: Course // the course information for the course displayed on this page
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  // provided by the dynamic route, e.g. /course/CALC1000
  const { course_code } = context.params as { course_code: string }

  const course = await getCourse(course_code)
  if (!course)
    return {
      notFound: true,
    }

  // TODO consider lazy loading reviews on client side with react query
  const reviews = (await getReviewsbyCourse(course_code)) || []

  return {
    props: {
      reviews,
      course,
    } satisfies Partial<CourseProps>,
  }
}

const Course = ({ reviews, course }: CourseProps) => {
  const theme = useTheme()

  return (
    <>
      <header>
        <Navbar searchBar />
      </header>

      <br />

      <Box id="main" width="90%" maxWidth="1100px" margin="auto">
        <Card>
          <CardContent>
            <Typography variant="h4">{course.course_code}</Typography>
            <Typography variant="h5">{course.course_name}</Typography>
            <Typography>{course?.description}</Typography>
          </CardContent>
        </Card>

        <br />

        <Grid
          container
          columns={{ xs: 4, s: 4, md: 12, lg: 12 }}
          spacing={2}
          direction={{
            xs: "column-reverse",
            s: "column-reverse",
            md: "row",
            lg: "row",
          }}
        >
          <Grid item xs={8}>
            <ReviewList courseCode={course.course_code} reviews={reviews} />
          </Grid>

          <Grid item xs={4}>
            <Card id="infoPanel" sx={{ padding: "15px" }}>
              <Typography variant="h5">Prerequisites</Typography>
              <Typography>{course?.prerequisites || "None"}</Typography>
              <Typography variant="h5">Antirequisites</Typography>
              <Typography>{course?.antirequisites || "None"}</Typography>
              <Typography variant="h5">Extra Info</Typography>
              <Typography>{course?.extra_info || "None"}</Typography>
              <Typography variant="h5">Locations</Typography>
              <Typography>
                {course.location?.replace(",", ", ") || ""}
              </Typography>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </>
  )
}

export default Course
