import { Temporal } from "@js-temporal/polyfill";
import type { DateFormatType, ZonedDateTime, PlainDate, PlainDateTime } from "../types";
import { UnsupportedFormatTypeError, MissingParameterError, IncompatibleOperationError } from "../errors";
import { parseFlexibleDateString } from "../utils/dateParser";

/**
 * Predefined format patterns for common date/time formatting needs.
 */
const FORMAT_PATTERNS = {
  date: "YYYY-MM-DD",
  time: "HH:mm:ss",
  datetime: "YYYY-MM-DD HH:mm:ss",
  iso: "ISO",
} as const;

/**
 * Formats a Temporal date/time object into a string representation.
 *
 * This function provides flexible formatting options for various Temporal types,
 * supporting predefined formats (date, time, datetime, iso) as well as custom formatting.
 *
 * @param date - The date/time to format. Can be a ZonedDateTime, PlainDate, PlainDateTime, or an ISO string
 * @param type - The format type to use. Defaults to "datetime"
 * @param formatString - Custom format string (required when type is "custom"). Supports tokens like YYYY, MM, DD, HH, mm, ss
 * @returns The formatted date/time string
 *
 * @throws {Error} When PlainDate is used with "time" format type
 * @throws {Error} When formatString is not provided for "custom" type
 * @throws {Error} When an unsupported format type is provided
 *
 * @example
 * ```typescript
 * // Basic formatting
 * const date = Temporal.PlainDate.from('2024-01-15');
 * const formatted1 = format(date, 'date'); // "2024-01-15"
 * const formatted2 = format(date, 'datetime'); // "2024-01-15 00:00:00"
 *
 * // With ZonedDateTime
 * const zonedDate = Temporal.Now.zonedDateTimeISO('Asia/Seoul');
 * const formatted3 = format(zonedDate, 'iso'); // ISO 8601 format
 *
 * // Custom formatting
 * const formatted4 = format(date, 'custom', 'YYYY/MM/DD'); // "2024/01/15"
 * const formatted5 = format(zonedDate, 'custom', 'YYYY-MM-DD HH:mm'); // "2024-01-15 14:30"
 *
 * // From string input
 * const formatted6 = format('2024-01-15', 'date'); // "2024-01-15"
 * ```
 */
export function format(
  date: ZonedDateTime | PlainDate | PlainDateTime | string,
  type: DateFormatType = "datetime",
  formatString?: string,
): string {
  let temporalDate: ZonedDateTime | PlainDate | PlainDateTime;

  if (typeof date === "string") {
    temporalDate = parseFlexibleDateString(date);
  } else {
    temporalDate = date;
  }

  switch (type) {
    case "date":
      if (temporalDate instanceof Temporal.PlainDate) {
        return temporalDate.toString();
      }
      return temporalDate.toPlainDate().toString();

    case "time":
      if (temporalDate instanceof Temporal.PlainDate) {
        throw new IncompatibleOperationError("formatting as time", "PlainDate does not contain time information");
      }
      return temporalDate.toPlainTime().toString();

    case "datetime":
      if (temporalDate instanceof Temporal.PlainDate) {
        return `${temporalDate.toString()} 00:00:00`;
      }
      const plainDateTime =
        temporalDate instanceof Temporal.ZonedDateTime ? temporalDate.toPlainDateTime() : temporalDate;
      return plainDateTime.toString().replace("T", " ");

    case "iso":
      if (temporalDate instanceof Temporal.ZonedDateTime) {
        return temporalDate.toString();
      }
      if (temporalDate instanceof Temporal.PlainDateTime) {
        return temporalDate.toString();
      }
      return temporalDate.toString();

    case "custom":
      if (!formatString) {
        throw new MissingParameterError("formatString");
      }
      return formatCustom(temporalDate, formatString);

    default:
      throw new UnsupportedFormatTypeError(type, ["date", "time", "datetime", "iso", "custom"]);
  }
}

/**
 * Formats a Temporal object using a custom format string with token replacement.
 *
 * Supported format tokens:
 * - YYYY: 4-digit year (e.g., 2024)
 * - YY: 2-digit year (e.g., 24)
 * - MM: 2-digit month with leading zero (e.g., 01, 12)
 * - M: Month without leading zero (e.g., 1, 12)
 * - DD: 2-digit day with leading zero (e.g., 01, 31)
 * - D: Day without leading zero (e.g., 1, 31)
 * - HH: 2-digit hour with leading zero (e.g., 00, 23)
 * - H: Hour without leading zero (e.g., 0, 23)
 * - mm: 2-digit minute with leading zero (e.g., 00, 59)
 * - m: Minute without leading zero (e.g., 0, 59)
 * - ss: 2-digit second with leading zero (e.g., 00, 59)
 * - s: Second without leading zero (e.g., 0, 59)
 *
 * @param date - The Temporal object to format
 * @param formatString - The format string containing tokens to replace
 * @returns The formatted string with tokens replaced by actual values
 *
 * @example
 * ```typescript
 * const date = Temporal.PlainDate.from('2024-01-15');
 * const datetime = Temporal.PlainDateTime.from('2024-01-15T14:30:45');
 *
 * formatCustom(date, 'YYYY/MM/DD'); // "2024/01/15"
 * formatCustom(date, 'M/D/YY'); // "1/15/24"
 * formatCustom(datetime, 'YYYY-MM-DD HH:mm:ss'); // "2024-01-15 14:30:45"
 * formatCustom(datetime, 'H시 m분'); // "14시 30분"
 * ```
 */
function formatCustom(date: ZonedDateTime | PlainDate | PlainDateTime, formatString: string): string {
  let result = formatString;

  const plainDate = date instanceof Temporal.PlainDate ? date : date.toPlainDate();

  const plainTime = date instanceof Temporal.PlainDate ? null : date.toPlainTime();

  result = result.replace(/YYYY/g, plainDate.year.toString().padStart(4, "0"));
  result = result.replace(/YY/g, (plainDate.year % 100).toString().padStart(2, "0"));

  result = result.replace(/MM/g, plainDate.month.toString().padStart(2, "0"));
  result = result.replace(/M/g, plainDate.month.toString());

  result = result.replace(/DD/g, plainDate.day.toString().padStart(2, "0"));
  result = result.replace(/D/g, plainDate.day.toString());

  if (plainTime) {
    result = result.replace(/HH/g, plainTime.hour.toString().padStart(2, "0"));
    result = result.replace(/H/g, plainTime.hour.toString());

    result = result.replace(/mm/g, plainTime.minute.toString().padStart(2, "0"));
    result = result.replace(/m/g, plainTime.minute.toString());

    result = result.replace(/ss/g, plainTime.second.toString().padStart(2, "0"));
    result = result.replace(/s/g, plainTime.second.toString());
  }

  return result;
}

/**
 * Formats a date in Korean style (e.g., "2024년 1월 15일").
 *
 * This is a convenience function that uses the custom format with Korean suffixes.
 *
 * @param date - The date to format. Can be a ZonedDateTime, PlainDate, PlainDateTime, or an ISO string
 * @returns A Korean-formatted date string
 *
 * @example
 * ```typescript
 * const date = Temporal.PlainDate.from('2024-01-15');
 * const korean = formatKorean(date); // "2024년 1월 15일"
 *
 * const datetime = Temporal.ZonedDateTime.from('2024-01-15T14:30:00+09:00[Asia/Seoul]');
 * const korean2 = formatKorean(datetime); // "2024년 1월 15일"
 *
 * // From string
 * const korean3 = formatKorean('2024-12-25'); // "2024년 12월 25일"
 * ```
 */
export function formatKorean(date: ZonedDateTime | PlainDate | PlainDateTime | string): string {
  return format(date, "custom", "YYYY년 M월 D일");
}

/**
 * Formats a date as a relative time expression (e.g., "3 days ago", "2 hours later").
 *
 * This function calculates the time difference between the given date and a base date,
 * then returns a human-readable relative time string in Korean.
 *
 * @param date - The target date to compare. Can be a ZonedDateTime, PlainDate, PlainDateTime, or an ISO string
 * @param baseDate - The reference date for comparison. Defaults to current time in Asia/Seoul timezone
 * @returns A Korean relative time string
 *
 * @example
 * ```typescript
 * const now = Temporal.Now.zonedDateTimeISO('Asia/Seoul');
 * const yesterday = now.subtract({ days: 1 });
 * const tomorrow = now.add({ days: 1 });
 * const twoHoursLater = now.add({ hours: 2 });
 * const fiveMinutesAgo = now.subtract({ minutes: 5 });
 *
 * formatRelative(yesterday); // "1일 전"
 * formatRelative(tomorrow); // "1일 후"
 * formatRelative(twoHoursLater); // "2시간 후"
 * formatRelative(fiveMinutesAgo); // "5분 전"
 *
 * // With custom base date
 * const baseDate = Temporal.ZonedDateTime.from('2024-01-15T12:00:00+09:00[Asia/Seoul]');
 * const targetDate = '2024-01-16T12:00:00+09:00[Asia/Seoul]';
 * formatRelative(targetDate, baseDate); // "1일 후"
 *
 * // Very recent times
 * const justNow = now.subtract({ seconds: 30 });
 * formatRelative(justNow); // "방금 전"
 * ```
 */
export function formatRelative(
  date: ZonedDateTime | PlainDate | PlainDateTime | string,
  baseDate?: ZonedDateTime,
): string {
  const targetDate =
    typeof date === "string"
      ? (() => {
          const parsed = parseFlexibleDateString(date);
          return parsed instanceof Temporal.ZonedDateTime
            ? parsed
            : parsed instanceof Temporal.PlainDateTime
            ? parsed.toZonedDateTime("Asia/Seoul")
            : parsed.toPlainDateTime(Temporal.PlainTime.from("00:00:00")).toZonedDateTime("Asia/Seoul");
        })()
      : date instanceof Temporal.ZonedDateTime
      ? date
      : date instanceof Temporal.PlainDateTime
      ? date.toZonedDateTime("Asia/Seoul")
      : date.toPlainDateTime(Temporal.PlainTime.from("00:00:00")).toZonedDateTime("Asia/Seoul");

  const base = baseDate || Temporal.Now.zonedDateTimeISO("Asia/Seoul");

  const duration = targetDate.since(base, { largestUnit: "day" });
  const days = duration.days;
  const hours = duration.hours;
  const minutes = duration.minutes;

  if (Math.abs(days) >= 1) {
    return days > 0 ? `${days}일 후` : `${Math.abs(days)}일 전`;
  }

  if (Math.abs(hours) >= 1) {
    return hours > 0 ? `${hours}시간 후` : `${Math.abs(hours)}시간 전`;
  }

  if (Math.abs(minutes) >= 1) {
    return minutes > 0 ? `${minutes}분 후` : `${Math.abs(minutes)}분 전`;
  }

  return "방금 전";
}
