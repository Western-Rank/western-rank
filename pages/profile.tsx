import Footer from "@/components/Footer";
import NavbarHeader from "@/components/NavbarHeader";
import { UserReview } from "@/components/Review";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/components/ui/use-toast";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { getUserByEmail } from "@/services/user";
import { Course_Review, User } from "@prisma/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { User2 } from "lucide-react";
import { GetServerSideProps } from "next";
import { getServerSession } from "next-auth";
import { useSession } from "next-auth/react";
import { NextSeo } from "next-seo";
import Head from "next/head";
import { useRouter } from "next/router";

interface ProfileProps {
  user: User & { Course_Review: Course_Review[] };
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getServerSession(context.req, context.res, authOptions);

  if (!session || !session.user?.email) {
    return {
      redirect: {
        destination: "/api/auth/signin",
        permanent: false,
      },
    };
  }

  const user = await getUserByEmail(session.user.email);

  return {
    props: {
      user: JSON.parse(JSON.stringify(user)) as User,
    },
  };
};

function Profile({ user }: ProfileProps) {
  const session = useSession({
    required: true,
  });
  const router = useRouter();
  const queryClient = useQueryClient();

  const {
    data: userData,
    isSuccess,
    refetch,
  } = useQuery<User & { Course_Review: Course_Review[] }>({
    queryKey: ["user", session.data?.user?.email],
    queryFn: async () => {
      const response = await fetch("/api/user");
      if (!response.ok) throw new Error("Courses were not found");
      return response.json();
    },
    initialData: user,
    refetchOnWindowFocus: false,
    onError(err: any) {
      toast({
        title: `Error loading reviews for ${user.email}`,
        description: `${err.message.slice(0, 100) + "..." ?? ""}`,
        variant: "destructive",
      });
    },
    keepPreviousData: false,
  });

  const { mutate } = useMutation({
    mutationKey: ["delete-user", user],
    mutationFn: async () => {
      if (session.data?.user?.email !== user.email) {
        throw new Error("Error: Failed to authenticate.");
      }

      const res = await fetch(`/api/user/${encodeURIComponent(user?.email ?? "")}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        throw new Error(`Error: Failed to delete your account!`);
      }
      return res;
    },
    onSuccess() {
      toast({
        title: `User was deleted!`,
        description: "Feel free to make a new account.",
      });
      queryClient.invalidateQueries({ queryKey: ["user"] });
      refetch();
      router.reload();
      session.update();
    },
    onError(err: Error) {
      toast({
        title: err.message,
        description: "Please try again.",
        variant: "destructive",
      });
    },
  });

  return (
    <>
      <Head>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <NextSeo
        title="Your Profile | Western Rank"
        description="Your Profile on Western Rank"
        nofollow
        noindex
      />
      <NavbarHeader searchBar heading="Your Profile" subHeading={user.email ?? ""} Icon={User2} />
      <div className="light text-primary bg-background flex-grow py-4 pb-16 px-4 md:px-8 lg:px-15 xl:px-40">
        <h5 className="py-1 text-secondary-foreground">
          You&apos;ve made{" "}
          <span className="font-semibold">{user.Course_Review.length} reviews</span>
        </h5>
        <div className="grid lg:grid-cols-2 gap-3 py-2 pb-6">
          {!isSuccess && (
            <>
              <Skeleton className="h-40 w-full" />
              <Skeleton className="h-40 w-full" />
            </>
          )}
          {isSuccess &&
            userData.Course_Review.map((review, index) => (
              <UserReview key={index} review={review} includeCourseCode />
            ))}
        </div>
        <Separator />
        <div className="pt-3 flex justify-end flex-grow">
          <AlertDialog>
            <Button variant="destructive" className="my-3 w-full md:w-fit" asChild>
              <AlertDialogTrigger>Delete Account</AlertDialogTrigger>
            </Button>
            <AlertDialogContent className="light">
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure you want to delete your account?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete {user.email} and its
                  associated account.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <Button variant="destructive" asChild>
                  <AlertDialogAction onClick={() => mutate()}>Continue</AlertDialogAction>
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Profile;
