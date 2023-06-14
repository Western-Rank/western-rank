import { Course_Review } from "@prisma/client";
import { useSession } from "next-auth/react";

import { Button } from "./ui/button";
import { cn, formatTimeAgo } from "@/lib/utils";
import { ThumbsUp, ThumbsDown } from "lucide-react";
import Stars from "./Stars";
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
} from "./ui/alert-dialog";
import ReviewPrompt from "./ReviewPrompt";

// profile pic, review text,
interface ReviewProps {
  review: Course_Review;
  onDelete?: () => void;
  onEdit?: () => void;
  isUser?: boolean;
}

const Review = ({ review, onDelete, onEdit, isUser }: ReviewProps) => {
  const { data: auth } = useSession();

  return (
    <div
      className={cn(
        "p-6 border-border border-[1px] rounded-md",
        isUser ? "border-muted-foreground" : "",
      )}
    >
      <div className="flex gap-2 flex-col sm:flex-row sm:justify-between">
        <div className="flex flex-col flex-1">
          <div className="flex items-center gap-1">
            <h5 className="font-medium">{`${
              isUser ? "you" : review.anon ? "Anonymous" : review.email.split("@")[0]
            }`}</h5>
            <h6 className="text-sm text-muted-foreground">
              {review.date_created < review.last_edited
                ? formatTimeAgo(review.last_edited)
                : formatTimeAgo(review.date_created)}
            </h6>
          </div>
          <p className="flex-grow break-all pb-6">{review.review}</p>
          <h6>
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
            <h6 className="font-semibold">Difficulty</h6>
            <Stars value={review.difficulty / 2.0} size={30} theme="purple" />
          </div>
          <div className="flex flex-col md:items-end">
            <h6 className="font-semibold">Useful</h6>
            <Stars value={review.useful / 2.0} size={30} theme="blue" />
          </div>
          <div className="flex flex-col md:items-end">
            <h6 className="font-semibold">Attendance</h6>
            <p>{review.attendance}%</p>
          </div>
          {review.liked ? (
            <ThumbsUp className="stroke-purple-600" />
          ) : (
            <ThumbsDown className="stroke-blue-400" />
          )}
        </div>
      </div>
      {review.email === auth?.user?.email && (
        <div className="pt-4 flex-grow flex gap-2 justify-between">
          <AlertDialog>
            <Button variant="destructive" asChild>
              <AlertDialogTrigger>Delete</AlertDialogTrigger>
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
          <ReviewPrompt courseCode={review.course_code} editReview={review} />
        </div>
      )}
    </div>
  );
};

export default Review;
