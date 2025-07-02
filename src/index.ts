/**
 * @fileoverview A comprehensive date and time utility library built on top of the Temporal API.
 *
 * This library provides powerful date/time manipulation, formatting, timezone handling,
 * and business day calculations with a focus on Korean localization and international support.
 *
 * ## Features
 *
 * - **Business Day Calculations**: Determine workdays, skip holidays and weekends
 * - **Flexible Date Formatting**: Support for various output formats including Korean style
 * - **Timezone Management**: Convert between timezones with ease
 * - **Temporal API Integration**: Built on the modern Temporal API for precise date/time handling
 * - **Type Safety**: Full TypeScript support with comprehensive type definitions
 *
 * ## Quick Start
 *
 * ```typescript
 * import { isWorkday, format, getNow, getNextWorkday } from 'zwon-date-function';
 *
 * // Check if today is a business day
 * const today = getNow();
 * console.log(isWorkday(today)); // true/false
 *
 * // Format dates in different styles
 * console.log(format(today, 'date')); // "2024-01-15"
 * console.log(format(today, 'korean')); // "2024년 1월 15일"
 *
 * // Find the next business day
 * const nextWorkday = getNextWorkday(today);
 * console.log(format(nextWorkday, 'date')); // Next business day
 *
 * // Work with timezones
 * const utcTime = getNowUTC();
 * const koreanTime = convertToZonedDateTime(utcTime, 'Asia/Seoul');
 * ```
 *
 * ## Module Organization
 *
 * The library is organized into several modules:
 *
 * - **Date Module**: Business day calculations and week number utilities
 * - **Format Module**: Date/time formatting with multiple output styles
 * - **Timezone Module**: Timezone conversion and management utilities
 * - **Types Module**: TypeScript type definitions and interfaces
 *
 * @example
 * ```typescript
 * // Import specific functions
 * import { isWorkday, getWeekDay } from 'zwon-date-function';
 *
 * // Import everything
 * import * as DateUtils from 'zwon-date-function';
 *
 * // Import types
 * import type { Holiday, WeekDay, DateFormatType } from 'zwon-date-function';
 * ```
 */

// Type definitions - Export all types for external usage
export * from "./types";

// Date calculation functions - Business day logic and week calculations
export { isWorkday, getWeekDay, getWeekNum, getNextWorkday, getPreviousWorkday } from "./date";

// Timezone handling functions - Convert between timezones and get current times
export {
  DEFAULT_TIMEZONE,
  getNow,
  getNowUTC,
  convertToZonedDateTime,
  toUTC,
  fromUTC,
  getTimeZoneOffset,
} from "./timezone";

// Formatting functions - Convert dates to various string representations
export { format, formatKorean, formatRelative } from "./format";

// Error classes - Custom error types for better error handling
export {
  DateError,
  InvalidDateFormatError,
  InvalidDateError,
  UnsupportedFormatTypeError,
  MissingParameterError,
  IncompatibleOperationError,
} from "./errors";

// Re-export Temporal polyfill for convenience
// This allows users to access Temporal directly without additional imports
export { Temporal } from "@js-temporal/polyfill";
