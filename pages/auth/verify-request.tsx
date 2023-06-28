import Image from "next/image";
import Link from "next/link";

const Verify = () => {
  return (
    <div
      className={
        "min-h-screen bg-[url('../public/College.svg'),_url('../public/College2.svg')] bg-[bottom_center,_bottom_right]"
      }
    >
      <div className="flex flex-col-reverse md:flex-row h-full">
        <div className="w-full h-[10vh] flex-grow"></div>
        <div className="light text-primary bg-background flex flex-col justify-center items-center gap-8 w-full h-[90vh] md:h-screen flex-grow px-3 lg:px-16 pb-20">
          <div className="w-full md:space-y-1">
            <Link href="/" className="p-2 flex flex-col items-center w-fit px-0">
              <Image src="/logo.svg" alt="logo" width={42} height={30} />
              <span className="text-primary font-extrabold text-sm">Rank</span>
            </Link>
            <h1 className="text-primary font-bold text-3xl lg:text-5xl">Check your email</h1>
            <h3 className="text-primary text-xl">
              A sign in link has been sent to your email address.
            </h3>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Verify;
