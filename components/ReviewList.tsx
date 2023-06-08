import { Course_Review } from "@prisma/client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
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

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "./ui/label";
import { Input } from "./ui/input";

interface ReviewListProps {
  courseCode: string;
  reviews: Course_Review[];
}

const SortOrderOptions = ["recent", "difficulty", "enthusiasm", "attendance"] as const;

/**
 * The modal displaying all reviews on the course page.
 */
const ReviewList = ({ courseCode, reviews }: ReviewListProps) => {
  const router = useRouter();
  const { data: auth, status } = useSession();

  const [showReviewPrompt, setShowReviewPrompt] = useState(false);
  const userHasReview = reviews.some(({ email }) => auth?.user!.email === email);
  const [sortOrder, setSortOrder] = useState<(typeof SortOrderOptions)[number]>("recent");

  const reviewButtonText = !auth
    ? "Log in to Review"
    : userHasReview
    ? "Edit your Review"
    : "Review";

  const onShowReview = () => {
    if (!auth) alert("You must be logged in to post a review");
    else setShowReviewPrompt((prev) => !prev);
  };

  // called after the review deletes itself to update the review list
  // TODO revalidate using react query
  const onDeleteReview = () => router.replace(router.asPath);

  return (
    <div className="flex flex-col">
      <div className="flex justify-between">
        <h5 className="font-bold text-lg">Course Reviews ({reviews.length})</h5>
        <Dialog>
          <DialogTrigger asChild>
            <Button disabled={!auth}>{reviewButtonText}</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Edit profile</DialogTitle>
              <DialogDescription>
                Make changes to your profile here. Click save when you&pos;re done.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input id="name" value="Pedro Duarte" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="username" className="text-right">
                  Username
                </Label>
                <Input id="username" value="@peduarte" className="col-span-3" />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Save changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex gap-2 items-center">
        <label>Sort By</label>
        <Select
          defaultValue="recent"
          onValueChange={(value) => {
            if (value in SortOrderOptions) setSortOrder(value as (typeof SortOrderOptions)[number]);
          }}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            {SortOrderOptions.map((option, index) => (
              <SelectItem key={index} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <br></br>

      {showReviewPrompt && <ReviewPrompt courseCode={courseCode} />}

      <div className="flex flex-col gap-4">
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
