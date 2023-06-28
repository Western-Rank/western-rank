import { Course_Review } from "@prisma/client";

export type Course_Review_Create = Omit<
  Course_Review,
  "review_id" | "date_created" | "last_edited"
>;

export const SortKeys = ["date_created", "difficulty", "useful", "attendance"] as const;
export type SortKey = (typeof SortKeys)[number];

export const SortOrderOptions = ["asc", "desc"] as const;
export type SortOrder = (typeof SortOrderOptions)[number];
