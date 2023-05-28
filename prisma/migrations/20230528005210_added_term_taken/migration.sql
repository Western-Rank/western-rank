/*
  Warnings:

  - Made the column `email` on table `Course_Review` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "Term" AS ENUM ('Fall', 'Winter', 'Summer');

-- AlterTable
ALTER TABLE "Course_Review" ADD COLUMN     "term_taken" "Term",
ALTER COLUMN "email" SET NOT NULL;
