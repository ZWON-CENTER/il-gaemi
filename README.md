

# il-gaemi 🐜

<div align="center">
<img src="ilgaemi.png" alt="il-gaemi Logo" width=200>
</div>

A comprehensive TypeScript date and time utility library built on top of the modern Temporal API, with a focus on Korean localization and business day calculations.

## ✨ Features

- **🏢 Business Day Calculations**: Determine workdays, skip holidays and weekends with customizable rules
- **🎨 Flexible Date Formatting**: Support for various output formats including Korean style and relative time
- **🌏 Timezone Management**: Seamless conversion between timezones with built-in Korean timezone support
- **⚡ Temporal API Integration**: Built on the cutting-edge Temporal API for precise and reliable date/time handling
- **🔒 Type Safety**: Full TypeScript support with comprehensive type definitions
- **🇰🇷 Korean Localization**: Native support for Korean date formats and business calendar

## 📦 Installation

```bash
# Using npm
npm install @zwongroup/il-gaemi

# Using yarn
yarn add @zwongroup/il-gaemi

# Using bun

# il-gaemi 🐜
bun add @zwongroup/il-gaemi
```

## 🚀 Quick Start

```typescript
import { isWorkday, format, getNow, getNextWorkday, formatKorean } from '@zwongroup/il-gaemi';

// Check if today is a business day
const today = getNow();
console.log(isWorkday(today)); // true/false

// Format dates in different styles
console.log(format(today, 'date')); // "2024-01-15"
console.log(format(today, 'datetime')); // "2024-01-15 14:30:00"
console.log(formatKorean(today)); // "2024년 1월 15일"

// Find the next business day
const nextWorkday = getNextWorkday(today);
console.log(format(nextWorkday, 'date')); // Next business day

// Work with timezones
const utcTime = getNowUTC();
const koreanTime = convertToZonedDateTime(utcTime, 'Asia/Seoul');
```

## 📚 API Reference

### 🗓️ Date Functions

#### `isWorkday(date, holidayList?, dayOffWeekdays?)`
Determines whether a given date is a business day.

```typescript
// Basic usage
isWorkday('2024-01-15'); // true (Monday)
isWorkday('2024-01-13'); // false (Saturday)

// With holidays
const holidays = [
  { date: '2024-01-01', recurring: false },
  { date: '2024-12-25', recurring: true }
];
isWorkday('2024-01-01', holidays); // false

// Custom weekend days (Friday-Saturday)
isWorkday('2024-01-12', [], [5, 6]); // false
```

#### `getNextWorkday(date, holidayList?, dayOffWeekdays?)`
Finds the next business day after a given date.

#### `getPreviousWorkday(date, holidayList?, dayOffWeekdays?)`
Finds the previous business day before a given date.

#### `getWeekDay(date)`
Returns the ISO weekday number (1=Monday, 7=Sunday).

#### `getWeekNum(date)`
Calculates which week number a date belongs to within its month.

### 🎨 Format Functions

#### `format(date, type?, formatString?)`
Formats dates with various predefined types or custom patterns.

```typescript
const date = '2024-01-15T14:30:00';

format(date, 'date');     // "2024-01-15"
format(date, 'time');     // "14:30:00"
format(date, 'datetime'); // "2024-01-15 14:30:00"
format(date, 'iso');      // "2024-01-15T14:30:00"

// Custom formatting
format(date, 'custom', 'YYYY/MM/DD HH:mm'); // "2024/01/15 14:30"
```

#### `formatKorean(date)`
Formats dates in Korean style.

```typescript
formatKorean('2024-01-15'); // "2024년 1월 15일"
```

#### `formatRelative(date, baseDate?)`
Returns relative time expressions in Korean.

```typescript
formatRelative(yesterday); // "1일 전"
formatRelative(tomorrow);  // "1일 후"
formatRelative(twoHoursLater); // "2시간 후"
```

### 🌏 Timezone Functions

#### `getNow()` / `getNowUTC()`
Get current time in Asia/Seoul or UTC timezone.

#### `convertToZonedDateTime(date, timeZone?)`
Convert any date to a ZonedDateTime in the specified timezone.

#### `toUTC(zonedDateTime)` / `fromUTC(utcDateTime, timeZone?)`
Convert between UTC and other timezones.

#### `getTimeZoneOffset(fromTimeZone, toTimeZone, referenceDate?)`
Calculate time difference between timezones in hours.

## 🏗️ Module Organization

- **Date Module**: Business day calculations and week utilities
- **Format Module**: Date/time formatting with multiple output styles  
- **Timezone Module**: Timezone conversion and management
- **Types Module**: TypeScript type definitions

## 🔧 Advanced Usage

### Custom Holiday Lists

```typescript
const koreanHolidays = [
  { date: '2024-01-01', recurring: true },  // New Year
  { date: '2024-02-09', recurring: false }, // Lunar New Year 2024
  { date: '2024-03-01', recurring: true },  // Independence Day
  { date: '2024-05-05', recurring: true },  // Children's Day
];

const isBusinessDay = isWorkday('2024-03-01', koreanHolidays); // false
```

### Flexible Date Parsing

```typescript
// Supports various input formats
format('2024-01-15');      // ISO format
format('2024.01.15');      // Dot separated
format('2024/01/15');      // Slash separated  
format('2024년 1월 15일');  // Korean format
format('20240115');        // Compact format
```

## 📄 License

MIT

## 🤝 Contributing

We welcome contributions! Please feel free to submit a Pull Request.

---

*il-gaemi (일개미) - Working hard like ants to make date handling easier* 🐜
