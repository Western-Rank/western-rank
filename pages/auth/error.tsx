import Goose from "@/components/Goose";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";

type ErrorType = "Default" | "Configuration" | "AccessDenied" | "Verification";

interface InternalUrl {
  /** @default "http://localhost:3000" */
  origin: string;
  /** @default "localhost:3000" */
  host: string;
  /** @default "/api/auth" */
  path: string;
  /** @default "http://localhost:3000/api/auth" */
  base: string;
  /** @default "http://localhost:3000/api/auth" */
  toString: () => string;
}

type ErrorProps = {
  code: ErrorType;
};

const Error = ({ code }: ErrorProps) => {
  if (code === "Verification") {
    return (
      <div className="pb-3 space-y-2">
        <h1 className="text-primary font-bold text-3xl lg:text-5xl">Unable to sign in</h1>
        <h3 className="text-primary text-xl">
          The sign in link is no longer valid. It may have been used already or it may have expired.
        </h3>
      </div>
    );
  }

  if (code === "AccessDenied") {
    return (
      <div className="pb-3 space-y-2">
        <h1 className="text-primary font-bold text-3xl lg:text-5xl">Accessed denied</h1>
        <h3 className="text-primary text-xl">We were unable to sign you in. Please try again.</h3>
      </div>
    );
  }

  return (
    <div className="pb-3 space-y-2">
      <h1 className="text-primary font-bold text-3xl lg:text-5xl">Error</h1>
      <h3 className="text-primary text-xl">We were unable to sign you in. Please try again.</h3>
    </div>
  );
};

const ErrorPage = ({}) => {
  const router = useRouter();

  const { error } = router.query;

  return (
    <div
      className={
        "min-h-screen bg-[url('../public/College.svg'),_url('../public/College2.svg')] bg-[bottom_center,_bottom_right]"
      }
    >
      <div className="flex flex-col-reverse md:flex-row h-full">
        <Goose className="w-[100px] stroke-purple-400 fixed right-10 top-10" />
        <div className="w-full h-[10vh] flex-grow"></div>
        <div className="light text-primary bg-background flex flex-col justify-center items-center gap-8 w-full h-[90vh] md:h-screen flex-grow px-3 lg:px-16">
          <div className="w-full md:space-y-1">
            <Link href="/" className="p-2 flex flex-col items-center w-fit px-0">
              <Image src="/logo.svg" alt="logo" width={42} height={30} />
              <span className="text-primary font-extrabold text-sm">Rank</span>
            </Link>
            <Error code={error as ErrorType} />
            <div className="flex flex-grow w-full justify-end">
              <Button className="w-full sm:w-fit" variant="gradient" asChild>
                <Link href="/auth/signin">Sign in</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;
