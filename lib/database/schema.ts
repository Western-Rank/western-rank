import { pgTable, varchar, text, integer, boolean, timestamp } from "drizzle-orm/pg-core"

export const courses = pgTable("courses", {
	course_code: varchar("course_code", { length: 255 }).notNull(),
	course_name: text("course_name").notNull(),
	antirequisites: text("antirequisites"),
	prerequisites: text("prerequisites"),
	description: text("description"),
	location: text("location"),
	extra_info: text("extra_info"),
});

export const course_reviews = pgTable("course_reviews", {
	review_id: integer("review_id").notNull(),
	course_code: varchar("course_code", { length: 255 }).references(() => courses.course_code),
	professor: text("professor"),
	review: text("review"),
	email: text("email"),
	difficulty: integer("difficulty"),
	liked: boolean("liked"),
	attendance: integer("attendance"),
	enthusiasm: integer("enthusiasm"),
	anon: boolean("anon"),
	date_created: timestamp("date_created", { withTimezone: true, mode: 'string' }),
	last_edited: timestamp("last_edited", { withTimezone: true, mode: 'string' }),
});