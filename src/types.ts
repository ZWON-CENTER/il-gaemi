import { Temporal } from "@js-temporal/polyfill";

/**
 * Supported date/time format types for the format function.
 *
 * @example
 * ```typescript
 * // Different format types produce different outputs
 * const date = Temporal.PlainDate.from('2024-01-15');
 *
 * format(date, 'date');     // "2024-01-15"
 * format(date, 'datetime'); // "2024-01-15 00:00:00"
 * format(date, 'iso');      // "2024-01-15"
 * format(date, 'custom', 'YYYY/MM/DD'); // "2024/01/15"
 * ```
 */
export type DateFormatType =
  | "date" // YYYY-MM-DD format
  | "time" // HH:mm:ss format
  | "datetime" // YYYY-MM-DD HH:mm:ss format
  | "iso" // ISO 8601 format
  | "custom"; // User-defined custom format

/**
 * Day of the week type using ISO weekday numbering.
 *
 * Uses the ISO 8601 standard where:
 * - 1 = Monday
 * - 2 = Tuesday
 * - 3 = Wednesday
 * - 4 = Thursday
 * - 5 = Friday
 * - 6 = Saturday
 * - 7 = Sunday
 *
 * @example
 * ```typescript
 * const weekday: WeekDay = getWeekDay('2024-01-15'); // 1 (Monday)
 *
 * // Check if it's a weekend
 * const isWeekend = (day: WeekDay) => day === 6 || day === 7;
 * console.log(isWeekend(weekday)); // false
 *
 * // Custom weekend definition (e.g., Friday-Saturday)
 * const customWeekend: WeekDay[] = [5, 6];
 * ```
 */
export type WeekDay = 1 | 2 | 3 | 4 | 5 | 6 | 7;

/**
 * Holiday information interface for business day calculations.
 *
 * Represents a holiday that can affect business day calculations.
 * Supports both one-time holidays and recurring annual holidays.
 *
 * @example
 * ```typescript
 * // One-time holiday
 * const newYear2024: Holiday = {
 *   date: '2024-01-01',
 *   name: 'New Year\'s Day 2024',
 *   recurring: false
 * };
 *
 * // Recurring annual holiday
 * const christmas: Holiday = {
 *   date: '2024-12-25',
 *   name: 'Christmas Day',
 *   recurring: true  // Will apply to December 25th every year
 * };
 *
 * // Holiday list for business day calculations
 * const holidays: Holiday[] = [
 *   { date: '2024-01-01', name: 'New Year\'s Day', recurring: true },
 *   { date: '2024-07-04', name: 'Independence Day', recurring: true },
 *   { date: '2024-12-25', name: 'Christmas Day', recurring: true },
 *   { date: '2024-11-28', name: 'Special Event', recurring: false }
 * ];
 *
 * const isWorkday = isWorkday('2024-12-25', holidays); // false
 * ```
 */
export interface Holiday {
  /** The holiday date in YYYY-MM-DD format */
  date: string;
  /** The name or description of the holiday */
  name: string;
  /**
   * Whether this holiday recurs annually.
   * When true, the holiday will be recognized every year on the same month and day.
   * When false or undefined, the holiday applies only to the specific year in the date.
   */
  recurring?: boolean;
}

/**
 * Type aliases for Temporal API objects for convenience and consistency.
 *
 * These aliases provide shorter, more convenient names for commonly used
 * Temporal types throughout the library.
 *
 * @example
 * ```typescript
 * // Instead of writing Temporal.ZonedDateTime
 * const zoned: ZonedDateTime = getNow();
 *
 * // Instead of writing Temporal.PlainDate
 * const date: PlainDate = Temporal.PlainDate.from('2024-01-15');
 *
 * // Function parameter types
 * function processDateTime(dt: PlainDateTime): string {
 *   return format(dt, 'datetime');
 * }
 *
 * // Timezone handling
 * const timezone: TimeZone = 'America/New_York';
 * const converted = convertToZonedDateTime(date, timezone);
 * ```
 */

/** Represents a date and time with timezone information */
export type ZonedDateTime = Temporal.ZonedDateTime;

/** Represents a date without time or timezone information */
export type PlainDate = Temporal.PlainDate;

/** Represents a time without date or timezone information */
export type PlainTime = Temporal.PlainTime;

/** Represents a date and time without timezone information */
export type PlainDateTime = Temporal.PlainDateTime;

/**
 * Represents a timezone identifier string.
 *
 * Can be:
 * - IANA timezone names (e.g., 'America/New_York', 'Asia/Seoul', 'Europe/London')
 * - UTC offset strings (e.g., '+09:00', '-05:00')
 * - 'UTC' for Coordinated Universal Time
 */
export type TimeZone = string;
