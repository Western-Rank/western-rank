import { pgTable, serial, text, varchar } from 'drizzle-orm/pg-core';

export const courses = pgTable('courses', {
    review_id: serial('review_id').primaryKey(),
    course_code: varchar('course_code', { length: 256 })
        .references(() => courses.course_code),
    professor: text('professor'),
    
});