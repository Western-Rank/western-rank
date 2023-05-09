CREATE TABLE IF NOT EXISTS courses (
    course_code VARCHAR(255) PRIMARY KEY,
    course_name TEXT NOT NULL,
    antirequisites TEXT,
    prerequisites TEXT,
    description TEXT,
    location TEXT,
    extra_info TEXT
);

CREATE TABLE IF NOT EXISTS course_reviews (
    review_id INT GENERATED ALWAYS AS IDENTITY,
    course_code VARCHAR(255),
    professor TEXT,
    review TEXT,
    email TEXT,
    difficulty INT,
    liked BOOLEAN,
    attendance INT,
    enthusiasm INT,
    anon BOOLEAN,
    date_created TIMESTAMPTZ,
    last_edited TIMESTAMPTZ,
    PRIMARY KEY(review_id),
    CONSTRAINT fk_course
        FOREIGN KEY(course_code)
            REFERENCES courses(course_code)
);