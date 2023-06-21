import NavbarHeader from "@/components/NavbarHeader";
import Head from "next/head";

function ExplorePage() {
  return (
    <>
      <Head>
        <title>Explore Courses | Western Rank</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <NavbarHeader
        heading="Explore Courses"
        subHeading={"asdfasd"}
        sticky
      />
      <div className="light text-primary bg-background flex-grow py-4 px-4 md:px-8 lg:px-15 xl:px-40">
        
      </div>
    </>
  );
}

export default ExplorePage;
