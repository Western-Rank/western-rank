-- CreateTable
CREATE TABLE "Course" (
    "course_code" VARCHAR(255) NOT NULL,
    "course_name" TEXT NOT NULL,
    "antirequisites" TEXT,
    "prerequisites" TEXT,
    "description" TEXT,
    "location" TEXT,
    "extra_info" TEXT,

    CONSTRAINT "Course_pkey" PRIMARY KEY ("course_code")
);

-- CreateTable
CREATE TABLE "Course_Review" (
    "review_id" SERIAL NOT NULL,
    "course_code" VARCHAR(255),
    "professor" TEXT,
    "review" TEXT,
    "email" TEXT,
    "difficulty" INTEGER,
    "liked" BOOLEAN,
    "attendance" INTEGER,
    "enthusiasm" INTEGER,
    "anon" BOOLEAN,
    "date_created" TIMESTAMPTZ(6),
    "last_edited" TIMESTAMPTZ(6),
    "date_taken" DATE,

    CONSTRAINT "Course_Review_pkey" PRIMARY KEY ("review_id")
);

-- AddForeignKey
ALTER TABLE "Course_Review" ADD CONSTRAINT "Course_Review_course_code_fkey" FOREIGN KEY ("course_code") REFERENCES "Course"("course_code") ON DELETE NO ACTION ON UPDATE NO ACTION;
