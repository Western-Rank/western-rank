import {
  Avatar,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Stack,
  Typography,
} from "@mui/material";
import { Course_Review } from "@prisma/client";
import { useSession } from "next-auth/react";
import StatMeter, { MeterType } from "./StatMeter";

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
    <>
      <Card sx={{ maxWidth: "1000px" }}>
        <CardContent>
          <Stack
            display="flex"
            direction={{ xs: "column", sm: "column", md: "row" }}
            justifyContent="space-between"
          >
            <Box className="reviewBody" sx={{ flexBasis: "75%" }}>
              <Stack width={"50px"} sx={{ float: "left" }}>
                <Avatar
                  src="https://titles.trackercdn.com/valorant-api/agents/9f0d8ba9-4140-b941-57d3-a7ad57c6b417/displayicon.png"
                  className="reviewPic"
                />
              </Stack>
              <Stack direction="row" justifyContent="space-between">
                <Box>
                  <Typography variant="h6">
                    {review.anon ? "Anonymous" : review.email.split("@")[0]}
                  </Typography>
                  <Typography>
                    {review.date_created < review.last_edited
                      ? `Last Edited: ${new Date(review.last_edited).toDateString()}`
                      : `Posted: ${new Date(review.date_created).toDateString()}`}
                  </Typography>
                </Box>
                <CardActions>
                  {review.email === auth?.user?.email && (
                    <Button color="secondary" onClick={onDeleteReview}>
                      Delete
                    </Button>
                  )}
                </CardActions>
              </Stack>
              <Typography variant="body1">{review.review}</Typography>
            </Box>
            <Box className="statBlock" sx={{ flexBasis: "25%", maxWidth: "200px" }}>
              <StatMeter
                title="Difficulty"
                value={review.difficulty}
                type={MeterType.Star}
              ></StatMeter>
              <StatMeter
                title="Enthusiasm"
                value={review.enthusiasm}
                type={MeterType.Star}
              ></StatMeter>
              <StatMeter
                title="Attended"
                value={review.attendance}
                type={MeterType.Percentage}
              ></StatMeter>
              <StatMeter title="Liked" value={review.liked} type={MeterType.Flag}></StatMeter>
            </Box>
          </Stack>
        </CardContent>
      </Card>
    </>
  );
};

export default Review;
