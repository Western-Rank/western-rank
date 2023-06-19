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

export default function formatNumber(num: number, precision = 2): string {
  const map = [
    { suffix: "T", threshold: 1e12 },
    { suffix: "B", threshold: 1e9 },
    { suffix: "M", threshold: 1e6 },
    { suffix: "K", threshold: 1e3 },
  ];

  const found = map.find((x) => Math.abs(num) >= x.threshold);
  if (found) {
    const formatted = (num / found.threshold).toFixed(precision) + found.suffix;
    return formatted;
  }

  return num.toString();
}

export default function formatNumber(num: number, precision = 2): string {
  const map = [
    { suffix: "T", threshold: 1e12 },
    { suffix: "B", threshold: 1e9 },
    { suffix: "M", threshold: 1e6 },
    { suffix: "K", threshold: 1e3 },
  ];

  const found = map.find((x) => Math.abs(num) >= x.threshold);
  if (found) {
    const formatted = (num / found.threshold).toFixed(precision) + found.suffix;
    return formatted;
  }

  return num.toString();
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
