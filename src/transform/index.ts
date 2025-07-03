import { Temporal } from "@js-temporal/polyfill";
import type { ZonedDateTime, PlainDate, PlainDateTime } from "../types";
import { DEFAULT_TIMEZONE } from "../timezone";

/**
 * Converts a Temporal object to a JavaScript Date object for database storage.
 *
 * This function handles the conversion from various Temporal types to Date objects
 * that can be stored in database columns. It ensures proper timezone handling
 * and maintains the exact moment in time.
 *
 * @param temporal - The Temporal object to convert
 * @returns A JavaScript Date object representing the same moment in time
 *
 * @example
 * ```typescript
 * const zonedDateTime = getNow();
 * const date = temporalToDate(zonedDateTime);
 * console.log(date instanceof Date); // true
 *
 * const plainDate = Temporal.PlainDate.from('2024-01-15');
 * const dateFromPlain = temporalToDate(plainDate);
 * // PlainDate is interpreted as start of day in default timezone (Asia/Seoul)
 *
 * const plainDateTime = Temporal.PlainDateTime.from('2024-01-15T14:30:00');
 * const dateFromPlainDT = temporalToDate(plainDateTime);
 * // PlainDateTime is interpreted in default timezone (Asia/Seoul)
 * ```
 */
export function temporalToDate(temporal: ZonedDateTime | PlainDate | PlainDateTime | null | undefined): Date | null {
  if (!temporal) {
    return null;
  }

  if (temporal instanceof Temporal.ZonedDateTime) {
    return new Date(temporal.epochMilliseconds);
  }

  if (temporal instanceof Temporal.PlainDate) {
    // Convert PlainDate to start of day in default timezone
    const zonedDateTime = temporal.toZonedDateTime({
      timeZone: DEFAULT_TIMEZONE,
      plainTime: Temporal.PlainTime.from("00:00:00"),
    });
    return new Date(zonedDateTime.epochMilliseconds);
  }

  if (temporal instanceof Temporal.PlainDateTime) {
    // Convert PlainDateTime to ZonedDateTime in default timezone
    const zonedDateTime = temporal.toZonedDateTime(DEFAULT_TIMEZONE);
    return new Date(zonedDateTime.epochMilliseconds);
  }

  throw new Error(`Unsupported temporal type: ${typeof temporal}`);
}

/**
 * Converts a JavaScript Date object to a ZonedDateTime in the specified timezone.
 *
 * This function converts Date objects from the database back into ZonedDateTime
 * objects with proper timezone information. The default timezone is Asia/Seoul
 * but can be customized.
 *
 * @param date - The Date object to convert
 * @param timeZone - The target timezone (defaults to Asia/Seoul)
 * @returns A ZonedDateTime object in the specified timezone
 *
 * @example
 * ```typescript
 * const date = new Date('2024-01-15T05:30:00.000Z');
 * const zoned = dateToZonedDateTime(date);
 * console.log(zoned.timeZoneId); // "Asia/Seoul"
 * console.log(zoned.hour); // 14 (5:30 UTC = 14:30 KST)
 *
 * // Convert to different timezone
 * const nyTime = dateToZonedDateTime(date, 'America/New_York');
 * console.log(nyTime.hour); // 0 (5:30 UTC = 00:30 EST)
 * ```
 */
export function dateToZonedDateTime(
  date: Date | null | undefined,
  timeZone: string = DEFAULT_TIMEZONE,
): ZonedDateTime | null {
  if (!date) {
    return null;
  }

  return Temporal.Instant.fromEpochMilliseconds(date.getTime()).toZonedDateTimeISO(timeZone);
}

/**
 * Converts a JavaScript Date object to a PlainDate.
 *
 * This function extracts the date components from a Date object and creates
 * a PlainDate. The conversion uses the default timezone to determine the
 * local date representation.
 *
 * @param date - The Date object to convert
 * @param timeZone - The timezone to use for date calculation (defaults to Asia/Seoul)
 * @returns A PlainDate object representing the date in the specified timezone
 *
 * @example
 * ```typescript
 * const date = new Date('2024-01-15T05:30:00.000Z');
 * const plainDate = dateToPlainDate(date);
 * console.log(plainDate.toString()); // "2024-01-15" (in Asia/Seoul timezone)
 *
 * // Same instant, different timezone
 * const utcPlainDate = dateToPlainDate(date, 'UTC');
 * console.log(utcPlainDate.toString()); // "2024-01-15" (in UTC)
 * ```
 */
export function dateToPlainDate(date: Date | null | undefined, timeZone: string = DEFAULT_TIMEZONE): PlainDate | null {
  if (!date) {
    return null;
  }

  const zonedDateTime = dateToZonedDateTime(date, timeZone);
  return zonedDateTime?.toPlainDate() || null;
}

/**
 * Converts a JavaScript Date object to a PlainDateTime.
 *
 * This function extracts the date and time components from a Date object
 * and creates a PlainDateTime. The conversion uses the specified timezone
 * to determine the local representation.
 *
 * @param date - The Date object to convert
 * @param timeZone - The timezone to use for calculation (defaults to Asia/Seoul)
 * @returns A PlainDateTime object representing the date and time in the specified timezone
 *
 * @example
 * ```typescript
 * const date = new Date('2024-01-15T05:30:00.000Z');
 * const plainDateTime = dateToPlainDateTime(date);
 * console.log(plainDateTime.toString()); // "2024-01-15T14:30:00" (in Asia/Seoul)
 *
 * // Same instant, different timezone
 * const utcPlainDateTime = dateToPlainDateTime(date, 'UTC');
 * console.log(utcPlainDateTime.toString()); // "2024-01-15T05:30:00" (in UTC)
 * ```
 */
export function dateToPlainDateTime(
  date: Date | null | undefined,
  timeZone: string = DEFAULT_TIMEZONE,
): PlainDateTime | null {
  if (!date) {
    return null;
  }

  const zonedDateTime = dateToZonedDateTime(date, timeZone);
  return zonedDateTime?.toPlainDateTime() || null;
}
