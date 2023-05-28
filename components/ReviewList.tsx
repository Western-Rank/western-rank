import { Button, Stack, Typography } from "@mui/material"
import { Course_Review } from "@prisma/client"
import { useSession } from "next-auth/react"
import { useRouter } from "next/router"
import { useState } from "react"
import Review from "./Review"
import ReviewPrompt from "./ReviewPrompt"

interface ReviewListProps {
  courseCode?: string
  reviews: Course_Review[]
}

/**
 * The modal displaying all reviews on the course page.
 */
const ReviewList = ({ courseCode = "", reviews }: ReviewListProps) => {
  const router = useRouter()
  const { data: auth, status } = useSession()

  const [showReviewPrompt, setShowReviewPrompt] = useState(false)
  const userHasReview = reviews.some(({ email }) => auth?.user!.email === email)
  const isProfile = !courseCode

  if (status === "loading") return <p>Loading...</p>

  const reviewButtonText = !auth
    ? "Log in to write a review"
    : userHasReview
    ? "Edit your review"
    : "Write a review"

  const onShowReview = () => {
    if (!auth) alert("You must be logged in to post a review")
    else setShowReviewPrompt((prev) => !prev)
  }

  // called after the review deletes itself to update the review list
  // TODO revalidate using react query
  const onDeleteReview = () => router.replace(router.asPath)

  return (
    <>
      <Stack>
        <Stack direction="row" justifyContent="space-between">
          <Typography>Course Reviews ({reviews.length})</Typography>
          {!isProfile && (
            <Button color="secondary" onClick={onShowReview} disabled={!auth}>
              {reviewButtonText}
            </Button>
          )}
        </Stack>
      </Stack>
      <label htmlFor="sort">Sort By</label>

      <select name="sort">
        <option value="recent">Recent</option>
        <option value="top">Top</option>
      </select>

      <br></br>

      {!isProfile && showReviewPrompt && (
        <ReviewPrompt courseCode={courseCode} />
      )}

      <Stack spacing={2}>
        {reviews.map((review) => (
          <Review
            key={review.email}
            review={review}
            onDelete={onDeleteReview}
          />
        ))}
      </Stack>
    </>
  )
}

export default ReviewList
