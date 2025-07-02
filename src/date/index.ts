import { Temporal } from "@js-temporal/polyfill";
import type { Holiday, WeekDay, PlainDate } from "../types";
import { InvalidDateError } from "../errors";

/**
 * Determines whether a given date is a business day (workday).
 *
 * A business day is defined as a day that is:
 * - Not a weekend day (configurable, defaults to Saturday and Sunday)
 * - Not a holiday from the provided holiday list
 *
 * @param date - The date to check. Can be a Temporal.PlainDate object or an ISO date string (YYYY-MM-DD)
 * @param holidayList - An array of holiday objects. Each holiday can be either a one-time holiday or a recurring annual holiday
 * @param dayOffWeekdays - An array of weekday numbers representing non-working days. Uses ISO weekday numbering (1=Monday, 7=Sunday). Defaults to [6, 7] (Saturday, Sunday)
 * @returns `true` if the date is a business day, `false` otherwise
 *
 * @example
 * ```typescript
 * // Check if a specific date is a workday
 * const isWorkday1 = isWorkday('2024-01-15'); // true (Monday)
 * const isWorkday2 = isWorkday('2024-01-13'); // false (Saturday)
 *
 * // With custom holidays
 * const holidays = [
 *   { date: '2024-01-01', recurring: false }, // New Year's Day
 *   { date: '2024-12-25', recurring: true }   // Christmas (recurring)
 * ];
 * const isWorkday3 = isWorkday('2024-01-01', holidays); // false
 *
 * // With custom weekend days (e.g., Friday-Saturday weekend)
 * const isWorkday4 = isWorkday('2024-01-12', [], [5, 6]); // false (Friday in this case)
 * ```
 */
export function isWorkday(
  date: PlainDate | string,
  holidayList: Holiday[] = [],
  dayOffWeekdays: WeekDay[] = [6, 7],
): boolean {
  const plainDate = typeof date === "string" ? Temporal.PlainDate.from(date) : date;

  const dayOfWeek = plainDate.dayOfWeek;
  if (dayOffWeekdays.includes(dayOfWeek as WeekDay)) {
    return false;
  }

  const dateString = plainDate.toString();
  const isHoliday = holidayList.some((holiday) => {
    if (holiday.recurring) {
      const holidayDate = Temporal.PlainDate.from(holiday.date);
      return holidayDate.month === plainDate.month && holidayDate.day === plainDate.day;
    }
    return holiday.date === dateString;
  });

  return !isHoliday;
}

/**
 * Returns the day of the week for a given date using ISO weekday numbering.
 *
 * @param date - The date to get the weekday for. Can be a Temporal.PlainDate object or an ISO date string (YYYY-MM-DD)
 * @returns The weekday number (1=Monday, 2=Tuesday, ..., 7=Sunday)
 *
 * @example
 * ```typescript
 * const weekday1 = getWeekDay('2024-01-15'); // 1 (Monday)
 * const weekday2 = getWeekDay('2024-01-14'); // 7 (Sunday)
 *
 * // Using with Temporal.PlainDate
 * const date = Temporal.PlainDate.from('2024-01-16');
 * const weekday3 = getWeekDay(date); // 2 (Tuesday)
 * ```
 */
export function getWeekDay(date: PlainDate | string): WeekDay {
  const plainDate = typeof date === "string" ? Temporal.PlainDate.from(date) : date;

  return plainDate.dayOfWeek as WeekDay;
}

/**
 * Calculates which week number a given date belongs to within its month.
 *
 * The week calculation follows these rules:
 * - Weeks start on Monday (ISO week date system)
 * - If the Monday of the week containing the given date falls in a different month,
 *   the week number is calculated based on that Monday's month
 * - Week numbering starts from 1
 *
 * @param date - The date to calculate the week number for. Can be a Temporal.PlainDate object or an ISO date string (YYYY-MM-DD)
 * @returns An object containing the year, month, and week number that the date belongs to
 *
 * @example
 * ```typescript
 * // For a date in the middle of a month
 * const week1 = getWeekNum('2024-01-15'); // { year: 2024, month: 1, weekNum: 3 }
 *
 * // For a date where the Monday falls in the previous month
 * const week2 = getWeekNum('2024-02-01'); // Might return { year: 2024, month: 1, weekNum: 5 }
 *
 * // Using with Temporal.PlainDate
 * const date = Temporal.PlainDate.from('2024-01-31');
 * const week3 = getWeekNum(date); // { year: 2024, month: 1, weekNum: 5 }
 * ```
 */
export function getWeekNum(date: PlainDate | string): { month: number; year: number; weekNum: number } {
  const plainDate = typeof date === "string" ? Temporal.PlainDate.from(date) : date;

  const dayOfWeek = plainDate.dayOfWeek;
  const daysFromMonday = dayOfWeek - 1;
  const mondayOfWeek = plainDate.subtract({ days: daysFromMonday });

  const targetMonth = mondayOfWeek.month;
  const targetYear = mondayOfWeek.year;

  const firstDayOfMonth = mondayOfWeek.with({ day: 1 });

  const firstDayWeekday = firstDayOfMonth.dayOfWeek;

  const daysToFirstMonday = firstDayWeekday === 1 ? 0 : 8 - firstDayWeekday;
  const firstMondayOfMonth = firstDayOfMonth.add({ days: daysToFirstMonday });

  const daysDiff = mondayOfWeek.since(firstMondayOfMonth).days;

  const weekNum = Math.floor(daysDiff / 7) + 1;

  return { month: targetMonth, year: targetYear, weekNum };
}

/**
 * Finds the next business day after a given date.
 *
 * This function will increment the date by one day repeatedly until it finds
 * a day that qualifies as a business day according to the `isWorkday` function.
 *
 * @param date - The starting date. Can be a Temporal.PlainDate object or an ISO date string (YYYY-MM-DD)
 * @param holidayList - An array of holiday objects to consider when determining business days
 * @returns The next business day as a Temporal.PlainDate object
 *
 * @example
 * ```typescript
 * // Find next workday after Friday
 * const nextWorkday1 = getNextWorkday('2024-01-12'); // 2024-01-15 (Monday)
 *
 * // Find next workday considering holidays
 * const holidays = [{ date: '2024-01-15', recurring: false }];
 * const nextWorkday2 = getNextWorkday('2024-01-12', holidays); // 2024-01-16 (Tuesday)
 *
 * // Using with Temporal.PlainDate
 * const date = Temporal.PlainDate.from('2024-01-31');
 * const nextWorkday3 = getNextWorkday(date); // 2024-02-01 or next available workday
 * ```
 */
export function getNextWorkday(
  date: PlainDate | string,
  holidayList: Holiday[] = [],
  dayOffWeekdays: WeekDay[] = [6, 7],
): PlainDate {
  let currentDate = typeof date === "string" ? Temporal.PlainDate.from(date) : date;

  do {
    currentDate = currentDate.add({ days: 1 });
  } while (!isWorkday(currentDate, holidayList, dayOffWeekdays));

  return currentDate;
}

/**
 * Finds the previous business day before a given date.
 *
 * This function will decrement the date by one day repeatedly until it finds
 * a day that qualifies as a business day according to the `isWorkday` function.
 *
 * @param date - The starting date. Can be a Temporal.PlainDate object or an ISO date string (YYYY-MM-DD)
 * @param holidayList - An array of holiday objects to consider when determining business days
 * @returns The previous business day as a Temporal.PlainDate object
 *
 * @example
 * ```typescript
 * // Find previous workday before Monday
 * const prevWorkday1 = getPreviousWorkday('2024-01-15'); // 2024-01-12 (Friday)
 *
 * // Find previous workday considering holidays
 * const holidays = [{ date: '2024-01-12', recurring: false }];
 * const prevWorkday2 = getPreviousWorkday('2024-01-15', holidays); // 2024-01-11 (Thursday)
 *
 * // Using with Temporal.PlainDate
 * const date = Temporal.PlainDate.from('2024-02-01');
 * const prevWorkday3 = getPreviousWorkday(date); // 2024-01-31 or previous available workday
 * ```
 */
export function getPreviousWorkday(
  date: PlainDate | string,
  holidayList: Holiday[] = [],
  dayOffWeekdays: WeekDay[] = [6, 7],
): PlainDate {
  let currentDate = typeof date === "string" ? Temporal.PlainDate.from(date) : date;

  do {
    currentDate = currentDate.subtract({ days: 1 });
  } while (!isWorkday(currentDate, holidayList, dayOffWeekdays));

  return currentDate;
}
