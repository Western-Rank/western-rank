import { Course_Review } from "@prisma/client";
import { useSession } from "next-auth/react";
import StatMeter, { MeterType } from "./StatMeter";

import { Button } from "./ui/button";
import { formatTimeAgo } from "@/lib/utils";
import { ThumbsUp, ThumbsDown } from "lucide-react";

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
          <div>
            {review.email === auth?.user?.email && (
              <Button color="secondary" onClick={onDeleteReview}>
                Delete
              </Button>
            )}
          </div>
        </div>
      </div>
      <div className="w-36 flex flex-col md:items-end gap-2">
        <div className="flex flex-col md:items-end">
          <h6 className="font-semibold">Difficulty</h6>
          <p>{review.difficulty}%</p>
        </div>
        <div className="flex flex-col md:items-end">
          <h6 className="font-semibold">Enthusiasm</h6>
          <p>{review.enthusiasm}%</p>
        </div>
        <div className="flex flex-col md:items-end">
          <h6 className="font-semibold">Attendance</h6>
          <p>{review.attendance}%</p>
        </div>
        {review.liked ? <ThumbsUp /> : <ThumbsDown />}
      </div>
    </div>
  );
};

export default Review;
