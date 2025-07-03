# 🚀 QuickStart Guide

A guide to quickly get started with the **il-gaemi** library.

## 📦 Installation

Install the library using one of the following commands:

```bash
# Using npm
npm install @zwoninstitute/il-gaemi

# Using yarn
yarn add @zwoninstitute/il-gaemi

# Using bun
bun add @zwoninstitute/il-gaemi
```

## 🏃‍♂️ Get Started in 5 Minutes

### 1. Basic Import

```typescript
import { 
  isWorkday, 
  format, 
  formatKorean, 
  getNow, 
  getNextWorkday 
} from '@zwoninstitute/il-gaemi';
```

### 2. Getting Current Time

```typescript
// Get current time in Korean Standard Time (KST)
const now = getNow();
console.log(now.toString()); 
// Output: "2024-01-15T14:30:00+09:00[Asia/Seoul]"

// Get current time in UTC
import { getNowUTC } from '@zwoninstitute/il-gaemi';
const nowUTC = getNowUTC();
console.log(nowUTC.toString()); 
// Output: "2024-01-15T05:30:00+00:00[UTC]"
```

### 3. Checking Business Days

```typescript
// Check if today is a business day
const today = getNow();
const isTodayWorkday = isWorkday(today);
console.log(`Is today a business day? ${isTodayWorkday ? 'Yes' : 'No'}`);

// Check if specific dates are business days
const isMonday = isWorkday('2024-01-15'); // true (Monday)
const isSaturday = isWorkday('2024-01-13'); // false (Saturday)
```

### 4. Finding Next Business Day

```typescript
// Find the next business day
const nextWorkday = getNextWorkday(today);
console.log(`Next business day: ${format(nextWorkday, 'date')}`);
// Output: "Next business day: 2024-01-16"
```

### 5. Date Formatting

```typescript
const date = '2024-01-15T14:30:00';

// Format in various styles
console.log(format(date, 'date'));     // "2024-01-15"
console.log(format(date, 'time'));     // "14:30:00"
console.log(format(date, 'datetime')); // "2024-01-15 14:30:00"

// Format in Korean style
console.log(formatKorean(date)); // "2024년 1월 15일"

// Relative time expressions
import { formatRelative } from '@zwoninstitute/il-gaemi';
const yesterday = getNow().subtract({ days: 1 });
console.log(formatRelative(yesterday)); // "1일 전" (1 day ago)
```

### 6. Business Day Calculation with Holidays

```typescript
// Define holiday list
const koreanHolidays = [
  { date: '2024-01-01', recurring: true },  // New Year's Day (recurring annually)
  { date: '2024-02-09', recurring: false }, // Lunar New Year (2024 only)
  { date: '2024-03-01', recurring: true },  // Independence Movement Day (recurring annually)
  { date: '2024-05-05', recurring: true },  // Children's Day (recurring annually)
];

// Check business day considering holidays
const isNewYearWorkday = isWorkday('2024-01-01', koreanHolidays); 
console.log(isNewYearWorkday); // false

// Find next business day considering holidays
const nextWorkdayWithHolidays = getNextWorkday('2024-12-31', koreanHolidays);
console.log(format(nextWorkdayWithHolidays, 'date')); // "2024-01-02" (excluding New Year's Day)
```

### 7. Timezone Conversion

```typescript
import { convertToZonedDateTime, toUTC, fromUTC } from '@zwoninstitute/il-gaemi';

// Convert string to Korean time
const koreanTime = convertToZonedDateTime('2024-01-15T14:30:00', 'Asia/Seoul');

// Convert Korean time to UTC
const utcTime = toUTC(koreanTime);
console.log(format(utcTime, 'datetime')); // "2024-01-15 05:30:00"

// Convert UTC back to Korean time
const backToKorean = fromUTC(utcTime, 'Asia/Seoul');
console.log(format(backToKorean, 'datetime')); // "2024-01-15 14:30:00"
```

## 🎯 Key Use Cases

### 📅 Business Schedule Management

```typescript
import { getNextWorkday, getPreviousWorkday, getWeekDay } from '@zwoninstitute/il-gaemi';

const today = getNow();

// Check which day of the week it is
const weekday = getWeekDay(today);
console.log(`Today is day ${weekday} of the week`); // 1=Monday, 7=Sunday

// Previous/next business days
const prevWorkday = getPreviousWorkday(today);
const nextWorkday = getNextWorkday(today);

console.log(`Previous business day: ${formatKorean(prevWorkday)}`);
console.log(`Next business day: ${formatKorean(nextWorkday)}`);
```

### 📊 Monthly Week Calculation

```typescript
import { getWeekNum } from '@zwoninstitute/il-gaemi';

const date = '2024-01-15';
const weekInfo = getWeekNum(date);

console.log(`Week ${weekInfo.weekNum} of ${weekInfo.month}/${weekInfo.year}`);
// Output: "Week 3 of 1/2024"
```

### 🌐 Multi-Country Service Time Management

```typescript
import { getTimeZoneOffset } from '@zwoninstitute/il-gaemi';

// Calculate time difference between Korea and US Eastern Time
const offset = getTimeZoneOffset('Asia/Seoul', 'America/New_York');
console.log(`Time difference between Korea and New York: ${offset} hours`);
```

## 🔧 Advanced Usage

### Custom Weekend Definition

```typescript
// Set Friday-Saturday as weekend (Middle East style)
const customWeekends = [5, 6]; // 5=Friday, 6=Saturday

const isFridayWorkday = isWorkday('2024-01-12', [], customWeekends);
console.log(isFridayWorkday); // false (Friday is weekend)
```

### Flexible Date Parsing

```typescript
// Automatically parse various date string formats
const dates = [
  '2024-01-15',      // ISO format
  '2024.01.15',      // Dot separated
  '2024/01/15',      // Slash separated
  '2024년 1월 15일',  // Korean format
  '20240115'         // Compact format
];

dates.forEach(dateStr => {
  console.log(`${dateStr} → ${format(dateStr, 'datetime')}`);
});
```

## 🚨 Important Notes

1. **Temporal API**: This library uses the modern Temporal API. The polyfill is automatically included.

2. **Timezone**: The default timezone is `Asia/Seoul` (Korea Standard Time).

3. **Business Days**: By default, Saturday (6) and Sunday (7) are considered weekends.

4. **Holidays**: Holiday lists must be defined manually. The library does not include default holidays.

## 🔗 Next Steps

- 📖 [API Reference](./API-Reference.md) - Detailed documentation of all functions

---

💡 **Tip**: More examples and usage patterns can be found in the project's `tests/` folder! 