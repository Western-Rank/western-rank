import Footer from "@/components/Footer";
import NavbarHeader from "@/components/NavbarHeader";
import { Button } from "@/components/ui/button";
import { Lock } from "lucide-react";
import { NextSeo } from "next-seo";
import Head from "next/head";
import Link from "next/link";

const PrivacyPolicy = () => {
  return (
    <>
      <Head>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <NextSeo
        title="Privacy Policy | Western Rank"
        description="The Privacy Policy for Western Rank, the course review platform for Western University."
        openGraph={{
          url: "https://www.westernrank.com/privacy-policy",
          title: "Privacy Policy | Western Rank",
          description:
            "The Privacy Policy for Western Rank, the course review platform for Western University.",
        }}
      />

      <div className="h-screen flex flex-col">
        <NavbarHeader
          searchBar
          heading="Privacy Policy"
          subHeading="Last updated June 27th, 2023"
          Icon={Lock}
        />
        <div className="light text-primary bg-background flex-grow py-8 pb-24 px-4 md:px-8 lg:px-15 xl:px-40">
          <div className="lg:max-w-[50vw] text-justify space-y-10">
            <p className="text-primary/80">
              At Western Rank (
              <Button variant="link" className="text-blue-500 px-0 h-1.5" asChild>
                <Link href="/">westernrank.com</Link>
              </Button>
              ), we prioritize the privacy of our visitors, especially as privacy conscious students
              ourselves. regarding the collection, use, and disclosure of personal information when
              you visit and interact with our website. We are committed to protecting your privacy
              and ensuring the security of your personal information. By accessing and using our
              website, you consent to the terms and practices described in this Privacy Policy.
              {/* If you have additional questions or require more information about our Privacy
              Policy, do not hesitate to contact us through email at{" "}
              <Button variant="link" className="text-blue-500 px-0 h-1.5">
                <a href="mailto:info@westernrank.com">info@westernrank.com.</a>
              </Button> */}
            </p>
            <section className="space-y-2">
              <h2 className="text-xl font-bold">Information We Collect</h2>
              <p className="text-primary/80">
                We may collect certain personally identifiable information from you when you
                voluntarily provide it to us while using our website. This information includes your
                email, browser type, operating system, dates and times of your visits, and
                information related to the reviews you leave on our platform.
              </p>
            </section>
            <section className="space-y-2">
              <h2 className="text-xl font-bold">Use of Information</h2>
              <p className="text-primary/80">
                We may use the personal information you provide to us to personalize and improve
                your experience on our website, or to comply with applicable laws and regulations.
              </p>
            </section>
            <section className="space-y-2">
              <h2 className="text-xl font-bold">Cookies</h2>
              <p className="text-primary/80">
                We may use cookies, web beacons, and other similar technologies to collect and store
                certain information about your visit to our website. Cookies are small text files
                that are stored on your device by your web browser. They enable us to recognize your
                browser and capture certain information. You can manage your cookie preferences
                through your browser settings.
              </p>
            </section>
            <section className="space-y-2">
              <h2 className="text-xl font-bold">Links to Third-Party Websites</h2>
              <p className="text-primary/80">
                Our website may contain links to third-party websites that are not owned or
                controlled by us (ex.{" "}
                <Button variant="link" className="px-0 h-2 text-blue-500" asChild>
                  <Link href="https://www.ratemyprofessors.com/">ratemyprofessors.com</Link>
                </Button>
                ). We are not responsible for the privacy practices or the content of such websites.
                We encourage you to review the privacy policies of those third-party websites before
                providing any personal information.
              </p>
            </section>
            <section className="space-y-2">
              <h2 className="text-xl font-bold">Children&apos;s Privacy</h2>
              <p className="text-primary/80">
                Our website is not intended for children under the age of 13. Hopefully this is
                obvious as our website is intended for age 17+ Western University students. We do
                not knowingly collect personal information from children under 13. If you believe we
                have collected personal information from a child under 13, please contact us, and we
                will promptly delete the information.
              </p>
            </section>
            <section className="space-y-2">
              <h2 className="text-xl font-bold">Changes to this Privacy Policy</h2>
              <p className="text-primary/80">
                We reserve the right to modify this Privacy Policy at any time. Any changes will be
                effective immediately upon posting the updated Privacy Policy on our website. Your
                continued use of our website after any such changes constitutes your acceptance of
                the revised Privacy Policy.
              </p>
            </section>
            <h3 className="text-primary">
              The{" "}
              <span className="font-bold text-transparent bg-clip-text bg-gradient-to-br from-purple-600 to-blue-400">
                Western Rank
              </span>{" "}
              Team
            </h3>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
};

export default PrivacyPolicy;
