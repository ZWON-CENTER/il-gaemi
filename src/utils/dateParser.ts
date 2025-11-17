import { Temporal } from "@js-temporal/polyfill";
import type { PlainDate, PlainDateTime, ZonedDateTime } from "../types";
import { InvalidDateError, InvalidDateFormatError } from "../errors";

export type ParsedFlexibleDate = PlainDate | PlainDateTime | ZonedDateTime;

/**
 * Parses various date string formats and converts them to Temporal objects.
 */
export function parseFlexibleDateString(dateString: string): ParsedFlexibleDate {
  const trimmed = dateString.trim();

  if (trimmed.includes("T") && (trimmed.includes("+") || trimmed.includes("Z") || trimmed.includes("["))) {
    try {
      return Temporal.ZonedDateTime.from(trimmed);
    } catch {
      throw new InvalidDateError(trimmed);
    }
  }

  if (trimmed.includes("T")) {
    try {
      return Temporal.PlainDateTime.from(trimmed);
    } catch {
      throw new InvalidDateError(trimmed);
    }
  }

  if (/^\d{4}-\d{1,2}-\d{1,2}$/.test(trimmed)) {
    try {
      return Temporal.PlainDate.from(trimmed);
    } catch {
      throw new InvalidDateError(trimmed);
    }
  }

  const koreanMatch = trimmed.match(/(\d{4})년\s*(\d{1,2})월\s*(\d{1,2})일/);
  if (koreanMatch) {
    const [, year, month, day] = koreanMatch;
    try {
      return Temporal.PlainDate.from({
        year: parseInt(year),
        month: parseInt(month),
        day: parseInt(day),
      });
    } catch {
      throw new InvalidDateError(trimmed);
    }
  }

  const dotMatch = trimmed.match(/^(\d{2,4})\.(\d{1,2})\.(\d{1,2})$/);
  if (dotMatch) {
    let [, year, month, day] = dotMatch;
    if (year.length === 2) {
      const currentYear = new Date().getFullYear();
      const century = Math.floor(currentYear / 100) * 100;
      const twoDigitYear = parseInt(year);
      year = (century + twoDigitYear).toString();
    }
    try {
      return Temporal.PlainDate.from({
        year: parseInt(year),
        month: parseInt(month),
        day: parseInt(day),
      });
    } catch {
      throw new InvalidDateError(trimmed);
    }
  }

  const slashMatch = trimmed.match(/^(\d{1,4})\/(\d{1,2})\/(\d{1,4})$/);
  if (slashMatch) {
    let [, first, second, third] = slashMatch;
    let year: string, month: string, day: string;

    if (first.length === 4) {
      year = first;
      month = second;
      day = third;
    } else if (third.length <= 2) {
      month = first;
      day = second;
      const currentYear = new Date().getFullYear();
      const century = Math.floor(currentYear / 100) * 100;
      year = (century + parseInt(third)).toString();
    } else {
      month = first;
      day = second;
      year = third;
    }

    try {
      return Temporal.PlainDate.from({
        year: parseInt(year),
        month: parseInt(month),
        day: parseInt(day),
      });
    } catch {
      throw new InvalidDateError(trimmed);
    }
  }

  const compactMatch = trimmed.match(/^(\d{4})(\d{2})(\d{2})$/);
  if (compactMatch) {
    const [, year, month, day] = compactMatch;
    try {
      return Temporal.PlainDate.from({
        year: parseInt(year),
        month: parseInt(month),
        day: parseInt(day),
      });
    } catch {
      throw new InvalidDateError(trimmed);
    }
  }

  const dashMatch = trimmed.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
  if (dashMatch) {
    const [, year, month, day] = dashMatch;
    try {
      return Temporal.PlainDate.from({
        year: parseInt(year),
        month: parseInt(month),
        day: parseInt(day),
      });
    } catch {
      throw new InvalidDateError(trimmed);
    }
  }

  try {
    return Temporal.PlainDateTime.from(trimmed);
  } catch {
    try {
      return Temporal.PlainDate.from(trimmed);
    } catch {
      try {
        return Temporal.ZonedDateTime.from(trimmed);
      } catch {
        throw new InvalidDateFormatError(trimmed, [
          "ISO 8601 (YYYY-MM-DD)",
          "ISO DateTime (YYYY-MM-DDTHH:mm:ss)",
          "ISO with timezone (YYYY-MM-DDTHH:mm:ss+09:00[Asia/Seoul])",
          "Korean format (2024년 1월 15일)",
          "Dot separated (2024.01.15)",
          "Slash separated (2024/01/15)",
          "Compact format (20240115)",
        ]);
      }
    }
  }
}
