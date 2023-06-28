import Footer from "@/components/Footer";
import NavbarHeader from "@/components/NavbarHeader";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Github, Globe, HelpCircle, Linkedin } from "lucide-react";
import { NextSeo } from "next-seo";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";

const AboutPage = () => {
  return (
    <>
      <Head>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <NextSeo
        title="About | Western Rank"
        description="About Western Rank, the course review platform for Western University."
        openGraph={{
          url: "https://www.westernrank.com/about",
          title: "About | Western Rank",
          description: "About Western Rank, the course review platform for Western University.",
        }}
      />

      <div className="h-screen flex flex-col">
        <NavbarHeader
          searchBar
          heading="About Western Rank"
          subHeading="What is this place?"
          Icon={HelpCircle}
        />
        <div className="light text-primary bg-background flex-grow space-y-10 py-8 pb-24 px-4 md:px-8 lg:px-15 xl:px-40">
          <div className="lg:max-w-[50vw] space-y-8 text-primary">
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">Welcome! 👋</h2>
              <section className="space-y-2 text-primary/80">
                <p>
                  <span className="font-bold text-transparent bg-clip-text bg-gradient-to-br from-purple-600 to-blue-400">
                    Western Rank
                  </span>{" "}
                  is a course review platform for Western University, an interesting university in
                  London ON, Canada. We want to be the primary place for UWO students to explore the
                  courses offerred at Western. Rank does this by relying on Western&apos;s greatest
                  strength: its supportive and involved student body. We know the pain of selecting
                  courses, finding one review on Reddit or Must Knows, and using all of
                  Western&apos;s web based tools.
                </p>
              </section>
              <section className="space-y-2 text-primary/80">
                <h3 className="text-lg font-bold text-muted-foreground">Powerfully Helpful</h3>
                <p>
                  Finding your next course has never been easier. Ever want to{" "}
                  <span className="font-bold text-transparent bg-clip-text bg-gradient-to-br from-purple-600 to-blue-400">
                    Rank
                  </span>{" "}
                  your course options? Well, now you can. Quickly explore courses, and compare them
                  based on your needs using the{" "}
                  <Button
                    variant="link"
                    className="p-0 h-4 font-semibold text-primary text-blue-500"
                    asChild
                  >
                    <Link href="/explore">Explore page</Link>
                  </Button>
                  . Wondering how a course will be like? See course reviews from peers, and see if
                  the course matches your expectations of it.
                </p>
              </section>
              <section className="space-y-2 text-primary/80">
                <h3 className="text-lg font-bold text-muted-foreground">Get Involved</h3>
                <p>
                  Students can quickly and easily rate and review courses that they&apos;ve taken,
                  leaving their wisdom for other students, and empowering this resource for the next
                  students.
                </p>
              </section>
              <section className="space-y-2 text-primary/80">
                <h3 className="text-lg font-bold text-muted-foreground">Constantly Evolving</h3>
                <p>
                  We&apos;re dedicated to making this thing even better. Let&apos;s make course
                  selection easy. Together 🤝.
                </p>
              </section>
            </div>

            <Separator />

            <div className="space-y-12">
              <h2 className="text-2xl font-bold">The Team</h2>
              <div className="flex flex-col lg:flex-row gap-5">
                <Image
                  className="rounded-full flex-grow-0 self-start min-w-[180px]"
                  src="/ben-asokanthan.jpg"
                  alt="Ben Asokanthan"
                  width={180}
                  height={180}
                />
                <Separator orientation="vertical" className="w-[1px] h-200" />
                <div className="space-y-4">
                  <div>
                    <Button
                      variant="link"
                      className="p-0 h-4 text-lg font-semibold text-primary"
                      asChild
                    >
                      <Link href="https://basokant.com" target="_blank" rel="noopener noreferrer">
                        <h4>Ben Asokanthan</h4>
                      </Link>
                    </Button>
                    <h5>Computer Science - 2025</h5>
                    <div className="flex gap-4">
                      <Button variant="link" className="text-purple-400 p-0" asChild>
                        <Link href="https://basokant.com" target="_blank" rel="noopener noreferrer">
                          <Globe />
                        </Link>
                      </Button>
                      <Button variant="link" className="text-purple-400 p-0" asChild>
                        <Link
                          href="https://www.linkedin.com/in/benjamin-asokanthan"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Linkedin />
                        </Link>
                      </Button>
                      <Button variant="link" className="text-purple-400 p-0" asChild>
                        <Link
                          href="https://github.com/basokant"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Github />
                        </Link>
                      </Button>
                    </div>
                  </div>
                  <p className="text-primary/80">
                    Came up with the idea, abandoned it for a year after getting carried by David
                    and Oscar, and then came back and redesigned the entire project. Rebuilt the
                    frontend for some reason, expanded the backend, and implemented huge features
                    like the review prompt and explore courses page.
                  </p>
                  <p className="text-primary/80">Frequently rocks crocs and socks.</p>
                </div>
              </div>

              <div className="flex flex-col lg:flex-row gap-5">
                <Image
                  className="rounded-full flex-grow-0 self-start min-w-[180px]"
                  src="/maaz-siddiqi.jpeg"
                  alt="Maaz Siddiqi"
                  width={180}
                  height={180}
                />
                <Separator orientation="vertical" className="w-[1px] h-200" />
                <div className="space-y-4">
                  <div>
                    <Button
                      variant="link"
                      className="p-0 h-4 text-lg font-semibold text-primary"
                      asChild
                    >
                      <Link
                        href="https://maazsiddiqi.vercel.app/"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <h4>Maaz Siddiqi</h4>
                      </Link>
                    </Button>
                    <h5>Computer Science - 2025</h5>
                    <div className="flex gap-4">
                      <Button variant="link" className="text-purple-400 p-0" asChild>
                        <Link
                          href="https://maazsiddiqi.vercel.app/"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Globe />
                        </Link>
                      </Button>
                      <Button variant="link" className="text-purple-400 p-0" asChild>
                        <Link
                          href="https://www.linkedin.com/in/maaz-siddiqi/"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Linkedin />
                        </Link>
                      </Button>
                      <Button variant="link" className="text-purple-400 p-0" asChild>
                        <Link
                          href="https://github.com/MaazSiddiqi"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Github />
                        </Link>
                      </Button>
                    </div>
                  </div>
                  <p className="text-primary/80">
                    Explore courses backend, review lists, some minor frontend things, and code
                    reviews. I was actually working on something very similar on my own last year,
                    so it was perfect joining this team. Got some more ideas from my project we
                    might add in the future too!
                  </p>
                  <p className="text-primary/80">
                    Started out in BMOS, switched out after first semester lol.
                  </p>
                </div>
              </div>

              <div className="flex flex-col lg:flex-row gap-5">
                <Image
                  className="rounded-full flex-grow-0 self-start min-w-[180px]"
                  src="/oscar-yu.jpeg"
                  alt="Oscar Yu"
                  width={180}
                  height={180}
                />
                <Separator orientation="vertical" className="w-[1px] h-200" />
                <div className="space-y-4">
                  <div>
                    <Button
                      variant="link"
                      className="p-0 h-4 text-lg font-semibold text-primary"
                      asChild
                    >
                      <Link href="https://awwscar.ca/" target="_blank" rel="noopener noreferrer">
                        <h4>Oscar Yu</h4>
                      </Link>
                    </Button>
                    <h5>Computer Science - 2025</h5>
                    <div className="flex gap-4">
                      <Button variant="link" className="text-purple-400 p-0" asChild>
                        <Link href="https://awwscar.ca/" target="_blank" rel="noopener noreferrer">
                          <Globe />
                        </Link>
                      </Button>
                      <Button variant="link" className="text-purple-400 p-0" asChild>
                        <Link
                          href="https://www.linkedin.com/in/oscaryyu/"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Linkedin />
                        </Link>
                      </Button>
                      <Button variant="link" className="text-purple-400 p-0" asChild>
                        <Link
                          href="https://github.com/LordExodius"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Github />
                        </Link>
                      </Button>
                    </div>
                  </div>
                  <p className="text-primary/80">
                    Built the initial course scraper and prototype course pages; helped implement
                    RateMyProf integration for reviews.
                  </p>
                  <p className="text-primary/80">Teamfight Tactics enthusiast</p>
                </div>
              </div>

              <div className="flex flex-col lg:flex-row gap-5">
                <Image
                  className="rounded-full flex-grow-0 self-start min-w-[180px]"
                  src="/arsalaan-ali.png"
                  alt="Arsalaan Ali"
                  width={180}
                  height={180}
                />
                <Separator orientation="vertical" className="w-[1px] h-200" />
                <div className="space-y-4">
                  <div>
                    <Button
                      variant="link"
                      className="p-0 h-4 text-lg font-semibold text-primary"
                      asChild
                    >
                      <Link
                        href="https://www.arsalaanali.com/"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <h4>Arsalaan Ali</h4>
                      </Link>
                    </Button>
                    <h5>Computer Science - 2025</h5>
                    <div className="flex gap-4">
                      <Button variant="link" className="text-purple-400 p-0" asChild>
                        <Link
                          href="https://www.arsalaanali.com/"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Globe />
                        </Link>
                      </Button>
                      <Button variant="link" className="text-purple-400 p-0" asChild>
                        <Link
                          href="https://www.linkedin.com/in/arsalaan-ali-9681131a7/"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Linkedin />
                        </Link>
                      </Button>
                      <Button variant="link" className="text-purple-400 p-0" asChild>
                        <Link
                          href="https://github.com/ArsalaanAli"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Github />
                        </Link>
                      </Button>
                    </div>
                  </div>
                  <p className="text-primary/80">
                    Worked on the course scraper, linking course requisites, and structuring the
                    database. I prototyped a similar idea a year ago, so when I met this team and
                    saw what they were working on it seemed like the perfect project for me to join.
                  </p>
                  <p className="text-primary/80">Valorant enjoyer.</p>
                </div>
              </div>

              <div className="flex flex-col lg:flex-row gap-5">
                <Image
                  className="rounded-full flex-grow-0 self-start"
                  src="/david-tran.jpeg"
                  alt="David Tran"
                  width={180}
                  height={180}
                />
                <Separator orientation="vertical" className="w-[1px] h-200" />
                <div className="space-y-4">
                  <div>
                    <Button
                      variant="link"
                      className="p-0 h-4 text-lg font-semibold text-primary"
                      asChild
                    >
                      <Link
                        href="https://github.com/davidtranhq"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <h4>David Tran</h4>
                      </Link>
                    </Button>
                    <h5>Computer Science and Math - 2025</h5>
                    <div className="flex gap-4">
                      <Button variant="link" className="text-purple-400 p-0" asChild>
                        <Link
                          href="https://davidtranhq.github.io/"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Globe />
                        </Link>
                      </Button>
                      <Button variant="link" className="text-purple-400 p-0" asChild>
                        <Link
                          href="https://www.linkedin.com/in/david-tran-b476851b5/"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Linkedin />
                        </Link>
                      </Button>
                      <Button variant="link" className="text-purple-400 p-0" asChild>
                        <Link
                          href="https://github.com/davidtranhq"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Github />
                        </Link>
                      </Button>
                    </div>
                  </div>
                  <p className="text-primary/80">BACKEND</p>
                  <p className="text-primary/80">jazz</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
};

export default AboutPage;
