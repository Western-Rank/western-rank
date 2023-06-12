import { Course } from "@prisma/client";
import { GetServerSideProps, GetStaticPaths } from "next";
import Navbar from "../../components/Navbar";
import ReviewList from "../../components/ReviewList";
import { getAllCourses, getCourse } from "../../services/course";
import { Separator } from "@/components/ui/separator";
import useShowMore from "@/hooks/useShowMore";
import { Button } from "@/components/ui/button";
import { CourseSearchItem } from "@/components/Searchbar";
interface CourseProps {
  course: Course; // the course information for the course displayed on this page
  courses: CourseSearchItem[];
}

export const getStaticPaths: GetStaticPaths = async () => {
  const courses = await getAllCourses();
  const course_paths = courses.map((course) => {
    return {
      params: {
        course_code: course.course_code,
      },
    };
  });

  return {
    paths: course_paths,
    fallback: true,
  };
};

export const getStaticProps: GetServerSideProps<CourseProps> = async ({ params }) => {
  const { course_code } = params as { course_code: string };
  const course = await getCourse(course_code);

  const courses = await getAllCourses();

  return {
    props: {
      course,
      courses: courses.map((course) => {
        return {
          course_code: course.course_code,
          course_name: course.course_name,
        };
      }),
    } as CourseProps,
  };
};

const Course = ({ courses, course }: CourseProps) => {
  const [course_description, isExpanded, toggleExpand] = useShowMore({
    text: course?.description ?? "",
    maxLength: 200,
  });

  return (
    <>
      <main className="light bg-background text-primary">
        <Navbar courses={courses} searchBar className="dark z-1" />
        <div className="flex flex-col light">
          <div className="py-4 pt-16 bg-background dark relative">
            <div className="h-40 w-[10vw] absolute bg-[radial-gradient(ellipse_at_left,_var(--tw-gradient-stops))] from-blue-800 via-purple-800 to-background bottom-0 left-0 blur-2xl opacity-25"></div>
            <h4 className="px-4 md:px-8 lg:px-15 xl:px-40 text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-purple-400 to-blue-800 py-1">
              {course?.course_code}
            </h4>
            <h5 className="px-4 md:px-8 lg:px-15 xl:px-40 text-xl text-primary">
              {course?.course_name}
            </h5>
          </div>

          <div className="py-8 px-4 md:px-8 lg:px-15 xl:px-40 ">
            <p className="text-primary flex flex-col">
              {course_description}
              {isExpanded != undefined && (
                <Button
                  variant="link"
                  className="px-1 pt-4 my-0 h-2 self-end"
                  onClick={toggleExpand}
                >
                  Show {!isExpanded ? "More" : "Less"}
                </Button>
              )}
            </p>
          </div>

          <div className="px-4 md:px-8 lg:px-15 xl:px-40">
            <Separator className="border-primary" />
          </div>

          <div className="px-4 md:px-8 lg:px-15 xl:px-40 flex-grow flex flex-col-reverse gap-4 lg:gap-6 lg:flex-row py-6">
            <div className="flex-grow lg:max-w-[75vw]">
              <ReviewList courseCode={course?.course_code} />
            </div>

            <Separator orientation="vertical" className="w-[1px] h-200" />

            <div className="lg:w-96 flex flex-col gap-4">
              <div>
                <h5 className="text-lg font-semibold">Prerequisites</h5>
                <p>{course?.prerequisites_text || "None"}</p>
              </div>
              <div>
                <h5 className="text-lg font-semibold">Antirequisites</h5>
                <p>{course?.antirequisites_text || "None"}</p>
              </div>
              <div>
                <h5 className="text-lg font-semibold">Extra Info</h5>
                <p>{course?.extra_info || "None"}</p>
              </div>
              <div>
                <h5 className="text-lg font-semibold">Locations</h5>
                <p>{course?.location?.replace(",", ", ") || ""}</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default Course;
