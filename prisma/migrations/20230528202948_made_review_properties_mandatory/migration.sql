/*
  Warnings:

  - Made the column `review` on table `Course_Review` required. This step will fail if there are existing NULL values in that column.
  - Made the column `difficulty` on table `Course_Review` required. This step will fail if there are existing NULL values in that column.
  - Made the column `liked` on table `Course_Review` required. This step will fail if there are existing NULL values in that column.
  - Made the column `attendance` on table `Course_Review` required. This step will fail if there are existing NULL values in that column.
  - Made the column `enthusiasm` on table `Course_Review` required. This step will fail if there are existing NULL values in that column.
  - Made the column `anon` on table `Course_Review` required. This step will fail if there are existing NULL values in that column.
  - Made the column `term_taken` on table `Course_Review` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Course_Review" ALTER COLUMN "review" SET NOT NULL,
ALTER COLUMN "difficulty" SET NOT NULL,
ALTER COLUMN "liked" SET NOT NULL,
ALTER COLUMN "attendance" SET NOT NULL,
ALTER COLUMN "enthusiasm" SET NOT NULL,
ALTER COLUMN "anon" SET NOT NULL,
ALTER COLUMN "term_taken" SET NOT NULL;
