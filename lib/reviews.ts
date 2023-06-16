import { Course_Review } from "@prisma/client";

export const requisiteTypes = [
  "Prerequisites",
  "Corequisites",
  "Antirequisites",
  "Pre-or-Corequisites",
] as const;

export type Course_Review_Create = Omit<
  Course_Review,
  "review_id" | "date_created" | "last_edited"
>;
