import Footer from "@/components/Footer";
import NavbarHeader from "@/components/NavbarHeader";
import { HelpCircle } from "lucide-react";
import Head from "next/head";

const AboutPage = () => {
  return (
    <>
      <Head>
        <title>About | Western Rank</title>
        <meta name="description" content="Western Rank's Privacy Policy" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="h-screen flex flex-col">
        <NavbarHeader
          searchBar
          heading="About Western Rank"
          subHeading="What, Why, Who, When, Where?"
          Icon={HelpCircle}
        />
        <div className="light text-primary bg-background flex-grow py-8 pb-24 px-4 md:px-8 lg:px-15 xl:px-40">
          <div className="lg:max-w-[50vw] text-justify space-y-10 text-primary/80">
            <section className="space-y-2">
              <h2 className="text-xl font-bold">Welcome! ( ´ ▽ ` )ﾉ</h2>
              <p>
                <span className="font-bold text-transparent bg-clip-text bg-gradient-to-br from-purple-600 to-blue-400">
                  Western Rank
                </span>{" "}
                is a course review platform for Western University, a university in London ON,
                Canada. We want to be the primary place for UWO students to explore the courses
                offerred at Western. Rank does this by relying on Western&apos;s greatest strength:
                its involved student community.
              </p>
              <p>
                Students can easily rate and review courses that they&apos;ve taken, leaving their
                wisdom for other students.
              </p>
            </section>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
};

export default AboutPage;
