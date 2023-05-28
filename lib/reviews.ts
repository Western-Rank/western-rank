import { Term } from "@prisma/client"

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

  if (9 <= month && month <= 12) return "Fall"
  else if (1 <= month && month <= 4) return "Winter"
  else return "Summer"
}

/**
 * Get the school term and year from a JavaScript date object.
 * @param date A JavaScript date object.
 * @returns the school term and year as an array [term: Term, year: number]
 */
export function dateToTermAndYear(date: Date): [Term, number] {
  const year = date.getFullYear()
  const term = getTermFromMonth(date.getMonth())

  return [term, year]
}
