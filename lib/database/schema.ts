import { pgTable, varchar, text, integer, boolean, timestamp } from "drizzle-orm/pg-core"

export const courses = pgTable("courses", {
	courseCode: varchar("course_code", { length: 255 }).notNull(),
	courseName: text("course_name").notNull(),
	antirequisites: text("antirequisites"),
	prerequisites: text("prerequisites"),
	description: text("description"),
	location: text("location"),
	extraInfo: text("extra_info"),
});

export const courseReviews = pgTable("course_reviews", {
	reviewId: integer("review_id").notNull(),
	courseCode: varchar("course_code", { length: 255 }).references(() => courses.courseCode),
	professor: text("professor"),
	review: text("review"),
	email: text("email"),
	difficulty: integer("difficulty"),
	liked: boolean("liked"),
	attendance: integer("attendance"),
	enthusiasm: integer("enthusiasm"),
	anon: boolean("anon"),
	dateCreated: timestamp("date_created", { withTimezone: true, mode: 'string' }),
	lastEdited: timestamp("last_edited", { withTimezone: true, mode: 'string' }),
});