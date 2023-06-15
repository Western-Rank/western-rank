import Review, { UserReview } from "@/components/Review";
import ReviewPrompt from "@/components/ReviewPrompt";
import { useSession } from "next-auth/react";
import { useState } from "react";

import Goose from "@/components/Goose";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Spinner from "@/components/ui/spinner";
import { Toggle } from "@/components/ui/toggle";
import { toast } from "@/components/ui/use-toast";
import { Course_ReviewsData } from "@/pages/api/reviews";
import { useQuery } from "@tanstack/react-query";
import { ArrowDownNarrowWide, ArrowUpNarrowWide } from "lucide-react";

const TAKE_DEFAULT = 5;

interface ReviewListProps {
  courseCode: string;
}

const SortKeys = ["date_created", "difficulty", "useful", "attendance"] as const;
export type SortKey = (typeof SortKeys)[number];

const SortOrderOptions = ["asc", "desc"] as const;
export type SortOrder = (typeof SortOrderOptions)[number];

/**
 * A component that renders all reviews for a course, a user's review
 * sorting controls, and includes the review prompt dialog for reviewing.
 */
const ReviewList = ({ courseCode }: ReviewListProps) => {
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
    isSuccess,
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

  const hasReviewed = !!auth?.user?.email && !!reviewsData && !!reviewsData.userReview;

  return (
    <div className="break-words" id="reviews">
      <h5 className="font-bold text-lg">Written Reviews ({reviewsData?._count?.review_id ?? 0})</h5>
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
        {isSuccess && hasReviewed && reviewsData?.userReview && (
          <UserReview review={reviewsData?.userReview} />
        )}
        {isLoading && (
          <Spinner className="py-6 flex items-center justify-center" text="Loading..." />
        )}
        {isSuccess && reviewsData?.reviews?.length > 0 ? (
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
            <Goose text={`No ${hasReviewed ? "other" : ""} written reviews yet)`} />
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewList;
