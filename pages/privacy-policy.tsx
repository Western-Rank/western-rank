import NavbarHeader from "@/components/NavbarHeader";
import { Lock } from "lucide-react";
import Head from "next/head";

const PrivacyPolicy = () => {
  return (
    <>
      <Head>
        <title>Privacy Policy | Western Rank</title>
        <meta name="description" content="Western Rank's Privacy Policy" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="h-screen flex flex-col">
        <NavbarHeader
          searchBar
          heading="Privacy Policy"
          subHeading="How we handle your privacy."
          Icon={Lock}
        />
        <div className="light text-primary bg-background flex-grow py-6 px-4 md:px-8 lg:px-15 xl:px-40"></div>
      </div>
    </>
  );
};

export default PrivacyPolicy;
