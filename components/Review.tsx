import React from 'react';
import { CourseReview } from '../lib/reviews';
import StatMeter, { MeterType } from './StatMeter';
import Link from 'next/link';
import { useRouter } from 'next/router'
import { useUser } from '@auth0/nextjs-auth0';
import {
    Avatar,
    Box,
    Card,
    CardContent,
    Stack,
    Typography,
    Button,
    CardActions
} from '@mui/material'
import { deleteReview } from '../lib/reviews';
import { margin } from '@mui/system';
import DeleteIcon from '@mui/icons-material'

// profile pic, review text,

interface ReviewProps {
    courseReview: CourseReview,
    onDelete: () => void,
}

const Review = ({ courseReview, onDelete }: ReviewProps) => {
    const { user } = useUser();

    // Async function to delete user review
    const onDeleteReview = async () => {
        const deleteReviewURL = `${process.env.NEXT_PUBLIC_BASE_PATH}/api/reviews`; // API path for DELETE request
        const searchParams = new URLSearchParams({ // Query parameters: user email and course code
            email: user!.email!,
            course_code: courseReview.course_code,
        });
        console.log(`Deleting ${user!.email!}, ${courseReview.course_code}`)
        console.log(deleteReviewURL);
        console.log(searchParams);
        await fetch(`${deleteReviewURL}?${searchParams}`, { method: 'DELETE' }); // Send HTML DELETE request
        // reload page to update review list without deleted item
        onDelete();
    }

    return (
        <>
            <Card sx={{ maxWidth: "1000px"}}>
                <CardContent>
                    <Stack 
                        display="flex" 
                        direction={{xs: "column", sm: "column", md: "row"}}
                        justifyContent="space-between"
                    >
                        <Box className="reviewBody" sx={{ flexBasis: "75%" }}>
                            <Stack 
                                width={"50px"}
                                sx={{ float: "left" }}>
                                <Avatar src="https://titles.trackercdn.com/valorant-api/agents/9f0d8ba9-4140-b941-57d3-a7ad57c6b417/displayicon.png"
                                    className="reviewPic"/>
                            </Stack>
                            <Stack direction="row" justifyContent="space-between">
                                <Box>
                                    <Typography variant="h6">{courseReview.anon ? "Anonymous" : courseReview.email.split("@")[0]}</Typography>
                                    <Typography>{courseReview.date_created < courseReview.last_edited 
                                    ? `Last Edited: ${(new Date(courseReview.last_edited)).toDateString()}`
                                    : `Posted: ${(new Date(courseReview.date_created)).toDateString()}`}</Typography>
                                </Box>
                                <CardActions>
                                    {courseReview.email === user?.email && 
                                        <Button color="secondary" onClick={() => onDeleteReview()}>Delete</Button>}
                                </CardActions>
                            </Stack>
                            <Typography variant="body1">{courseReview.review}</Typography>
                        </Box>
                        <Box className="statBlock" sx={{ flexBasis: "25%",  maxWidth: "200px" }}>
                            <StatMeter title="Difficulty" value={courseReview.difficulty} type={MeterType.Star}></StatMeter>
                            <StatMeter title="Enthusiasm" value={courseReview.enthusiasm} type={MeterType.Star}></StatMeter>
                            <StatMeter title="Attended" value={courseReview.attendance} type={MeterType.Percentage}></StatMeter>
                            <StatMeter title="Liked" value={courseReview.liked} type={MeterType.Flag}></StatMeter>
                        </Box>
                    </Stack>
                </CardContent>

            </Card>
        </>
    );
}

export default Review;