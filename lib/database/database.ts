import { pgTable, serial, text, varchar } from 'drizzle-orm/pg-core';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

import { courses } from './schema/courses';
import { reviews } from './schema/reviews';

const pool = new Pool({
  host: process.env.DB_HOST_NAME,
  port: parseInt(process.env.DB_PORT!),
  user: process.env.DB_USER_NAME,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  max: 10
});

export const db = drizzle(pool);