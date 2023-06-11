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
import { Button } from "@/components/ui/button";

import { Dialog, DialogTrigger } from "@/components/ui/dialog";

interface ReviewListProps {
  courseCode: string;
  reviews: Course_Review[];
}

const SortOrderOptions = ["recent", "difficulty", "useful", "attendance"] as const;

/**
 * The modal displaying all reviews on the course page.
 */
const ReviewList = ({ courseCode, reviews }: ReviewListProps) => {
  const router = useRouter();
  const { data: auth } = useSession();

  const hasReviewed = reviews.some(({ email }) => auth?.user!.email === email);
  const [sortOrder, setSortOrder] = useState<(typeof SortOrderOptions)[number]>("recent");

  // called after the review deletes itself to update the review list
  // TODO revalidate using react query
  const onDeleteReview = () => router.replace(router.asPath);

  return (
    <div className="flex flex-col">
      <h5 className="font-bold text-lg">Course Reviews ({reviews.length})</h5>

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
        {sortOrder == "recent"
          ? reviews
              .sort((a, b) => b.date_created.valueOf() - a.date_created.valueOf())
              .map((review) => (
                <Review key={review.email} review={review} onDelete={onDeleteReview} />
              ))
          : reviews
              .sort((a, b) => (b[sortOrder] as number) - (a[sortOrder] as number))
              .map((review) => (
                <Review key={review.email} review={review} onDelete={onDeleteReview} />
              ))}
      </div>
    </div>
  );
};

export default ReviewList;
