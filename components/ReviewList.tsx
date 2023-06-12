import { Course_Review } from "@prisma/client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
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
import { useQuery } from "@tanstack/react-query";
import { toast } from "./ui/use-toast";
import Spinner from "./ui/spinner";

interface ReviewListProps {
  courseCode: string;
}

const SortOrderOptions = ["recent", "difficulty", "useful", "attendance"] as const;

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
  const router = useRouter();
  const { data: auth } = useSession();
  const [sortOrder, setSortOrder] = useState<(typeof SortOrderOptions)[number]>("recent");

  const {
    data: reviews,
    isLoading,
    isError,
  } = useQuery([`${courseCode}-reviews`], {
    queryFn: async () => {
      const response = await fetch(`/api/reviews?course_code=${courseCode}`);
      if (!response.ok) throw new Error("Courses were not found");
      return response.json() as Promise<Course_Review[]>;
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

  const hasReviewed = reviews?.some(({ email }) => auth?.user!.email === email);

  if (hasReviewed) {
  }

  // called after the review deletes itself to update the review list
  // TODO revalidate using react query
  const onDeleteReview = () => router.replace(router.asPath);

  return !isLoading && !isError ? (
    <div className="break-words">
      <h5 className="font-bold text-lg">Course Reviews ({reviews?.length ?? 0})</h5>
      <div className="flex flex-col sm:flex-row gap-2 items-center sm:justify-between py-2">
        <div className="flex items-center w-full sm:w-auto gap-1">
          <label className="w-24">Sort By</label>
          <Select
            defaultValue="recent"
            onValueChange={(value) => {
              if (value in SortOrderOptions)
                setSortOrder(value as (typeof SortOrderOptions)[number]);
            }}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent className="light">
              {SortOrderOptions.map((option, index) => (
                <SelectItem key={index} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <ReviewPrompt courseCode={courseCode} hasReviewed={hasReviewed} />
      </div>
      <div className="flex flex-col gap-4 py-2">
        {reviews?.map((review) => (
          <Review
            key={review.email}
            review={{
              ...review,
              date_created: new Date(review.date_created),
              last_edited: new Date(review.last_edited),
              date_taken: new Date(review.date_taken),
            }}
            onDelete={onDeleteReview}
          />
        ))}
      </div>
    </div>
  ) : (
    <Spinner className="flex items-center justify-center" text="Loading..." />
  );
};

export default ReviewList;
