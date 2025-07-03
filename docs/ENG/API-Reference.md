# 📖 API Reference

Complete API documentation for all functions and types in the **il-gaemi** library.

## 📋 Table of Contents

- [🗓️ Date Module](#-date-module)
- [🎨 Format Module](#-format-module)
- [🌏 Timezone Module](#-timezone-module)
- [📝 Types](#-types)
- [⚠️ Errors](#-errors)

---

## 🗓️ Date Module

Functions for business day calculations and week-related operations.

### `isWorkday()`

```typescript
function isWorkday(
  date: PlainDate | string,
  holidayList?: Holiday[],
  dayOffWeekdays?: WeekDay[]
): boolean
```

Checks if the given date is a workday (business day).

**Parameters**
- `date`: Date to check (Temporal.PlainDate object or ISO date string)
- `holidayList` (optional): List of holidays (default: [])
- `dayOffWeekdays` (optional): Array of weekend weekdays, ISO standard (default: [6, 7] - Saturday, Sunday)

**Returns**
- `boolean`: `true` if it's a workday, `false` otherwise

**Usage Examples**
```typescript
// Basic usage
console.log(isWorkday('2024-01-15')); // true (Monday)
console.log(isWorkday('2024-01-13')); // false (Saturday)

// With holiday list
const holidays = [
  { date: '2024-01-01', name: 'New Year', recurring: true },
  { date: '2024-12-25', name: 'Christmas', recurring: true }
];
console.log(isWorkday('2024-01-01', holidays)); // false

// Custom weekend (Friday-Saturday as weekend)
console.log(isWorkday('2024-01-12', [], [5, 6])); // false (Friday is weekend)

// Using Temporal.PlainDate object
const date = Temporal.PlainDate.from('2024-01-15');
console.log(isWorkday(date)); // true
```

---

### `getWeekDay()`

```typescript
function getWeekDay(date: PlainDate | string): WeekDay
```

Returns the weekday of the date as an ISO standard number.

**Parameters**
- `date`: Date to get the weekday for

**Returns**
- `WeekDay`: Weekday number (1=Monday, 2=Tuesday, ..., 7=Sunday)

**Usage Examples**
```typescript
console.log(getWeekDay('2024-01-15')); // 1 (Monday)
console.log(getWeekDay('2024-01-14')); // 7 (Sunday)

// Using Temporal.PlainDate object
const date = Temporal.PlainDate.from('2024-01-16');
console.log(getWeekDay(date)); // 2 (Tuesday)
```

---

### `getWeekNum()`

```typescript
function getWeekNum(date: PlainDate | string): { 
  month: number; 
  year: number; 
  weekNum: number 
}
```

Calculates which week number of the month the date belongs to.

**Week Calculation Rules**
- Weeks start on Monday (ISO week date system)
- If the Monday of the week containing the date belongs to a different month, the week number is calculated based on that Monday
- Week numbers start from 1

**Returns**
- `Object`: Object in the form `{ year, month, weekNum }`

**Usage Examples**
```typescript
// Date in the middle of the month
const week1 = getWeekNum('2024-01-15');
console.log(week1); // { year: 2024, month: 1, weekNum: 3 }

// Case where Monday belongs to the previous month
const week2 = getWeekNum('2024-02-01');
console.log(week2); // { year: 2024, month: 1, weekNum: 5 } (possible result)

// Using Temporal.PlainDate object
const date = Temporal.PlainDate.from('2024-01-31');
const week3 = getWeekNum(date);
console.log(week3); // { year: 2024, month: 1, weekNum: 5 }
```

---

### `getNextWorkday()`

```typescript
function getNextWorkday(
  date: PlainDate | string,
  holidayList?: Holiday[],
  dayOffWeekdays?: WeekDay[]
): PlainDate
```

Finds the next business day after the given date.

**Parameters**
- `date`: Starting date
- `holidayList` (optional): List of holidays
- `dayOffWeekdays` (optional): Array of weekend weekdays

**Returns**
- `PlainDate`: Next business day

**Usage Examples**
```typescript
// Find next workday after Friday
const nextWorkday1 = getNextWorkday('2024-01-12'); 
console.log(nextWorkday1.toString()); // "2024-01-15" (Monday)

// Next workday considering holidays
const holidays = [{ date: '2024-01-15', name: 'Special Holiday', recurring: false }];
const nextWorkday2 = getNextWorkday('2024-01-12', holidays);
console.log(nextWorkday2.toString()); // "2024-01-16" (Tuesday)

// Using Temporal.PlainDate object
const date = Temporal.PlainDate.from('2024-01-31');
const nextWorkday3 = getNextWorkday(date);
console.log(nextWorkday3.toString()); // Next business day
```

---

### `getPreviousWorkday()`

```typescript
function getPreviousWorkday(
  date: PlainDate | string,
  holidayList?: Holiday[],
  dayOffWeekdays?: WeekDay[]
): PlainDate
```

Finds the previous business day before the given date.

**Usage Examples**
```typescript
// Find previous workday before Monday
const prevWorkday1 = getPreviousWorkday('2024-01-15');
console.log(prevWorkday1.toString()); // "2024-01-12" (Friday)

// Previous workday considering holidays
const holidays = [{ date: '2024-01-12', name: 'Special Holiday', recurring: false }];
const prevWorkday2 = getPreviousWorkday('2024-01-15', holidays);
console.log(prevWorkday2.toString()); // "2024-01-11" (Thursday)

// Using Temporal.PlainDate object
const date = Temporal.PlainDate.from('2024-02-01');
const prevWorkday3 = getPreviousWorkday(date);
console.log(prevWorkday3.toString()); // Previous business day
```

---

## 🎨 Format Module

Functions for formatting dates/times in various formats.

### `format()`

```typescript
function format(
  date: ZonedDateTime | PlainDate | PlainDateTime | string,
  type?: DateFormatType,
  formatString?: string
): string
```

Formats date/time in the specified format.

**Parameters**
- `date`: Date/time to format
- `type` (optional): Format type (default: "datetime")
- `formatString` (optional): Custom format string (required when type is "custom")

**Supported Format Types**
- `"date"`: YYYY-MM-DD format
- `"time"`: HH:mm:ss format
- `"datetime"`: YYYY-MM-DD HH:mm:ss format
- `"iso"`: ISO 8601 format
- `"custom"`: User-defined format

**Custom Format Tokens**
- `YYYY`: 4-digit year (e.g., 2024)
- `YY`: 2-digit year (e.g., 24)
- `MM`: 2-digit month (01-12)
- `M`: Month (1-12)
- `DD`: 2-digit day (01-31)
- `D`: Day (1-31)
- `HH`: 2-digit hour (00-23)
- `H`: Hour (0-23)
- `mm`: 2-digit minute (00-59)
- `m`: Minute (0-59)
- `ss`: 2-digit second (00-59)
- `s`: Second (0-59)

**Usage Examples**
```typescript
const date = '2024-01-15T14:30:45';

// Default format types
console.log(format(date, 'date'));     // "2024-01-15"
console.log(format(date, 'time'));     // "14:30:45"
console.log(format(date, 'datetime')); // "2024-01-15 14:30:45"
console.log(format(date, 'iso'));      // "2024-01-15T14:30:45"

// Custom formats
console.log(format(date, 'custom', 'YYYY/MM/DD HH:mm')); // "2024/01/15 14:30"
console.log(format(date, 'custom', 'M/D/YY'));           // "1/15/24"
console.log(format(date, 'custom', 'H시 m분'));          // "14시 30분"

// Using ZonedDateTime
const zonedDate = Temporal.Now.zonedDateTimeISO('Asia/Seoul');
console.log(format(zonedDate, 'datetime')); // Current time formatted

// Using PlainDate (time displays as 00:00:00)
const plainDate = Temporal.PlainDate.from('2024-01-15');
console.log(format(plainDate, 'datetime')); // "2024-01-15 00:00:00"

// Flexible string parsing
console.log(format('2024.01.15', 'date'));      // "2024-01-15"
console.log(format('2024년 1월 15일', 'date'));  // "2024-01-15"
console.log(format('20240115', 'date'));        // "2024-01-15"
```

**Error Cases**
- Attempting to format PlainDate as "time" throws `IncompatibleOperationError`
- Using "custom" type without providing `formatString` throws `MissingParameterError`

---

### `formatKorean()`

```typescript
function formatKorean(
  date: ZonedDateTime | PlainDate | PlainDateTime | string
): string
```

Formats date in Korean style.

**Usage Examples**
```typescript
console.log(formatKorean('2024-01-15')); // "2024년 1월 15일"

const datetime = Temporal.ZonedDateTime.from('2024-01-15T14:30:00+09:00[Asia/Seoul]');
console.log(formatKorean(datetime)); // "2024년 1월 15일"

// Supports various input formats
console.log(formatKorean('2024.12.25'));    // "2024년 12월 25일"
console.log(formatKorean('20241225'));      // "2024년 12월 25일"
console.log(formatKorean('2024/12/25'));    // "2024년 12월 25일"
```

---

### `formatRelative()`

```typescript
function formatRelative(
  date: ZonedDateTime | PlainDate | PlainDateTime | string,
  baseDate?: ZonedDateTime
): string
```

Formats as relative time expression.

**Parameters**
- `date`: Target date/time
- `baseDate` (optional): Base date (default: current time, Asia/Seoul)

**Usage Examples**
```typescript
const now = Temporal.Now.zonedDateTimeISO('Asia/Seoul');

// Past/future dates
const yesterday = now.subtract({ days: 1 });
const tomorrow = now.add({ days: 1 });
const twoHoursLater = now.add({ hours: 2 });
const fiveMinutesAgo = now.subtract({ minutes: 5 });

console.log(formatRelative(yesterday));    // "1일 전"
console.log(formatRelative(tomorrow));     // "1일 후"
console.log(formatRelative(twoHoursLater)); // "2시간 후"
console.log(formatRelative(fiveMinutesAgo)); // "5분 전"

// Very recent time
const justNow = now.subtract({ seconds: 30 });
console.log(formatRelative(justNow)); // "방금 전"

// Using custom base date
const baseDate = Temporal.ZonedDateTime.from('2024-01-15T12:00:00+09:00[Asia/Seoul]');
const targetDate = '2024-01-16T12:00:00+09:00[Asia/Seoul]';
console.log(formatRelative(targetDate, baseDate)); // "1일 후"
```

---

## 🌏 Timezone Module

Timezone-related functions for converting and managing date/time across different timezones.

### `DEFAULT_TIMEZONE`

```typescript
const DEFAULT_TIMEZONE: string = "Asia/Seoul"
```

Default timezone used throughout the library.

---

### `getNow()`

```typescript
function getNow(): ZonedDateTime
```

Returns current time in Korea Standard Time (KST).

**Usage Examples**
```typescript
const now = getNow();
console.log(now.toString()); 
// "2024-01-15T14:30:00+09:00[Asia/Seoul]"

// Accessing individual components
console.log(now.year);   // 2024
console.log(now.month);  // 1
console.log(now.day);    // 15
console.log(now.hour);   // 14
console.log(now.timeZoneId); // "Asia/Seoul"
```

---

### `getNowUTC()`

```typescript
function getNowUTC(): ZonedDateTime
```

Returns current time in UTC.

**Usage Examples**
```typescript
const nowUTC = getNowUTC();
console.log(nowUTC.toString()); 
// "2024-01-15T05:30:00+00:00[UTC]"

const nowSeoul = getNow();
// Check if they represent the same moment
console.log(nowUTC.epochMilliseconds === nowSeoul.epochMilliseconds); // true
```

---

### `getDate()`, `getDateUTC()`

```typescript
function getDate(year: number, month: number, day: number): ZonedDateTime
function getDateUTC(year: number, month: number, day: number): ZonedDateTime
```

Creates a date with the specified year, month, and day.

**Usage Examples**
```typescript
// Korea time
const date = getDate(2024, 1, 15);
console.log(date.toString()); 
// "2024-01-15T00:00:00+09:00[Asia/Seoul]"

// UTC
const utcDate = getDateUTC(2024, 1, 15);
console.log(utcDate.toString()); 
// "2024-01-15T00:00:00+00:00[UTC]"
```

---

### `getDateTime()`, `getDateTimeUTC()`

```typescript
function getDateTime(
  year: number, month: number, day: number, 
  hour: number, minute: number,
  second?: number, millisecond?: number, 
  microsecond?: number, nanosecond?: number
): ZonedDateTime

function getDateTimeUTC(/* same parameters */): ZonedDateTime
```

Creates date/time with the specified date and time.

**Usage Examples**
```typescript
// Korea time
const dateTime = getDateTime(2024, 1, 15, 14, 30, 45, 123, 456, 789);
console.log(dateTime.toString()); 
// "2024-01-15T14:30:45.123456789+09:00[Asia/Seoul]"

// UTC
const utcDateTime = getDateTimeUTC(2024, 1, 15, 14, 30, 45);
console.log(utcDateTime.toString()); 
// "2024-01-15T14:30:45+00:00[UTC]"

// Using optional parameters
const simpleDateTime = getDateTime(2024, 1, 15, 14, 30);
console.log(simpleDateTime.toString());
// "2024-01-15T14:30:00+09:00[Asia/Seoul]"
```

---

### `getTime()`

```typescript
function getTime(
  hour: number, minute: number,
  second?: number, millisecond?: number,
  microsecond?: number, nanosecond?: number
): Temporal.PlainTime
```

Creates a PlainTime object with only time information.

**Usage Examples**
```typescript
const time = getTime(14, 30, 45, 123, 456, 789);
console.log(time.toString()); 
// "14:30:45.123456789"

// Hour and minute only
const simpleTime = getTime(14, 30);
console.log(simpleTime.toString()); 
// "14:30:00"
```

---

### `convertToZonedDateTime()`

```typescript
function convertToZonedDateTime(
  date: ZonedDateTime | Temporal.PlainDateTime | string,
  timeZone?: string
): ZonedDateTime
```

Converts various forms of date/time to ZonedDateTime in the specified timezone.

**Parameters**
- `date`: Date/time to convert
- `timeZone` (optional): Target timezone (default: "Asia/Seoul")

**Usage Examples**
```typescript
// Convert ISO string to Korea time
const fromISOString = convertToZonedDateTime('2024-01-15T10:00:00Z', 'Asia/Seoul');
console.log(fromISOString.hour); // 19 (UTC 10:00 is Seoul 19:00)

// Date-only string (time set to 00:00:00)
const fromDateString = convertToZonedDateTime('2024-01-15');
console.log(fromDateString.toString());
// "2024-01-15T00:00:00+09:00[Asia/Seoul]"

// Interpret PlainDateTime as specific timezone
const plainDateTime = Temporal.PlainDateTime.from('2024-01-15T12:00:00');
const zonedDateTime = convertToZonedDateTime(plainDateTime, 'America/New_York');
console.log(zonedDateTime.hour); // 12 (interpreted as New York 12:00)

// Change timezone of existing ZonedDateTime
const utcTime = Temporal.ZonedDateTime.from('2024-01-15T10:00:00+00:00[UTC]');
const seoulTime = convertToZonedDateTime(utcTime, 'Asia/Seoul');
console.log(seoulTime.hour); // 19 (same moment, different timezone)
```

---

### `toUTC()`, `fromUTC()`

```typescript
function toUTC(zonedDateTime: ZonedDateTime): ZonedDateTime
function fromUTC(utcDateTime: ZonedDateTime, timeZone?: string): ZonedDateTime
```

Performs conversions between UTC and other timezones.

**Usage Examples**
```typescript
// Convert ZonedDateTime to UTC
const seoulTime = Temporal.ZonedDateTime.from('2024-01-15T14:30:00+09:00[Asia/Seoul]');
const utcTime = toUTC(seoulTime);
console.log(utcTime.toString()); 
// "2024-01-15T05:30:00+00:00[UTC]"

// Convert UTC to other timezones
const utc = Temporal.ZonedDateTime.from('2024-01-15T05:30:00+00:00[UTC]');

const seoul = fromUTC(utc); // default: Asia/Seoul
console.log(seoul.hour); // 14

const tokyo = fromUTC(utc, 'Asia/Tokyo');
console.log(tokyo.hour); // 14

const ny = fromUTC(utc, 'America/New_York');
console.log(ny.hour); // 0 (EST)
```

---

### `getTimeZoneOffset()`

```typescript
function getTimeZoneOffset(
  fromTimeZone: string, 
  toTimeZone: string, 
  referenceDate?: ZonedDateTime
): number
```

Calculates the time difference between two timezones in hours.

**Parameters**
- `fromTimeZone`: Source timezone
- `toTimeZone`: Target timezone
- `referenceDate` (optional): Reference date for calculation (for DST consideration)

**Usage Examples**
```typescript
// Basic offset calculation
console.log(getTimeZoneOffset('UTC', 'Asia/Seoul')); // 9
console.log(getTimeZoneOffset('Asia/Seoul', 'UTC')); // -9
console.log(getTimeZoneOffset('Asia/Seoul', 'Asia/Tokyo')); // 0

// Considering daylight saving time
const summerDate = Temporal.ZonedDateTime.from('2024-07-15T12:00:00+09:00[Asia/Seoul]');
const summerOffset = getTimeZoneOffset('UTC', 'America/New_York', summerDate);
console.log(summerOffset); // -4 (EDT)

const winterDate = Temporal.ZonedDateTime.from('2024-01-15T12:00:00+09:00[Asia/Seoul]');
const winterOffset = getTimeZoneOffset('UTC', 'America/New_York', winterDate);
console.log(winterOffset); // -5 (EST)
```

---

## 📝 Types

### `DateFormatType`

```typescript
type DateFormatType = "date" | "time" | "datetime" | "iso" | "custom"
```

Defines the format types used in the `format()` function.

---

### `WeekDay`

```typescript
type WeekDay = 1 | 2 | 3 | 4 | 5 | 6 | 7
```

ISO standard weekday numbers (1=Monday, 7=Sunday).

---

### `Holiday`

```typescript
interface Holiday {
  date: string;        // Date in YYYY-MM-DD format
  name: string;        // Holiday name
  recurring?: boolean; // Whether it recurs annually (default: false)
}
```

Interface for defining holiday information.

**Usage Example**
```typescript
const holidays: Holiday[] = [
  { date: '2024-01-01', name: 'New Year', recurring: true },
  { date: '2024-02-09', name: 'Lunar New Year', recurring: false },
  { date: '2024-03-01', name: 'Independence Movement Day', recurring: true },
  { date: '2024-05-05', name: 'Children\'s Day', recurring: true }
];
```

---

### Temporal Type Aliases

```typescript
type ZonedDateTime = Temporal.ZonedDateTime;    // Date/time with timezone
type PlainDate = Temporal.PlainDate;            // Date only
type PlainTime = Temporal.PlainTime;            // Time only  
type PlainDateTime = Temporal.PlainDateTime;    // Date/time without timezone
type TimeZone = string;                         // Timezone string
```

Type aliases for Temporal API objects for convenience and consistency.

---

## ⚠️ Errors

Custom error types that can occur in the library.

### `DateError`

```typescript
class DateError extends Error
```

Base class for all il-gaemi errors.

---

### `InvalidDateFormatError`

```typescript
class InvalidDateFormatError extends DateError
```

Thrown when an unsupported date format is used.

**Example**
```typescript
try {
  format('invalid-date', 'date');
} catch (error) {
  console.log(error instanceof InvalidDateFormatError); // true
  console.log(error.message); 
  // "Unsupported date format: invalid-date. Supported formats: ..."
}
```

---

### `InvalidDateError`

```typescript
class InvalidDateError extends DateError
```

Thrown when an invalid date value is used.

**Example**
```typescript
try {
  format('2024-02-30', 'date'); // February 30th doesn't exist
} catch (error) {
  console.log(error instanceof InvalidDateError); // true
}
```

---

### `UnsupportedFormatTypeError`

```typescript
class UnsupportedFormatTypeError extends DateError
```

Thrown when an unsupported format type is used.

**Example**
```typescript
try {
  format('2024-01-15', 'unknown' as any);
} catch (error) {
  console.log(error instanceof UnsupportedFormatTypeError); // true
}
```

---

### `MissingParameterError`

```typescript
class MissingParameterError extends DateError
```

Thrown when a required parameter is missing.

**Example**
```typescript
try {
  format('2024-01-15', 'custom'); // formatString missing
} catch (error) {
  console.log(error instanceof MissingParameterError); // true
  console.log(error.message); // "Missing required parameter: formatString"
}
```

---

### `IncompatibleOperationError`

```typescript
class IncompatibleOperationError extends DateError
```

Thrown when attempting an incompatible operation.

**Example**
```typescript
try {
  const plainDate = Temporal.PlainDate.from('2024-01-15');
  format(plainDate, 'time'); // PlainDate doesn't have time information
} catch (error) {
  console.log(error instanceof IncompatibleOperationError); // true
  console.log(error.message); 
  // "Incompatible operation: formatting as time. Reason: PlainDate does not contain time information"
}
```

---

## 🔗 Related Documentation

- [🚀 QuickStart](./QuickStart.md) - Quick start guide

---

## 💡 Supported Date Formats

The library automatically recognizes and parses the following date formats:

- **ISO formats**: `2024-01-15`, `2024-01-15T14:30:00`
- **With timezone**: `2024-01-15T14:30:00+09:00[Asia/Seoul]`
- **Dot-separated**: `2024.01.15`, `24.01.15`
- **Slash-separated**: `2024/01/15`, `01/15/24`, `01/15/2024`
- **Korean format**: `2024년 1월 15일`, `2024년1월15일`
- **Compact format**: `20240115`
- **Flexible separators**: `2024-1-15`, `2024.1.15`

All functions are based on the Temporal API, providing precise and safe date/time handling. 