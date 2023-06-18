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
 * 0 -> 10, 13 -> 10, 46 -> 40, 1123 -> 1000, etc.
 *
 * @param x number
 * @returns
 */
export function formatCount(x: number): number {
  if (x === 0) {
    return 10;
  }

  // 13

  const numDigits = x.toString().length; // 2
  // 10^2 = 100
  // 13
  return Math.floor(x / 10 ** (numDigits - 1)) * 10 ** (numDigits - 1);
}

/**
 * Generate tick labels for a MUI material slider's 'marks' prop from min to max, inclusive
 */
export function generateSliderTicks(min: number, max: number, step = 1) {
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

export function roundToNearest(num: number, digits: number) {
  return Math.round(num * Math.pow(10, digits)) / Math.pow(10, digits);
}
