import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import Searchbar from "@/components/Searchbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import formatNumber from "@/lib/utils";
import { getCourseCount } from "@/services/course";
import { getReviewCount } from "@/services/review";
import { Compass, Star } from "lucide-react";
import { type GetStaticProps } from "next";
import { NextSeo } from "next-seo";
import Head from "next/head";
import Link from "next/link";

type HomeProps = {
  reviewCount: number;
  courseCount: number;
};

export const getStaticProps: GetStaticProps<HomeProps> = async () => {
  const reviewCount = await getReviewCount();
  const courseCount = await getCourseCount();

  return {
    props: {
      reviewCount,
      courseCount,
    },
    // Next.js will attempt to re-generate the page:
    // - When a request comes in
    // - At most once every _ seconds
    revalidate: 10,
  };
};

const Home = ({ reviewCount, courseCount }: HomeProps) => {
  return (
    <>
      <Head>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <NextSeo
        title="Western Rank"
        description="Western Rank, the course review platform for Western University."
        openGraph={{
          url: "https://www.westernrank.com",
          title: "Western Rank",
          description: "Western Rank, the course review platform for Western University.",
        }}
      />

      <div
        className={
          "min-h-screen items-center bg-[url('../public/College.svg'),_url('../public/College2.svg')] bg-[bottom_center,_bottom_right]"
        }
      >
        <Navbar className="z-10 bg-transparent" />
        <div className="flex flex-col gap-6 flex-grow flex-1 w-screen max-w-[100vw] px-4 md:px-10 lg:px-20 xl:px-72 py-32 lg:py-42 relative">
          <Button
            variant="ghost"
            className="max-w-fit p-0 m-0 h-fit rounded-full hover:bg-blue-300/20"
            asChild
          >
            <Link href="/about">
              <Badge variant="outline" className="max-w-fit border-blue-500 space-x-1.5 group">
                <Star className="w-3 h-3 stroke-blue-500 animate-bounce" />
                <span>We just launched! Learn more here.</span>
              </Badge>
            </Link>
          </Button>
          <h1 className="text-primary font-bold text-2xl md:text-3xl lg:text-4xl">
            Explore course reviews from <br />{" "}
            <span className="text-transparent bg-clip-text bg-[size:200%] animate-gradient-pulse duration-&lsqb;12000ms&rsqb; bg-gradient-to-br from-purple-600 to-blue-400">
              Western University
            </span>{" "}
            students
          </h1>
          <div className="relative group">
            <Searchbar />
            <div className="absolute top-[60px] flex flex-col sm:flex-row gap-2 sm:items-center w-full justify-between text-md whitespace-nowrap">
              <h3 className="text-muted">
                {formatNumber(reviewCount, 1)}+ reviews for {courseCount} courses.
              </h3>
              <Button size="sm" variant="gradient" asChild>
                <Link href="/explore" className="space-x-2">
                  <Compass />
                  <span>Explore Courses</span>
                </Link>
              </Button>
            </div>
            <div className="z-[-1] absolute inset-0.5 bg-opacity-1 bg-gradient-to-br from-purple-600 to-blue-400 rounded-lg blur-lg opacity-0 transition duration-1000 group-hover:opacity-80 group-focus-within:opacity-80 animate-tilt"></div>
          </div>
        </div>
        <div className="h-[40vh] w-[20vw] absolute bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-blue-800 via-purple-800 to-background bottom-1 left-1 blur-3xl opacity-20 animate-tilt"></div>
      </div>
      <Footer />
    </>
  );
};

export default Home;
