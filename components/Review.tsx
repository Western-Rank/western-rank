import { Course_Review } from "@prisma/client";
import { useSession } from "next-auth/react";

import { Button } from "./ui/button";
import { formatTimeAgo } from "@/lib/utils";
import { ThumbsUp, ThumbsDown } from "lucide-react";
import Stars from "./Stars";

// profile pic, review text,
interface ReviewProps {
  review: Course_Review;
  onDelete?: () => void;
}

const Review = ({ review, onDelete }: ReviewProps) => {
  const { data: auth } = useSession();

  const onDeleteReview = async () => {
    if (!auth) return; // if user is not logged in, do nothing

    const searchParams = new URLSearchParams({
      email: auth.user!.email!,
      course_code: review.course_code,
    });

    await fetch(`api/reviews?${searchParams}`, { method: "DELETE" });

    if (onDelete) onDelete();
  };
  return (
    <div className="p-6 border-border border-[1px] rounded-md flex gap-2 flex-col md:flex-row md:justify-between">
      <div className="flex flex-col flex-1">
        <p className="flex-grow break-all pb-6">{review.review}</p>
        <div className="flex justify-between">
          <div>
            <h5>
              {`~ ${review.anon ? "Anonymous" : review.email.split("@")[0]}, taught by `}
              <a
                href={`https://www.ratemyprofessors.com/search/professors/1491?q=${encodeURIComponent(
                  review?.professor || "",
                )}`}
                className="hover:underline"
                target="_blank"
              >
                {review.professor}
              </a>
              {` in ${review.term_taken} ${review.date_taken?.getFullYear()}`}
            </h5>
            <h6 className="italic">
              {review.date_created < review.last_edited
                ? formatTimeAgo(review.last_edited)
                : formatTimeAgo(review.date_created)}
            </h6>
          </div>
        </div>
      </div>
      <div className="w-36 flex flex-col md:items-end gap-2">
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
        <div className="pt-3">
          {review.email === auth?.user?.email && (
            <Button color="secondary" onClick={onDeleteReview}>
              Delete
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Review;
