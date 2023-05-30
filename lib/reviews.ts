import { Term } from "@prisma/client";

const DIFFICULTY_LABELS = {
  0: "Free",
  0.5: "Bird",
  1: "Super Easy",
  1.5: "Very Easy",
  2: "Pretty Easy",
  2.5: "Okay",
  3: "Doable",
  3.5: "Some Effort",
  4: "Hard",
  4.5: "Very Hard",
  5: "Oof",
} as const;

/**
 * Get the school semester/term given the month (as a number).
 * @param month (0-11) representation of the month
 * @returns the school term of type Term ('fall', 'winter', 'summer')
 */
function getTermFromMonth(month: number): Term {
  /**
   * fall: sept (9), oct (10), nov (11), dec (12)
   * winter: jan (1), feb (2), march (3), april (4)
   * summer: may (5), june (6), july (7), august (8)
   */

  if (month > 12 || month < 0) throw new Error("Invalid month (1-12)");

  if (month >= 9) return "Fall";
  else if (month >= 5) return "Summer";
  else return "Winter";
}

/**
 * Get the school term and year from a JavaScript date object.
 * @param date A JavaScript date object.
 * @returns the school term and year as an array [term: Term, year: number]
 */
export function dateToTermAndYear(date: Date): [Term, number] {
  const year = date.getFullYear();
  const term = getTermFromMonth(date.getMonth());

  return [term, year];
}
