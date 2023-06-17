import { Course_Review } from "@prisma/client";

export const requisiteTypes = [
  "Prerequisites",
  "Corequisites",
  "Antirequisites",
  "Pre-or-Corequisites",
] as const;

const requisiteDefinition = {
  Prerequisites: "a course that must be completed in order to register in your desired course.",
  Corequisites: "a course that must be taken concurrently with the desired course.",
  Antirequisites: "courses that have very similar content so they cannot both be taken for credit.",
  "Pre-or-Corequisites":
    "a course that must be completed before taking or concurrently with the desired course",
};

export type Course_Review_Create = Omit<
  Course_Review,
  "review_id" | "date_created" | "last_edited"
>;
