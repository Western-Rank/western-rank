/**
 * Concatenate course code and course name into one entry, e.g. CALC 1000: Calculus I
 * @param courseCode
 * @param courseName
 * @returns The concatenated full course name
 */
export function formatFullCourseName(courseCode: string, courseName: string) {
  return `${courseCode}: ${courseName}`
}
