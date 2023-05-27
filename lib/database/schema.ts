import {
  pgTable,
  varchar,
  text,
  integer,
  boolean,
  timestamp,
  serial,
  date,
  primaryKey,
} from "drizzle-orm/pg-core"
import { ProviderType } from "next-auth/providers"

export const courses = pgTable("courses", {
  course_code: varchar("course_code", { length: 255 }).notNull(),
  course_name: text("course_name").notNull(),
  antirequisites: text("antirequisites"),
  prerequisites: text("prerequisites"),
  description: text("description"),
  location: text("location"),
  extra_info: text("extra_info"),
})

export const course_reviews = pgTable("course_reviews", {
  review_id: serial("review_id").primaryKey(),
  course_code: varchar("course_code", { length: 255 }).references(
    () => courses.course_code,
  ),
  professor: text("professor"),
  review: text("review"),
  email: text("email"),
  difficulty: integer("difficulty"),
  liked: boolean("liked"),
  attendance: integer("attendance"),
  enthusiasm: integer("enthusiasm"),
  anon: boolean("anon"),
  date_created: timestamp("date_created", { withTimezone: true, mode: "date" }),
  last_edited: timestamp("last_edited", { withTimezone: true, mode: "date" }),
  date_taken: date("date_taken", { mode: "date" }),
})

// NextAuth

export const users = pgTable("users", {
  id: text("id").notNull().primaryKey(),
  name: text("name"),
  email: text("email").notNull(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  image: text("image"),
})

export const accounts = pgTable(
  "accounts",
  {
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").$type<ProviderType>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => ({
    compoundKey: primaryKey(account.provider, account.providerAccountId),
  }),
)

export const sessions = pgTable("sessions", {
  sessionToken: text("sessionToken").notNull().primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
})

export const verificationTokens = pgTable(
  "verificationToken",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (vt) => ({
    compoundKey: primaryKey(vt.identifier, vt.token),
  }),
)
