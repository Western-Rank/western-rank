import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { cn, isUwoEmail } from "@/lib/utils";
import { signIn, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const SignIn = () => {
  const session = useSession();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [submitAttempted, setSubmitAttempted] = useState(false);

  useEffect(() => {
    if (session.status == "authenticated") {
      router.push("/");
    }
  }, [session.status, router]);

  const isValidEmail = isUwoEmail(email);

  return (
    <div
      className={
        "min-h-screen bg-[url('../public/College.svg'),_url('../public/College2.svg')] bg-[bottom_center,_bottom_right]"
      }
    >
      <div className="flex flex-col-reverse md:flex-row h-full">
        <div className="w-full h-[10vh] flex-grow"></div>
        <div className="light text-primary bg-background flex flex-col justify-center items-center gap-8 w-full h-[90vh] md:h-screen flex-grow px-3 lg:px-16">
          <div className="w-full md:space-y-1">
            <Link href="/" className="p-2 flex flex-col items-center w-fit px-0">
              <Image src="/logo.svg" alt="logo" width={42} height={30} />
              <span className="text-primary font-extrabold text-sm">Rank</span>
            </Link>
            <h1 className="text-primary font-bold text-3xl lg:text-5xl">
              Sign in to{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-br from-purple-600 to-blue-400">
                Western Rank
              </span>
            </h1>
            <h3 className="text-primary text-xl">
              with an <span className="text-purple-600">@uwo.ca</span> or{" "}
              <span className="text-green-500">@ivey.ca</span> email.
            </h3>
          </div>
          <form
            className="space-y-4 w-full"
            onSubmit={async (e) => {
              e.preventDefault();
              if (isValidEmail) {
                signIn("email", { callbackUrl: "/", email: email });
              } else {
                setSubmitAttempted(true);
              }
            }}
          >
            {submitAttempted && !isValidEmail && (
              <span className="light text-destructive">Invalid Email</span>
            )}
            <Input
              className={cn(
                "light bg-background text-primary border-border",
                submitAttempted && !isValidEmail && "border-destructive text-destructive",
              )}
              value={email}
              onChange={(e) => {
                setEmail(e.currentTarget.value);
              }}
            />
            <div className="flex flex-col flex-grow sm:flex-row justify-between md:items-center gap-1">
              <h5 className="light text-muted-foreground text-xs md:text-sm lg:text-lg">
                * We&apos;ll send you a magic link to this email.
              </h5>
              <Button className="w-full sm:w-fit" variant="gradient" type="submit">
                Sign in
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
