import { Box, Card, Grid, Slider, TextField, Typography } from "@mui/material"
import { Course } from "@prisma/client"
import { useSession } from "next-auth/react"
import { FormEvent, useEffect, useState } from "react"

/**
 * Generate tick labels for a MUI material slider's 'marks' prop from min to max, inclusive
 * TODO move to utils
 */
function generateSliderTicks(min: number, max: number, step = 1) {
  const numTicks = Math.floor((max - min) / step) + 1
  const arr = Array(numTicks).fill(0)
  return arr.map((_, idx) => {
    const tickNum = min + idx * step
    return {
      value: tickNum,
      label: tickNum.toString(),
    }
  })
}

interface ReviewPromptProps {
  courseCode: Course["course_code"]
}

/**
 * The component for submitting a review and its related information.
 */
const ReviewPrompt = ({ courseCode }: ReviewPromptProps) => {
  const { data: auth } = useSession()

  const [formValues, setFormValues] = useState({
    course_code: courseCode,
    email: "",
    date_created: new Date().toDateString(),
    last_edited: new Date().toDateString(),
    liked: true,
    difficulty: 0,
    enthusiasm: 0,
    attendance: 0,
    professor: "",
    anon: false,
  })

  const updateForm = (name: string, value: any) =>
    setFormValues((prev) => ({
      ...prev,
      [name]: value,
    }))

  useEffect(() => updateForm("email", auth?.user?.email ?? ""), [auth])

  const handleInputChange = (event: any) => {
    const { name, value } = event.target
    updateForm(name, value)
  }

  const handleSliderChange = (name: string) => (_event: any, value: any) =>
    updateForm(name, value)

  const handleSubmit = (event: FormEvent) => event.preventDefault()

  return (
    <>
      {/* i know we shouldn't use <br /> like this but this is just a mockup :) */}
      <Card sx={{ padding: "15px" }}>
        <Typography variant="h5">Review</Typography>
        <form onSubmit={handleSubmit}>
          <Grid
            container
            spacing={2}
            direction={{ xs: "column", s: "column", md: "row", lg: "row" }}
          >
            <Grid item xs={8}>
              <TextField id="professor" label="Professor" variant="filled" />
            </Grid>

            <Grid item xs={4}>
              <TextField id="professor" label="Professor" variant="filled" />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                minRows={6}
                id="review"
                label="Review"
                variant="filled"
                placeholder="Write your review here..."
              />
            </Grid>

            <Grid item xs={4} justifyContent="center">
              <Typography variant="h6" gutterBottom>
                Difficulty
              </Typography>
              <Box sx={{ maxWidth: "600px", width: "95%", margin: "auto" }}>
                <Slider
                  color="secondary"
                  aria-label="difficulty"
                  valueLabelDisplay="auto"
                  marks={generateSliderTicks(1, 5)}
                  min={1}
                  max={5}
                />
              </Box>
            </Grid>

            <Grid item xs={4} justifyContent="center">
              <Typography variant="h6" gutterBottom>
                Enthusiasm
              </Typography>
              <Box sx={{ maxWidth: "600px", width: "95%", margin: "auto" }}>
                <Slider
                  color="secondary"
                  aria-label="enthusiasm"
                  valueLabelDisplay="auto"
                  marks={generateSliderTicks(1, 5)}
                  min={1}
                  max={5}
                />
              </Box>
            </Grid>

            <Grid item xs={4} justifyContent="center">
              <Typography variant="h6" gutterBottom>
                Attendance
              </Typography>
              <Box sx={{ maxWidth: "600px", width: "95%", margin: "auto" }}>
                <Slider
                  color="secondary"
                  aria-label="attendance"
                  valueLabelDisplay="auto"
                  marks={generateSliderTicks(1, 5)}
                  min={1}
                  max={5}
                />
              </Box>
            </Grid>
          </Grid>
        </form>
      </Card>
    </>
  )
}

export default ReviewPrompt
