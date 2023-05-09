/**
 * The component for submitting a review and its related information.
 */

import React, { useState } from 'react';
import { useUser } from '@auth0/nextjs-auth0';
import { Grid, TextField, Slider, Typography, Box, Card, Rating } from '@mui/material' 

import { CourseReview } from '../lib/reviews';
import { margin } from '@mui/system';

/**
 * Generate tick labels for a MUI material slider's 'marks' prop from min to max, inclusive
 */
function generateSliderTicks(min: number, max: number, step = 1) {
  const numTicks = Math.floor((max - min) / step) + 1;
  const arr = Array(numTicks).fill(0);
  return arr.map((_, idx) => {
    const tickNum = min + idx * step;
    return {
      value: tickNum,
      label: tickNum.toString(),
    };
  });
}

interface ReviewPromptProps {
  courseCode: string,
  previousReview?: CourseReview,
}

/**
 *  course_code,
    professor,
    review,
    email,
    difficulty,
    liked,
    attendance,
    enthusiasm,
    anon,
    date_created,
    last_edited
 */
const ReviewPrompt = ({ courseCode }: ReviewPromptProps) => {
  const { user } = useUser();

  const defaultValues = {
    course_code: courseCode,
    email: user!.email!,
    date_created: (new Date()).toDateString(),
    last_edited: (new Date()).toDateString(),
    liked: true,
    difficulty: 0,
    enthusiasm: 0,
    attendance: 0,
    professor: "",
    anon: false,
  }

  const [formValues, setFormValues] = useState(defaultValues);
  
  const handleInputChange = (event: any) => {
    const { name, value } = event.target;
    setFormValues((oldFormValues) => ({
      ...oldFormValues,
      [name] : value,
    }));
  }

  const handleSliderChange = (name: string) => (_event: any, value: any) => {
    setFormValues({
      ...formValues,
      [name]: value,
    });
  }

  const difficultyLabels: {[index: string]: string} = {
    0: "Free",
    0.5: "Bird",
    1: "Super Easy",
    1.5: "Very Easy",
    2: "Pretty Easy",
    2.5: "Okay",
    3: "Doable",
    3.5: "Some Effort",
    4: "Hard",
    4.5: "Very Hard",
    5: "Oof"
  }

  const handleSubmit = (event: any) => {
    event.preventDefault()
  }

  return (
    <>
      
  
      {/* i know we shouldn't use <br /> like this but this is just a mockup :) */}
      <Card sx={{ padding: "15px" }}>
        <Typography variant="h5">Review</Typography>
        <form onSubmit={handleSubmit}>
          <Grid container 
            spacing={2}
            direction={{ xs: "column", s: "column", md: "row", lg: "row" }}>

            <Grid item xs={8}>
              <TextField id="professor" label="Professor" variant="filled"></TextField>
            </Grid> 

            <Grid item xs={4}>
              <TextField id="professor" label="Professor" variant="filled"></TextField>
            </Grid> 

            <Grid item xs={12}>
              <TextField 
                fullWidth 
                multiline
                minRows={6}
                id="review" 
                label="Review" 
                variant="filled"
                placeholder="Write your review here...">
              </TextField>
            </Grid>

            <Grid item xs={4} justifyContent="center">
              <Typography variant="h6" gutterBottom>Difficulty</Typography>
              <Box sx={{ maxWidth: "600px", width: "95%", margin: "auto"}}>
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
              <Typography variant="h6" gutterBottom>Enthusiasm</Typography>
              <Box sx={{ maxWidth: "600px", width: "95%", margin: "auto"}}>
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
              <Typography variant="h6" gutterBottom>Attendance</Typography>
              <Box sx={{ maxWidth: "600px", width: "95%", margin: "auto"}}>
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
  );
}

export default ReviewPrompt;