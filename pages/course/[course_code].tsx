/**
 * Course review page for the given course_code
 */

import { GetServerSideProps } from 'next';
import { Course, getCourse } from '../../lib/courses';
import { getReviews, postReview, CourseReview } from '../../lib/reviews';
import Navbar from '../../components/Navbar';

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
  // just display the formatted JSON for now
  return (
    <>
      <Navbar searchBar />
      <div>{"Course:" }<pre>{JSON.stringify(thisCourse, null, 2)}</pre></div>
      <div>{"Reviews:" }<pre>{JSON.stringify(reviews, null, 2)}</pre></div>
    </>
  )
}

export default Course



