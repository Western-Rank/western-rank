import Footer from "@/components/Footer";
import Goose from "@/components/Goose";
import Navbar from "@/components/Navbar";
import { NextSeo } from "next-seo";
import Head from "next/head";

export default function Custom404() {
  return (
    <>
      <Head>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <NextSeo
        title="404 Error | Western Rank"
        description="Western Rank 404 Error"
        nofollow
        noindex
      />

      <div className={"overflow-hidden flex flex-col h-screen"}>
        <Navbar className="z-10 bg-transparent" />
        <div className="flex-grow h-full flex items-center justify-center pb-20">
          <Goose
            parentClassName="md:flex-row items-center justify-center gap-2"
            className="light h-[110vw] sm:h-[80vw] md:h-[50vw] w-[110vw] sm:w-[80vw] md:w-[50vw] stroke-1 stroke-muted-foreground opacity-40"
          >
            <div className="w-full md:w-fit px-14 md:px-0 py-3">
              <h1 className="text-7xl lg:text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-purple-600 to-blue-400">
                HONK!
              </h1>
              <h2 className="text-xl lg:text-3xl md:pb-20">
                (Translation: <span className="font-extrabold">404</span> Error)
              </h2>
            </div>
          </Goose>
        </div>
        <Footer />
      </div>
    </>
  );
}
