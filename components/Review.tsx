import { Course_Review } from "@prisma/client";
import { useSession } from "next-auth/react";

import PercentBar from "@/components/PercentBar";
import ReviewPrompt from "@/components/ReviewPrompt";
import Stars from "@/components/Stars";
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
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/components/ui/use-toast";
import { encodeCourseCode } from "@/lib/courses";
import { cn, formatTimeAgo } from "@/lib/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { MoreHorizontal, ThumbsDown, ThumbsUp } from "lucide-react";
import Link from "next/link";

interface ReviewProps {
  review: Course_Review;
  onDelete?: () => void;
  onEdit?: () => void;
  isUser?: boolean;
  includeCourseCode?: boolean;
}

export const UserReview = ({ review, includeCourseCode, onDelete, onEdit }: ReviewProps) => {
  const queryClient = useQueryClient();

  const deleteReviewMutation = useMutation({
    mutationKey: ["delete-review", review.review_id],
    mutationFn: async () => {
      const res = await fetch(`/api/reviews/${review.review_id}`, {
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

      if (onDelete) {
        onDelete();
      }
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
    <Review
      review={{
        ...review,
        date_created: new Date(review.date_created),
        last_edited: new Date(review.last_edited),
        date_taken: new Date(review.date_taken),
      }}
      onDelete={deleteReviewMutation.mutate}
      onEdit={onEdit}
      isUser
      includeCourseCode={includeCourseCode}
    />
  );
};

export const Review = ({ review, onDelete, onEdit, isUser, includeCourseCode }: ReviewProps) => {
  const { data: auth } = useSession();

  return (
    <div
      className={cn(
        "px-6 py-5 border-[1px] rounded-md group ",
        isUser && !includeCourseCode ? "border-muted-foreground" : "border-border",
      )}
    >
      <div className="flex flex-grow gap-3 flex-col sm:flex-row sm:justify-between h-full">
        <div className="flex flex-col flex-1 md:max-w-md 2xl:max-w-3xl overflow-hidden">
          <div className="flex items-end px-0 gap-1">
            <h5 className="text-sm font-medium">{`${
              review.anon ? "Anonymous" : review.email.split("@")[0]
            }`}</h5>
            {review.liked ? (
              <ThumbsUp className="stroke-purple-600 px-1" />
            ) : (
              <ThumbsDown className="stroke-blue-400 px-1" />
            )}
            {review.email === auth?.user?.email && (
              <Popover>
                <PopoverTrigger className="text-xs text-muted-foreground font-bold outline-ring rounded-xl">
                  <MoreHorizontal />
                </PopoverTrigger>
                <PopoverContent side="top" className="p-0 w-fit flex flex-row">
                  <AlertDialog>
                    <Button
                      variant="ghost"
                      className="m-0 hover:bg-destructive/30 text-destructive hover:text-destructive rounded-r-none"
                      asChild
                    >
                      <AlertDialogTrigger>Delete</AlertDialogTrigger>
                    </Button>
                    <AlertDialogContent className="light">
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Are you sure you want to delete your review?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently delete your review for{" "}
                          {review.course_code}.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <Button variant="destructive" asChild>
                          <AlertDialogAction onClick={onDelete}>Continue</AlertDialogAction>
                        </Button>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                  <Separator orientation="vertical" className="w-[1px] h-200" />
                  <ReviewPrompt
                    courseCode={review.course_code}
                    review={review}
                    onSubmitReview={onEdit}
                  />
                </PopoverContent>
              </Popover>
            )}
          </div>
          <h6 className="text-xs text-muted-foreground">
            {review.date_created < review.last_edited
              ? formatTimeAgo(review.last_edited)
              : formatTimeAgo(review.date_created)}
          </h6>
          <p className="text-sm flex-grow flex-1 py-2 break-words w-full" lang="en">
            {review.review ?? <span className="text-muted-foreground">(no written review)</span>}
          </p>
          <div>
            {includeCourseCode && (
              <Button variant="link" className="text-sm text-blue-400 p-0 pr-1 h-2" asChild>
                <Link href={`/course/${encodeCourseCode(review.course_code)}`}>
                  {review.course_code}
                </Link>
              </Button>
            )}
            <h6 className="text-sm">
              {review?.professor_name && review?.professor_id && review?.professor_id > 0 && (
                <>
                  {"taught by "}
                  <Button variant="link" className="p-0 h-2.5 text-blue-500" asChild>
                    <a
                      href={`https://www.ratemyprofessors.com/professor/${encodeURIComponent(
                        review?.professor_id || "",
                      )}`}
                      className="hover:underline text-blue-400"
                      target="_blank"
                    >
                      {review?.professor_name}
                    </a>
                  </Button>
                  {", "}
                </>
              )}
              {`${review.term_taken} ${review.date_taken?.getFullYear()}`}
            </h6>
          </div>
        </div>
        <div className="w-42 flex flex-row flex-wrap items-center sm:flex-col md:items-end gap-2">
          <div className="flex flex-col md:items-end">
            <h6 className="text-sm font-semibold">Difficulty</h6>
            <Stars value={review.difficulty / 2.0} size={25} theme="purple" />
          </div>
          <div className="flex flex-col md:items-end">
            <h6 className="text-sm font-semibold">Useful</h6>
            <Stars value={review.useful / 2.0} size={25} theme="blue" />
          </div>
          <div className="flex flex-col md:items-end w-full gap-1.5">
            <h6 className="text-sm font-semibold">Attendance</h6>
            <PercentBar percent={review.attendance}>
              <span>{`Attended ${review.attendance}% of lectures`}</span>
            </PercentBar>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Review;
