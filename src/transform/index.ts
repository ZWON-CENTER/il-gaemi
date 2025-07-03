import { Temporal } from "@js-temporal/polyfill";
import type { ZonedDateTime, PlainDate, PlainDateTime } from "../types";
import { DEFAULT_TIMEZONE } from "../timezone";

/**
 * 📚 **DATABASE STORAGE RECOMMENDATIONS**
 *
 * When storing Temporal data in databases, consider these patterns:
 *
 * **BEST PRACTICE: Two-field approach for ZonedDateTime**
 * ```sql
 * CREATE TABLE events (
 *   id SERIAL PRIMARY KEY,
 *   event_time_utc TIMESTAMP NOT NULL,  -- Always UTC
 *   event_timezone VARCHAR(50) NOT NULL  -- e.g., 'Asia/Seoul'
 * );
 * ```
 *
 * **GOOD: Single field with Instant/ZonedDateTime**
 * ```typescript
 * // Store Instant or ZonedDateTime.epochMilliseconds
 * const instant = Temporal.Now.instant();
 * const date = temporalToDate(instant);  // No data loss
 * ```
 *
 * **CAUTION: Single field with Plain types**
 * ```typescript
 * // Requires timezone assumption - document this clearly!
 * const plainDate = Temporal.PlainDate.from('2024-01-15');
 * const date = temporalToDate(plainDate);  // Assumes Asia/Seoul
 * ```
 *
 * **AVOID: Storing timezone-less data without clear rules**
 * - Always document which timezone Plain types assume
 * - Consider using explicit functions like plainDateToDate() instead
 */

/**
 * Converts a Temporal object to a JavaScript Date object for database storage.
 *
 * This function handles the conversion from various Temporal types to Date objects
 * that can be stored in database columns. It ensures proper timezone handling
 * and maintains the exact moment in time.
 *
 * ⚠️ **IMPORTANT TIMEZONE CONSIDERATIONS:**
 * - `Temporal.Instant` and `Temporal.ZonedDateTime`: No data loss (recommended)
 * - `Temporal.PlainDateTime` and `Temporal.PlainDate`: **Timezone assumption required**
 *   - These are interpreted in the DEFAULT_TIMEZONE (Asia/Seoul)
 *   - This is an arbitrary decision that may not match your intent
 *   - Consider using ZonedDateTime instead for explicit timezone handling
 *
 * @param temporal - The Temporal object to convert
 * @returns A JavaScript Date object representing the same moment in time
 *
 * @example
 * ```typescript
 * // ✅ Recommended: No data loss
 * const instant = Temporal.Now.instant();
 * const zonedDateTime = getNow();
 * const dateFromInstant = temporalToDate(instant);
 * const dateFromZoned = temporalToDate(zonedDateTime);
 *
 * // ⚠️ Timezone assumption: Interpreted as Asia/Seoul
 * const plainDate = Temporal.PlainDate.from('2024-01-15');
 * const dateFromPlain = temporalToDate(plainDate);
 * // This assumes 2024-01-15 00:00:00 in Asia/Seoul timezone!
 *
 * const plainDateTime = Temporal.PlainDateTime.from('2024-01-15T14:30:00');
 * const dateFromPlainDT = temporalToDate(plainDateTime);
 * // This assumes the time is in Asia/Seoul timezone!
 * ```
 */
export function temporalToDate(
  temporal: Temporal.Instant | ZonedDateTime | PlainDate | PlainDateTime | null | undefined,
): Date | null {
  if (!temporal) {
    return null;
  }

  if (temporal instanceof Temporal.Instant) {
    return new Date(temporal.epochMilliseconds);
  }

  if (temporal instanceof Temporal.ZonedDateTime) {
    return new Date(temporal.epochMilliseconds);
  }

  if (temporal instanceof Temporal.PlainDate) {
    const zonedDateTime = temporal.toZonedDateTime({
      timeZone: DEFAULT_TIMEZONE,
      plainTime: Temporal.PlainTime.from("00:00:00"),
    });
    return new Date(zonedDateTime.epochMilliseconds);
  }

  if (temporal instanceof Temporal.PlainDateTime) {
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

/**
 * 🚨 **SAFER ALTERNATIVES TO temporalToDate** 🚨
 *
 * These functions require explicit timezone specification for Plain types,
 * avoiding the implicit timezone assumption in temporalToDate.
 */

/**
 * Safely converts PlainDate to Date with explicit timezone.
 *
 * @param plainDate - The PlainDate to convert
 * @param timeZone - The timezone to interpret the date in
 * @param timeOfDay - The time of day (defaults to start of day)
 * @returns Date object representing the specified moment
 *
 * @example
 * ```typescript
 * const plainDate = Temporal.PlainDate.from('2024-01-15');
 *
 * // Explicit timezone - safer than temporalToDate
 * const seoulDate = plainDateToDate(plainDate, 'Asia/Seoul');
 * const nyDate = plainDateToDate(plainDate, 'America/New_York');
 *
 * // With specific time
 * const noonDate = plainDateToDate(
 *   plainDate,
 *   'Asia/Seoul',
 *   Temporal.PlainTime.from('12:00:00')
 * );
 * ```
 */
export function plainDateToDate(
  plainDate: PlainDate,
  timeZone: string,
  timeOfDay: Temporal.PlainTime = Temporal.PlainTime.from("00:00:00"),
): Date {
  const zonedDateTime = plainDate.toZonedDateTime({
    timeZone,
    plainTime: timeOfDay,
  });
  return new Date(zonedDateTime.epochMilliseconds);
}

/**
 * Safely converts PlainDateTime to Date with explicit timezone.
 *
 * @param plainDateTime - The PlainDateTime to convert
 * @param timeZone - The timezone to interpret the datetime in
 * @returns Date object representing the specified moment
 *
 * @example
 * ```typescript
 * const plainDateTime = Temporal.PlainDateTime.from('2024-01-15T14:30:00');
 *
 * // Explicit timezone - safer than temporalToDate
 * const seoulDate = plainDateTimeToDate(plainDateTime, 'Asia/Seoul');
 * const utcDate = plainDateTimeToDate(plainDateTime, 'UTC');
 *
 * // These could represent very different moments in time!
 * console.log(seoulDate.getTime() !== utcDate.getTime()); // true
 * ```
 */
export function plainDateTimeToDate(plainDateTime: PlainDateTime, timeZone: string): Date {
  const zonedDateTime = plainDateTime.toZonedDateTime(timeZone);
  return new Date(zonedDateTime.epochMilliseconds);
}
