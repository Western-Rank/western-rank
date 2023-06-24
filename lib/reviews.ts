import { Course_Review } from "@prisma/client";

export type Course_Review_Create = Omit<
  Course_Review,
  "review_id" | "date_created" | "last_edited"
>;
