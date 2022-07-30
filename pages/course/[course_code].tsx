/**
 * Course review page for the given course_code
 */

 import { GetServerSideProps } from 'next';
 import { Course, getCourse } from '../../lib/courses';
 import { getReviews, postReview, CourseReview } from '../../lib/reviews';
 import Navbar from '../../components/Navbar';
 import ReviewList from '../../components/ReviewList';
 
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
   return (
     <>
       <header><Navbar searchBar /></header>
       <div id="header">
         <h1>{thisCourse.course_code}</h1>
         <h2>{thisCourse.course_name}</h2>
         <div id="desc">
           <p id="descText">{thisCourse.description}</p>
         </div>
       </div>
 
       <div id="main">
         <div id="reviews"></div>
 
         <div id="infoPanel">
           <h2>Prerequisites</h2>
           <p>{thisCourse.prerequisites}</p>
           <h2>Antirequisites</h2>
           <p>{thisCourse.antirequisites || "None"}</p>
           <h2>Extra Info</h2>
           <p>{thisCourse.extra_info}</p>
           <h2>Locations</h2>
           <p>{thisCourse.location}</p>
         </div>
       </div>
 
       <ReviewList courseCode={thisCourse.course_code} reviews={testReviews} />
     </>
   )
 }
 
 export default Course
 
 
 
 