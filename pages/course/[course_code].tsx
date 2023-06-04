import { Box, Card, CardContent, Grid, Typography, useTheme } from "@mui/material";
import { Course, Course_Review } from "@prisma/client";
import { GetServerSideProps } from "next";
import Navbar from "../../components/Navbar";
import ReviewList from "../../components/ReviewList";
import { getCourse } from "../../services/course";
import { getReviewsbyCourse } from "../../services/review";
import { Separator } from "@/components/ui/separator";

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
];

interface CourseProps {
  reviews: Course_Review[]; // all course reviews for this course
  course: Course; // the course information for the course displayed on this page
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  // provided by the dynamic route, e.g. /course/CALC1000
  const { course_code } = context.params as { course_code: string };

  const course = await getCourse(course_code);
  if (!course)
    return {
      notFound: true,
    };

  // TODO consider lazy loading reviews on client side with react query
  const reviews = (await getReviewsbyCourse(course_code)) || [];

  return {
    props: {
      reviews,
      course,
    } satisfies Partial<CourseProps>,
  };
};

const Course = ({ reviews, course }: CourseProps) => {
  return (
    <>
      <main>
        <Navbar searchBar />
        <div className="px-4 md:px-8 lg:px-15 xl:px-40 flex flex-col">
          <div className="py-4 pt-16">
            <h4 className="text-3xl font-bold py-1">{course.course_code}</h4>
            <h5 className="text-xl text-foreground">{course.course_name}</h5>
          </div>

          <div className="py-8">
            <p>{course?.description}</p>
          </div>

          <Separator />

          <div className="flex-grow flex flex-col-reverse gap-4 lg:flex-row py-6">
            <div className="flex-grow">
              <ReviewList courseCode={course.course_code} reviews={reviews} />
            </div>

            <Separator orientation="vertical" className="w-[1px] h-200" />

            <div className="lg:w-96 flex flex-col gap-2">
              <div>
                <h5 className="text-lg font-semibold">Prerequisites</h5>
                <p>{course?.prerequisites || "None"}</p>
              </div>
              <div>
                <h5 className="text-lg font-semibold">Antirequisites</h5>
                <p>{course?.antirequisites || "None"}</p>
              </div>
              <div>
                <h5 className="text-lg font-semibold">Extra Info</h5>
                <p>{course?.extra_info || "None"}</p>
              </div>
              <div>
                <h5 className="text-lg font-semibold">Locations</h5>
                <p>{course.location?.replace(",", ", ") || ""}</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default Course;
