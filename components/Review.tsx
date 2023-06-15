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
import { toast } from "@/components/ui/use-toast";
import { cn, formatTimeAgo } from "@/lib/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ThumbsDown, ThumbsUp, Trash2 } from "lucide-react";

// profile pic, review text,
interface ReviewProps {
  review: Course_Review;
  onDelete?: () => void;
  onEdit?: () => void;
  isUser?: boolean;
}

export const UserReview = ({ review }: ReviewProps) => {
  const queryClient = useQueryClient();

  const deleteReviewMutation = useMutation({
    mutationKey: ["delete-reviews", review.review_id],
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
      isUser
    />
  );
};

export const Review = ({ review, onDelete, onEdit, isUser }: ReviewProps) => {
  const { data: auth } = useSession();

  return (
    <div
      className={cn(
        "px-6 py-5 border-border border-[1px] rounded-md",
        isUser ? "border-muted-foreground" : "",
      )}
    >
      <div className="flex gap-3 flex-col sm:flex-row sm:justify-between">
        <div className="flex flex-col flex-1 gap-1">
          <div className="flex items-end px-0 gap-1.5">
            <h5 className="text-sm font-medium">{`${
              isUser ? "you" : review.anon ? "Anonymous" : review.email.split("@")[0]
            }`}</h5>
            <h6 className="text-sm text-muted-foreground">
              {review.date_created < review.last_edited
                ? formatTimeAgo(review.last_edited)
                : formatTimeAgo(review.date_created)}
            </h6>
            {review.liked ? (
              <ThumbsUp className="stroke-purple-600 px-1" />
            ) : (
              <ThumbsDown className="stroke-blue-400 px-1" />
            )}
          </div>
          <p className="text-sm flex-grow break-all pb-6">{review.review}</p>
          <h6 className="text-sm">
            {review?.professor && (
              <>
                {"taught by "}
                <a
                  href={`https://www.ratemyprofessors.com/search/professors/1491?q=${encodeURIComponent(
                    review?.professor || "",
                  )}`}
                  className="hover:underline text-blue-400"
                  target="_blank"
                >
                  {review?.professor}
                </a>
                {", "}
              </>
            )}
            {`${review.term_taken} ${review.date_taken?.getFullYear()}`}
          </h6>
        </div>
        <div className="w-42 flex flex-row flex-wrap items-center justify-between sm:flex-col md:items-end gap-2">
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
      {review.email === auth?.user?.email && (
        <div className="pt-4 flex-grow flex gap-2 justify-between">
          <AlertDialog>
            <Button
              className="text-destructive/80 hover:text-destructive hover:bg-destructive/5"
              variant="ghost"
              asChild
            >
              <AlertDialogTrigger>
                <Trash2 />
                <span className="sr-only">Delete</span>
              </AlertDialogTrigger>
            </Button>
            <AlertDialogContent className="light">
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete your account and remove
                  your data from our servers.
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
          <ReviewPrompt courseCode={review.course_code} review={review} />
        </div>
      )}
    </div>
  );
};

export default Review;
