import Navbar from "@/components/Navbar";
import PercentCircle from "@/components/PercentCircle";
import Requisite, { RequisiteTextItem } from "@/components/Requisite";
import ReviewList from "@/components/ReviewList";
import Stars from "@/components/Stars";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import useShowMore from "@/hooks/useShowMore";
import { roundToNearest } from "@/lib/utils";
import { getAllCoursesSearch, getCourse, type FullCourse } from "@/services/course";
import { type Course } from "@prisma/client";
import { GetStaticPaths, GetStaticProps } from "next";
import Head from "next/head";

interface CourseProps {
  course: FullCourse; // the course information for the course displayed on this page
}

export const getStaticPaths: GetStaticPaths = async () => {
  const courses = await getAllCoursesSearch();
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

export const getStaticProps: GetStaticProps<CourseProps> = async ({ params }) => {
  const { course_code } = params as { course_code: string };
  const course = await getCourse(course_code);

  return {
    props: {
      course,
    },
    // Next.js will attempt to re-generate the page:
    // - When a request comes in
    // - At most once every _ seconds
    revalidate: 10,
  };
};

const Course = ({ course }: CourseProps) => {
  const [course_description, isExpanded, toggleExpand] = useShowMore({
    text: course.description ?? "",
    maxLength: 200,
  });

  const likedPercent = Math.round(
    ((course?.count_liked ?? 0) / (course._count.review_id == 0 ? 1 : course._count.review_id)) *
      100,
  );

  const difficulty = roundToNearest((course?._avg?.difficulty ?? 0) / 2.0, 1);
  const useful = roundToNearest((course?._avg?.useful ?? 0) / 2.0, 1);
  const attendance = roundToNearest(course?._avg?.attendance ?? 0, 1);

  const prerequisites = JSON.parse(
    JSON.stringify(course?.prerequisites_text),
  ) as RequisiteTextItem[];
  const antirequisites = JSON.parse(
    JSON.stringify(course?.antirequisites_text),
  ) as RequisiteTextItem[];
  const corequisites = JSON.parse(JSON.stringify(course?.corequisites_text)) as RequisiteTextItem[];
  const precorequisites = JSON.parse(
    JSON.stringify(course?.precorequisites_text),
  ) as RequisiteTextItem[];

  return (
    <>
      <Head>
        <title>{course.course_code} | Western Rank</title>
        <meta name="description" content={`See reviews for ${course.course_code} from `} />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="light bg-background text-primary min-h-[110vh]">
        <Navbar searchBar className="dark z-1" />
        <div className="flex flex-col light">
          <div className="py-4 pt-16 bg-background dark relative">
            <div className="h-40 w-[10vw] absolute bg-[radial-gradient(ellipse_at_left,_var(--tw-gradient-stops))] from-blue-800 via-purple-800 to-background bottom-0 left-0 blur-2xl opacity-25"></div>
            <h4 className="px-4 md:px-8 lg:px-15 xl:px-40 text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-purple-400 to-blue-800 py-1">
              {course.course_code}
            </h4>
            <h5 className="px-4 md:px-8 lg:px-15 xl:px-40 text-xl text-primary">
              {course.course_name}
            </h5>
          </div>

          <div className="py-8 px-4 md:px-8 lg:px-15 xl:px-40 flex flex-col-reverse lg:flex-row lg:gap-10">
            <p className="flex-1 text-primary flex flex-col">
              {course_description}
              {isExpanded != undefined && (
                <Button
                  variant="link"
                  className="text-muted-foreground px-0 pt-4 my-0 h-2 self-start"
                  onClick={toggleExpand}
                >
                  Show {!isExpanded ? "More" : "Less"}
                </Button>
              )}
            </p>
            <div className="flex items-center justify-center space-x-4 pb-2">
              <PercentCircle percent={likedPercent} size={180} strokeWidth={12} />
              <div className="space-y-2">
                <div>
                  <h6 className="font-semibold">Difficulty</h6>
                  <Stars value={difficulty} size={30} theme="purple" />
                </div>
                <div>
                  <h6 className="font-semibold">Useful</h6>
                  <Stars value={useful} size={30} theme="blue" />
                </div>
                <div>
                  <h6 className="font-semibold">Attendance</h6>
                  <Progress value={attendance}>
                    {`Attended/watched ${attendance}% of lectures.`}
                  </Progress>
                </div>
                <p>{course?._count.review_id} rating(s)</p>
              </div>
            </div>
          </div>

          <div className="px-4 md:px-8 lg:px-15 xl:px-40">
            <Separator className="border-primary" />
          </div>

          <div className="px-4 md:px-8 lg:px-15 xl:px-40 flex-grow flex flex-col-reverse gap-4 lg:gap-6 lg:flex-row py-6">
            <div className="flex-grow lg:min-w-[45vw]">
              {course.course_code && <ReviewList courseCode={course.course_code} />}
            </div>

            <Separator orientation="vertical" className="w-[1px] h-200" />

            <div className="flex flex-col gap-4">
              {prerequisites.length > 0 && (
                <Requisite type="Prerequisites" requisiteText={prerequisites} />
              )}
              {antirequisites.length > 0 && (
                <Requisite type="Antirequisites" requisiteText={antirequisites} />
              )}
              {corequisites.length > 0 && (
                <Requisite type="Corequisites" requisiteText={corequisites} />
              )}
              {precorequisites.length > 0 && (
                <Requisite type="Pre-or-Corequisites" requisiteText={precorequisites} />
              )}
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
