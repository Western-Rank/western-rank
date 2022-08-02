
import React from 'react';
import {CourseReview} from '../lib/reviews';
import {} from '@auth0/nextjs-auth0';
import StatMeter, { MeterType } from './StatMeter';
import Link from 'next/link';
import {
    Avatar,
    Box,
    Card,
    CardContent,
    Modal,
    Stack,
    Typography,
    useTheme
} from '@mui/material'
import { margin } from '@mui/system';

// profile pic, review text,

interface ReviewProps {
    courseReview: CourseReview
}

const Review = ({ courseReview }: ReviewProps) => {
    const theme = useTheme();
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
                            <Typography variant="h6">{courseReview.anon ? "Anonymous" : courseReview.email.split("@")[0]}</Typography>
                            <Typography>{courseReview.date_created < courseReview.last_edited 
                                ? `Last Edited: ${(new Date(courseReview.last_edited)).toDateString()}`
                                : `Posted: ${(new Date(courseReview.date_created)).toDateString()}`}</Typography>
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