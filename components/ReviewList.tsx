import { Course_Review } from "@prisma/client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useState } from "react";
import Review from "./Review";
import ReviewPrompt from "./ReviewPrompt";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

interface ReviewListProps {
  courseCode?: string;
  reviews: Course_Review[];
}

/**
 * The modal displaying all reviews on the course page.
 */
const ReviewList = ({ courseCode = "", reviews }: ReviewListProps) => {
  const router = useRouter();
  const { data: auth, status } = useSession();

  const [showReviewPrompt, setShowReviewPrompt] = useState(false);
  const userHasReview = reviews.some(({ email }) => auth?.user!.email === email);

  const reviewButtonText = !auth
    ? "Log in to write a review"
    : userHasReview
    ? "Edit your review"
    : "Write a review";

  const onShowReview = () => {
    if (!auth) alert("You must be logged in to post a review");
    else setShowReviewPrompt((prev) => !prev);
  };

  // called after the review deletes itself to update the review list
  // TODO revalidate using react query
  const onDeleteReview = () => router.replace(router.asPath);

  return (
    <div className="flex flex-col gap-1">
      <div className="flex justify-between">
        <h5>Course Reviews ({reviews.length})</h5>
        {status == "authenticated" && (
          <Button onClick={onShowReview} disabled={!auth}>
            {reviewButtonText}
          </Button>
        )}
      </div>

      <div className="flex gap-2 items-center">
        <label>Sort By</label>
        <Select defaultValue="recent">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="recent">Most Recent</SelectItem>
            <SelectItem value="top">Top</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <br></br>

      {showReviewPrompt && <ReviewPrompt courseCode={courseCode} />}

      <div className="flex flex-col gap-2">
        {reviews.map((review) => (
          <Review key={review.email} review={review} onDelete={onDeleteReview} />
        ))}
      </div>
    </div>
  );
};

export default ReviewList;
