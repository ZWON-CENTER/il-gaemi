import { Temporal } from "@js-temporal/polyfill";
import type { ZonedDateTime } from "../types";
import { InvalidDateError, InvalidDateFormatError } from "../errors";

/**
 * Default timezone for the library (Korea Standard Time).
 *
 * This constant is used as the default timezone throughout the library
 * when no specific timezone is provided.
 */
export const DEFAULT_TIMEZONE = "Asia/Seoul";

/**
 * Returns the current date and time in Asia/Seoul timezone.
 *
 * This is a convenience function that provides the current moment
 * in Korean Standard Time (KST).
 *
 * @returns The current ZonedDateTime in Asia/Seoul timezone
 *
 * @example
 * ```typescript
 * const now = getNow();
 * console.log(now.toString()); // "2024-01-15T14:30:00+09:00[Asia/Seoul]"
 *
 * // Access individual components
 * console.log(now.year); // 2024
 * console.log(now.month); // 1
 * console.log(now.day); // 15
 * console.log(now.hour); // 14
 * ```
 */
export function getNow(): ZonedDateTime {
  return Temporal.Now.zonedDateTimeISO(DEFAULT_TIMEZONE);
}

/**
 * Creates a date in the default timezone (Asia/Seoul).
 *
 * @param year - The year
 * @param month - The month (1-12)
 * @param day - The day (1-31)
 * @returns A ZonedDateTime object in the default timezone
 *
 * @example
 * ```typescript
 * const date = getDate(2024, 1, 15);
 * console.log(date.toString()); // "2024-01-15T00:00:00+09:00[Asia/Seoul]"
 * ```
 */
export function getDate(year: number, month: number, day: number): ZonedDateTime {
  return Temporal.PlainDate.from({ year, month, day }).toZonedDateTime(DEFAULT_TIMEZONE);
}

/**
 * Creates a date and time in the default timezone (Asia/Seoul).
 *
 * @param year - The year
 * @param month - The month (1-12)
 * @param day - The day (1-31)
 * @param hour - The hour (0-23)
 * @param minute - The minute (0-59)
 * @param second - The second (0-59, optional)
 * @param millisecond - The millisecond (0-999, optional)
 * @param microsecond - The microsecond (0-999, optional)
 * @param nanosecond - The nanosecond (0-999, optional)
 * @returns A ZonedDateTime object in the default timezone
 *
 * @example
 * ```typescript
 * const dateTime = getDateTime(2024, 1, 15, 14, 30, 45, 123, 456, 789);
 * console.log(dateTime.toString()); // "2024-01-15T14:30:45.123456789+09:00[Asia/Seoul]"
 * ```
 */
export function getDateTime(
  year: number,
  month: number,
  day: number,
  hour: number,
  minute: number,
  second?: number,
  millisecond?: number,
  microsecond?: number,
  nanosecond?: number,
): ZonedDateTime {
  return Temporal.PlainDateTime.from({
    year,
    month,
    day,
    hour,
    minute,
    second,
    millisecond,
    microsecond,
    nanosecond,
  }).toZonedDateTime(DEFAULT_TIMEZONE);
}

/**
 * Creates a date and time in UTC timezone.
 *
 * @param year - The year
 * @param month - The month (1-12)
 * @param day - The day (1-31)
 * @param hour - The hour (0-23)
 * @param minute - The minute (0-59)
 * @param second - The second (0-59, optional)
 * @param millisecond - The millisecond (0-999, optional)
 * @param microsecond - The microsecond (0-999, optional)
 * @param nanosecond - The nanosecond (0-999, optional)
 * @returns A ZonedDateTime object in UTC timezone
 *
 * @example
 * ```typescript
 * const utcDateTime = getDateTimeUTC(2024, 1, 15, 14, 30, 45);
 * console.log(utcDateTime.toString()); // "2024-01-15T14:30:45+00:00[UTC]"
 * ```
 */
export function getDateTimeUTC(
  year: number,
  month: number,
  day: number,
  hour: number,
  minute: number,
  second?: number,
  millisecond?: number,
  microsecond?: number,
  nanosecond?: number,
): ZonedDateTime {
  return Temporal.PlainDateTime.from({
    year,
    month,
    day,
    hour,
    minute,
    second,
    millisecond,
    microsecond,
    nanosecond,
  }).toZonedDateTime("UTC");
}

/**
 * Creates a date in UTC timezone.
 *
 * @param year - The year
 * @param month - The month (1-12)
 * @param day - The day (1-31)
 * @returns A ZonedDateTime object in UTC timezone
 *
 * @example
 * ```typescript
 * const utcDate = getDateUTC(2024, 1, 15);
 * console.log(utcDate.toString()); // "2024-01-15T00:00:00+00:00[UTC]"
 * ```
 */
export function getDateUTC(year: number, month: number, day: number): ZonedDateTime {
  return Temporal.PlainDate.from({ year, month, day }).toZonedDateTime("UTC");
}

/**
 * Creates a PlainTime object with time information.
 *
 * @param hour - The hour (0-23)
 * @param minute - The minute (0-59)
 * @param second - The second (0-59, optional)
 * @param millisecond - The millisecond (0-999, optional)
 * @param microsecond - The microsecond (0-999, optional)
 * @param nanosecond - The nanosecond (0-999, optional)
 * @returns A PlainTime object
 *
 * @example
 * ```typescript
 * const time = getTime(14, 30, 45, 123, 456, 789);
 * console.log(time.toString()); // "14:30:45.123456789"
 * ```
 */
export function getTime(
  hour: number,
  minute: number,
  second?: number,
  millisecond?: number,
  microsecond?: number,
  nanosecond?: number,
): Temporal.PlainTime {
  return Temporal.PlainTime.from({ hour, minute, second, millisecond, microsecond, nanosecond });
}

/**
 * Returns the current date and time in UTC timezone.
 *
 * This function provides the current moment in Coordinated Universal Time (UTC),
 * which is useful for storing timestamps in a timezone-neutral format.
 *
 * @returns The current ZonedDateTime in UTC timezone
 *
 * @example
 * ```typescript
 * const nowUTC = getNowUTC();
 * console.log(nowUTC.toString()); // "2024-01-15T05:30:00+00:00[UTC]"
 *
 * // Compare with local time
 * const nowLocal = getNow();
 * console.log(nowLocal.toString()); // "2024-01-15T14:30:00+09:00[Asia/Seoul]"
 *
 * // Both represent the same instant
 * console.log(nowUTC.epochMilliseconds === nowLocal.epochMilliseconds); // true
 * ```
 */
export function getNowUTC(): ZonedDateTime {
  return Temporal.Now.zonedDateTimeISO("UTC");
}

/**
 * Converts a date/time to a ZonedDateTime in the specified timezone.
 *
 * This function handles various input types and converts them to a ZonedDateTime
 * with the specified timezone. It's particularly useful for timezone conversions
 * and ensuring consistent timezone handling throughout an application.
 *
 * @param date - The date/time to convert. Can be a ZonedDateTime, PlainDateTime, or an ISO string
 * @param timeZone - The target timezone. Defaults to Asia/Seoul
 * @returns A ZonedDateTime in the specified timezone
 *
 * @example
 * ```typescript
 * // From string (date only) - assumes start of day in target timezone
 * const zoned1 = convertToZonedDateTime('2024-01-15');
 * console.log(zoned1.toString()); // "2024-01-15T00:00:00+09:00[Asia/Seoul]"
 *
 * // From ISO datetime string - converts to target timezone
 * const zoned2 = convertToZonedDateTime('2024-01-15T12:00:00Z', 'America/New_York');
 * console.log(zoned2.toString()); // "2024-01-15T07:00:00-05:00[America/New_York]"
 *
 * // From PlainDateTime - interprets in target timezone
 * const plainDT = Temporal.PlainDateTime.from('2024-01-15T12:00:00');
 * const zoned3 = convertToZonedDateTime(plainDT, 'Europe/London');
 * console.log(zoned3.toString()); // "2024-01-15T12:00:00+00:00[Europe/London]"
 *
 * // From existing ZonedDateTime - converts to new timezone
 * const existing = Temporal.Now.zonedDateTimeISO('UTC');
 * const converted = convertToZonedDateTime(existing, 'Asia/Tokyo');
 * // Same instant, different timezone representation
 * ```
 */
export function convertToZonedDateTime(
  date: ZonedDateTime | Temporal.PlainDateTime | string,
  timeZone: string = DEFAULT_TIMEZONE,
): ZonedDateTime {
  if (typeof date === "string") {
    if (date.includes("T")) {
      return Temporal.Instant.from(date).toZonedDateTimeISO(timeZone);
    }
    const plainDate = Temporal.PlainDate.from(date);
    const plainDateTime = plainDate.toPlainDateTime(Temporal.PlainTime.from("00:00:00"));
    return plainDateTime.toZonedDateTime(timeZone);
  }

  if (date instanceof Temporal.PlainDateTime) {
    return date.toZonedDateTime(timeZone);
  }

  return date.withTimeZone(timeZone);
}

/**
 * Converts a ZonedDateTime to UTC timezone.
 *
 * This function takes a ZonedDateTime in any timezone and returns
 * the equivalent moment in UTC. The instant in time remains the same,
 * only the timezone representation changes.
 *
 * @param zonedDateTime - The ZonedDateTime to convert to UTC
 * @returns The same instant represented in UTC timezone
 *
 * @example
 * ```typescript
 * // Convert Korean time to UTC
 * const kst = Temporal.ZonedDateTime.from('2024-01-15T14:30:00+09:00[Asia/Seoul]');
 * const utc = toUTC(kst);
 * console.log(utc.toString()); // "2024-01-15T05:30:00+00:00[UTC]"
 *
 * // The epoch milliseconds are identical (same instant)
 * console.log(kst.epochMilliseconds === utc.epochMilliseconds); // true
 *
 * // Different timezone representations
 * console.log(kst.timeZone.id); // "Asia/Seoul"
 * console.log(utc.timeZone.id); // "UTC"
 * ```
 */
export function toUTC(zonedDateTime: ZonedDateTime): ZonedDateTime {
  return zonedDateTime.withTimeZone("UTC");
}

/**
 * Converts a UTC ZonedDateTime to a specified timezone.
 *
 * This function takes a ZonedDateTime in UTC and converts it to
 * the specified timezone. This is the inverse operation of `toUTC`.
 *
 * @param utcDateTime - The UTC ZonedDateTime to convert
 * @param timeZone - The target timezone. Defaults to Asia/Seoul
 * @returns The same instant represented in the target timezone
 *
 * @example
 * ```typescript
 * // Start with UTC time
 * const utc = Temporal.ZonedDateTime.from('2024-01-15T05:30:00+00:00[UTC]');
 *
 * // Convert to different timezones
 * const kst = fromUTC(utc); // Default to Asia/Seoul
 * console.log(kst.toString()); // "2024-01-15T14:30:00+09:00[Asia/Seoul]"
 *
 * const est = fromUTC(utc, 'America/New_York');
 * console.log(est.toString()); // "2024-01-15T00:30:00-05:00[America/New_York]"
 *
 * const jst = fromUTC(utc, 'Asia/Tokyo');
 * console.log(jst.toString()); // "2024-01-15T14:30:00+09:00[Asia/Tokyo]"
 *
 * // All represent the same instant
 * console.log(utc.epochMilliseconds === kst.epochMilliseconds); // true
 * ```
 */
export function fromUTC(utcDateTime: ZonedDateTime, timeZone: string = DEFAULT_TIMEZONE): ZonedDateTime {
  return utcDateTime.withTimeZone(timeZone);
}

/**
 * Calculates the time difference between two timezones in hours.
 *
 * This function determines how many hours ahead or behind the target timezone
 * is compared to the source timezone. Positive values indicate the target
 * is ahead, negative values indicate it's behind.
 *
 * @param fromTimeZone - The source timezone to compare from
 * @param toTimeZone - The target timezone to compare to
 * @param referenceDate - The reference date for calculation. Defaults to current time in Asia/Seoul. This is important for timezones with daylight saving time
 * @returns The time difference in hours (positive if target is ahead, negative if behind)
 *
 * @example
 * ```typescript
 * // Calculate offset from UTC to different timezones
 * const utcToKst = getTimeZoneOffset('UTC', 'Asia/Seoul');
 * console.log(utcToKst); // 9 (KST is UTC+9)
 *
 * const utcToEst = getTimeZoneOffset('UTC', 'America/New_York');
 * console.log(utcToEst); // -5 (EST is UTC-5) or -4 (EDT is UTC-4) depending on date
 *
 * // Calculate offset between non-UTC timezones
 * const kstToJst = getTimeZoneOffset('Asia/Seoul', 'Asia/Tokyo');
 * console.log(kstToJst); // 0 (both are UTC+9)
 *
 * const kstToEst = getTimeZoneOffset('Asia/Seoul', 'America/New_York');
 * console.log(kstToEst); // -14 (or -13 during EDT)
 *
 * // With specific reference date (useful for historical calculations)
 * const summerDate = Temporal.ZonedDateTime.from('2024-07-15T12:00:00+09:00[Asia/Seoul]');
 * const summerOffset = getTimeZoneOffset('UTC', 'America/New_York', summerDate);
 * console.log(summerOffset); // -4 (EDT in summer)
 *
 * const winterDate = Temporal.ZonedDateTime.from('2024-01-15T12:00:00+09:00[Asia/Seoul]');
 * const winterOffset = getTimeZoneOffset('UTC', 'America/New_York', winterDate);
 * console.log(winterOffset); // -5 (EST in winter)
 * ```
 */
export function getTimeZoneOffset(fromTimeZone: string, toTimeZone: string, referenceDate?: ZonedDateTime): number {
  const baseDate = referenceDate || getNow();
  const fromZoned = baseDate.withTimeZone(fromTimeZone);
  const toZoned = baseDate.withTimeZone(toTimeZone);

  const fromOffset = fromZoned.offsetNanoseconds;
  const toOffset = toZoned.offsetNanoseconds;

  return (toOffset - fromOffset) / (1000 * 1000 * 1000 * 60 * 60); // 나노초를 시간으로 변환
}
