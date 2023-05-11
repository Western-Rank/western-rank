import { pgTable, serial, text, varchar } from 'drizzle-orm/pg-core';

export const courses = pgTable('courses', {
    course_code: varchar('course_code', { length: 256 }).primaryKey(),
    course_name: text('course_name'),
    antirequisites: text('antirequisites'),
    prerequisites: text('prerequisites'),
    description: text('description'),
    location: text('location'),
    extra_info: text('extra_info')
});