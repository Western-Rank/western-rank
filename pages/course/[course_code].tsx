import BackToTop from "@/components/BackToTop";
import Footer from "@/components/Footer";
import NavbarHeader from "@/components/NavbarHeader";
import PercentBar from "@/components/PercentBar";
import PercentCircle from "@/components/PercentCircle";
import Requisite, { RequisiteTextItem } from "@/components/Requisite";
import ReviewList from "@/components/ReviewList";
import Stars from "@/components/Stars";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import useShowMore from "@/hooks/useShowMore";
import { decodeCourseCode, encodeCourseCode, FullCourse } from "@/lib/courses";
import { roundToNearest } from "@/lib/utils";
import { getAllCoursesSearch, getCourse } from "@/services/course";
import { type Course } from "@prisma/client";
import { GraduationCap } from "lucide-react";
import { GetStaticPaths, GetStaticProps } from "next";
import { NextSeo } from "next-seo";
import Head from "next/head";
import { useInView } from "react-intersection-observer";

interface CourseProps {
  course: FullCourse; // the course information for the course displayed on this page
}

export const getStaticPaths: GetStaticPaths = async () => {
  const courses = await getAllCoursesSearch();
  const course_paths = courses.map((course) => {
    return {
      params: {
        course_code: encodeCourseCode(course.course_code),
      },
    };
  });

  if (process.env.SKIP_BUILD_STATIC_GENERATION) {
    return {
      paths: course_paths,
      fallback: true,
    };
  }

  return {
    paths: course_paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps<CourseProps> = async ({ params }) => {
  const { course_code } = params as { course_code: string };
  const course = await getCourse(decodeCourseCode(course_code));

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
    text: course?.description ?? "",
    maxLength: 200,
  });

  const { ref, inView: listInView } = useInView({
    rootMargin: "-150px",
  });

  const { ref: navRef, inView: navInView } = useInView();

  const scrollTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  const likedPercent = Math.round(
    ((course?.count_liked ?? 0) /
      (course?._count?.review_id == 0 ? 1 : course?._count?.review_id)) *
      100,
  );

  const difficulty = roundToNearest((course?._avg?.difficulty ?? 0) / 2.0, 1);
  const useful = roundToNearest((course?._avg?.useful ?? 0) / 2.0, 1);
  const attendance = roundToNearest(course?._avg?.attendance ?? 0, 1);

  const prerequisites = JSON.parse(
    JSON.stringify(course?.prerequisites_text || ""),
  ) as RequisiteTextItem[];
  const antirequisites = JSON.parse(
    JSON.stringify(course?.antirequisites_text || ""),
  ) as RequisiteTextItem[];
  const corequisites = JSON.parse(
    JSON.stringify(course?.corequisites_text || ""),
  ) as RequisiteTextItem[];
  const precorequisites = JSON.parse(
    JSON.stringify(course?.precorequisites_text || ""),
  ) as RequisiteTextItem[];

  return (
    <>
      <Head>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <NextSeo
        title={`${course?.course_code} | Western Rank`}
        description={`See reviews for ${course?.course_code} on Western Rank, the course review platform for Western University.`}
        openGraph={{
          url: "https://www.westernrank.com",
          title: "Western Rank",
          description: "Western Rank, the course review platform for Western University.",
          images: [
            {
              url: "/og-image.jpg",
              width: 1200,
              height: 627,
              alt: "Western Rank",
              type: "image/jpg",
            },
          ],
        }}
      />

      <NavbarHeader
        heading={course?.course_code ?? ""}
        subHeading={course?.course_name ?? ""}
        searchBar
        className="dark bg-opacity-5"
        Icon={GraduationCap}
      />
      <span ref={navRef} className="h-0"></span>
      <div className="light bg-background text-primary min-h-[110vh]">
        <div className="flex flex-col light">
          <BackToTop visible={listInView && !navInView} onClick={scrollTop} />
          <div className="py-8 px-4 md:px-8 lg:px-15 xl:px-40 flex flex-col-reverse lg:flex-row lg:gap-10">
            <p className="flex-1 text-primary flex flex-col">
              {course_description}
              {isExpanded != undefined && (
                <Button
                  variant="link"
                  className="text-muted-foreground px-0 py-2.5 my-2 h-2 self-start"
                  onClick={toggleExpand}
                >
                  Show {!isExpanded ? "More" : "Less"}
                </Button>
              )}
            </p>
            <div className="flex items-center justify-center lg:justify-start space-x-4 pb-2 lg:w-[30vw]">
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
                <div className="flex flex-col gap-1.5">
                  <h6 className="font-semibold">Attendance</h6>
                  <PercentBar percent={attendance}>
                    <span>{`Attended ${attendance}% of lectures`}</span>
                  </PercentBar>
                </div>
                <p>{course?._count.review_id} rating(s)</p>
              </div>
            </div>
          </div>

          <div className="px-4 md:px-8 lg:px-15 xl:px-40">
            <Separator className="border-primary" />
          </div>
          <div className="px-4 md:px-8 lg:px-15 xl:px-40 flex-grow flex flex-col-reverse gap-4 lg:gap-6 lg:flex-row py-6">
            <div ref={ref} className="flex-grow">
              {course?.course_code && <ReviewList courseCode={course?.course_code} />}
            </div>

            <Separator orientation="vertical" className="w-[1px] h-200" />

            <div className="flex flex-col gap-4 lg:min-w-[30vw] lg:w-[30vw]">
              {prerequisites?.length > 0 && (
                <Requisite type="Prerequisites" requisiteText={prerequisites} />
              )}
              {antirequisites?.length > 0 && (
                <Requisite type="Antirequisites" requisiteText={antirequisites} />
              )}
              {corequisites?.length > 0 && (
                <Requisite type="Corequisites" requisiteText={corequisites} />
              )}
              {precorequisites?.length > 0 && (
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
      </div>
      <Footer />
    </>
  );
};

export default Course;
