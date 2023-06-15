import { Course_Review } from "@prisma/client";
import { useSession } from "next-auth/react";
import { useState } from "react";
import Review from "./Review";
import ReviewPrompt from "./ReviewPrompt";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Course_ReviewsData } from "@/pages/api/reviews";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowDownNarrowWide, ArrowUpNarrowWide } from "lucide-react";
import { Button } from "./ui/button";
import Spinner from "./ui/spinner";
import { Toggle } from "./ui/toggle";
import { toast } from "./ui/use-toast";

const TAKE_DEFAULT = 5;

interface ReviewListProps {
  courseCode: string;
}

const SortKeys = ["date_created", "difficulty", "useful", "attendance"] as const;
export type SortKey = (typeof SortKeys)[number];

const SortOrderOptions = ["asc", "desc"] as const;
export type SortOrder = (typeof SortOrderOptions)[number];

/**
 * Course review page for the given course_code
 */
const testReviews: Course_Review[] = [
  {
    review_id: 1,
    course_code: "AAAA 1000",
    professor: "Professor A",
    review: "An amazing adult awesomely aggregrating addictive assignments",
    email: "a@awwscar.ca",
    difficulty: 1,
    liked: true,
    attendance: 11,
    useful: 24,
    anon: false,
    date_created: new Date("2020-06-19"),
    last_edited: new Date("2021-06-19"),
    term_taken: "Fall",
    date_taken: new Date(),
  },
  {
    review_id: 2,
    course_code: "BBBB 2222",
    professor: "Professor B",
    review: "Bad, barely beautiful, boring. BAD!",
    email: "b@bing.com",
    difficulty: 10,
    liked: false,
    attendance: 22,
    useful: 30,
    anon: true,
    date_created: new Date("2022-09-19"),
    last_edited: new Date("2022-10-19"),
    term_taken: "Winter",
    date_taken: new Date(),
  },
];

/**
 * The modal displaying all reviews on the course page.
 */
const ReviewList = ({ courseCode }: ReviewListProps) => {
  const queryClient = useQueryClient();
  const { data: auth } = useSession();

  const [sortKey, setSortKey] = useState<SortKey>("date_created");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [take, setTake] = useState<number | undefined>(TAKE_DEFAULT);
  const resetTake = () => {
    setTake(TAKE_DEFAULT);
  };

  const {
    data: reviewsData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["reviews", courseCode, sortKey, sortOrder, take],
    queryFn: async () => {
      const searchParams = new URLSearchParams({
        course_code: courseCode,
        sortKey: sortKey,
        sortOrder: sortOrder,
      });

      if (take) {
        searchParams.append("take", take.toString());
      }
      const response = await fetch(`/api/reviews?${searchParams.toString()}`);
      if (!response.ok) throw new Error("Courses were not found");
      return response.json() as Promise<Course_ReviewsData>;
    },
    refetchOnWindowFocus: false,
    onError(err: Error) {
      toast({
        title: `Error loading reviews for ${courseCode}`,
        description: `${err.message.slice(0, 100) + "..." ?? ""}`,
        variant: "destructive",
      });
    },
  });

  const deleteReviewMutation = useMutation({
    mutationKey: ["delete-reviews", reviewsData?.userReview?.review_id],
    mutationFn: async () => {
      const res = await fetch(`/api/reviews/${reviewsData?.userReview?.review_id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        throw new Error(`Error: Failed to delete your review!`);
      }
      return res;
    },
    onSuccess() {
      toast({
        title: `Your review was deleted!`,
        description: "Feel free to send a new review.",
      });
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
    },
    onError(err: Error) {
      toast({
        title: err.message,
        description: "Please try again.",
        variant: "destructive",
      });
    },
  });

  const hasReviewed = !!auth?.user?.email && !!reviewsData?.userReview;

  return (
    <div className="break-words" id="reviews">
      <h5 className="font-bold text-lg">Course Reviews ({reviewsData?._count?.review_id ?? 0})</h5>
      <div className="flex flex-col sm:flex-row gap-2 items-center sm:justify-between py-2">
        <div className="flex items-center w-full gap-2">
          <label className="min-w-fit">Sort By</label>
          <Select
            value={sortKey}
            onValueChange={(value) => {
              resetTake();
              setSortKey(value as (typeof SortKeys)[number]);
            }}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent className="light">
              {SortKeys.map((option, index) => (
                <SelectItem key={index} value={option}>
                  {option.split("_").join(" ")}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="flex space-x-1">
            <Toggle
              pressed={sortOrder === "asc"}
              onPressedChange={() => {
                resetTake();
                setSortOrder("asc");
              }}
              value="asc"
            >
              <ArrowUpNarrowWide />
            </Toggle>
            <Toggle
              pressed={sortOrder === "desc"}
              onPressedChange={() => {
                resetTake();
                setSortOrder("desc");
              }}
              value="desc"
            >
              <ArrowDownNarrowWide />
            </Toggle>
          </div>
        </div>
        {!hasReviewed && <ReviewPrompt courseCode={courseCode} />}
      </div>
      <div className="flex flex-col gap-4 py-2">
        {!isLoading && !isError && auth && reviewsData?.userReview && (
          <Review
            review={{
              ...reviewsData?.userReview,
              date_created: new Date(reviewsData?.userReview.date_created),
              last_edited: new Date(reviewsData?.userReview.last_edited),
              date_taken: new Date(reviewsData?.userReview.date_taken),
            }}
            onDelete={deleteReviewMutation.mutate}
            isUser
          />
        )}
        {!isLoading && !isError ? (
          reviewsData?.reviews?.length > 0 ? (
            <>
              {reviewsData?.reviews?.map((review) => (
                <Review
                  key={review.review_id}
                  review={{
                    ...review,
                    date_created: new Date(review.date_created),
                    last_edited: new Date(review.last_edited),
                    date_taken: new Date(review.date_taken),
                  }}
                />
              ))}
              {take && reviewsData._count.review_id > take && (
                <Button variant="outline" onClick={() => setTake(undefined)}>
                  Show all {reviewsData?._count.review_id} Reviews
                </Button>
              )}
            </>
          ) : (
            <div className="py-6 text-center flex flex-col items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="100"
                height="100"
                viewBox="0 0 512 512"
                className="stroke-purple-200 stroke-[4px] fill-none"
              >
                <path d="M370.019 18.023c-2.843-.035-5.859.197-9.075.73c-81.664 13.54-38.657 142.295-36.095 217.397c-84.163-16.327-168.007 121.048-289.118 152.787c58.086 52.473 206.05 89.6 331.739 11.85c39.804-24.622 45.26-92.014 34.343-165.049c-6.703-44.845-71.755-133.176-10.269-141.266l.611-.504c12.884-10.608 16.606-23.842 22.522-37.699l1.699-3.976c-11.688-16.016-23.17-33.986-46.357-34.27zm5.08 19.625a9 9 0 0 1 9 9a9 9 0 0 1-9 9a9 9 0 0 1-9-9a9 9 0 0 1 9-9zm52.703 34.172c-3.28 8.167-7.411 17.45-14.612 26.293c21.035 7.63 41.929 3.078 63.079-.863c-15.515-9.272-32.003-18.195-48.467-25.43zm-89.608 181.053c19.109 25.924 21.374 53.965 11.637 78.183c-9.737 24.219-30.345 44.797-55.67 60.49c-50.65 31.389-121.288 44.45-170.553 17.11l8.735-15.738c40.364 22.4 106.342 11.833 152.338-16.67c22.997-14.252 40.72-32.684 48.449-51.906c7.729-19.223 6.596-39.053-9.426-60.79l14.49-10.68zM273.28 456.322a332.68 332.68 0 0 1-19.095 3.232l-3.508 16.426h-13.084l3.508-14.842a400.208 400.208 0 0 1-18.852 1.506l-7.408 31.336h95.79v-18h-41.548l4.197-19.658z" />
              </svg>
              <p className="text-purple-200">
                HONK!
                <br /> {`(Translation: No ${hasReviewed ? "other" : ""} written reviews yet)`}
              </p>
            </div>
          )
        ) : (
          <Spinner className="py-6 flex items-center justify-center" text="Loading..." />
        )}
      </div>
    </div>
  );
};

export default ReviewList;
