import { drizzle } from "drizzle-orm/node-postgres"
import { Pool } from "pg"

import {
  accounts,
  course_reviews,
  courses,
  sessions,
  users,
  verificationTokens,
} from "./schema"

const pool = new Pool({
  host: process.env.DB_HOST_NAME,
  port: parseInt(process.env.DB_PORT!),
  user: process.env.DB_USER_NAME,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  max: 10,
})

export const db = drizzle(pool)

export type DbClient = typeof db

export type Schema = {
  courses: typeof courses
  course_reviews: typeof course_reviews
  users: typeof users
  accounts: typeof accounts
  sessions: typeof sessions
  verificationTokens: typeof verificationTokens
}
