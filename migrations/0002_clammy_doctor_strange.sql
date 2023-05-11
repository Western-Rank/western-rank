CREATE TABLE IF NOT EXISTS "course_reviews" (
	"review_id" integer NOT NULL,
	"course_code" varchar(255),
	"professor" text,
	"review" text,
	"email" text,
	"difficulty" integer,
	"liked" boolean,
	"attendance" integer,
	"enthusiasm" integer,
	"anon" boolean,
	"date_created" timestamp with time zone,
	"last_edited" timestamp with time zone
);

CREATE TABLE IF NOT EXISTS "courses" (
	"course_code" varchar(255) NOT NULL,
	"course_name" text NOT NULL,
	"antirequisites" text,
	"prerequisites" text,
	"description" text,
	"location" text,
	"extra_info" text
);

DO $$ BEGIN
 ALTER TABLE "course_reviews" ADD CONSTRAINT "course_reviews_course_code_courses_course_code_fk" FOREIGN KEY ("course_code") REFERENCES "courses"("course_code") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
