import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const formatter = new Intl.RelativeTimeFormat(undefined, {
  numeric: "auto",
});

const DIVISIONS = [
  { amount: 60, name: "seconds" },
  { amount: 60, name: "minutes" },
  { amount: 24, name: "hours" },
  { amount: 7, name: "days" },
  { amount: 4.34524, name: "weeks" },
  { amount: 12, name: "months" },
  { amount: Number.POSITIVE_INFINITY, name: "years" },
];

/**
 * Format date as text in "_num_ _time period(s)_ ago" format
 * @param date
 * @returns
 */
export function formatTimeAgo(date: Date) {
  let duration = (date.getTime() - new Date().getTime()) / 1000;

  for (let i = 0; i < DIVISIONS.length; i++) {
    const division = DIVISIONS[i];
    if (Math.abs(duration) < division.amount) {
      return formatter.format(Math.round(duration), division.name as any);
    }
    duration /= division.amount;
  }
}

/**
 * Generate tick labels for a MUI material slider's 'marks' prop from min to max, inclusive
 * TODO move to utils
 */
function generateSliderTicks(min: number, max: number, step = 1) {
  const numTicks = Math.floor((max - min) / step) + 1;
  const arr = Array(numTicks).fill(0);
  return arr.map((_, idx) => {
    const tickNum = min + idx * step;
    return {
      value: tickNum,
      label: tickNum.toString(),
    };
  });
}
