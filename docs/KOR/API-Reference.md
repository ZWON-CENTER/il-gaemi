# 📖 API Reference

**il-gaemi** 라이브러리의 모든 함수와 타입에 대한 상세한 API 문서입니다.

## 📋 목차

- [🗓️ Date 모듈](#-date-모듈)
- [🎨 Format 모듈](#-format-모듈)
- [🌏 Timezone 모듈](#-timezone-모듈)
- [🗄️ Transform 모듈](#-transform-모듈)
- [📝 Types](#-types)
- [⚠️ Errors](#-errors)

---

## 🗓️ Date 모듈

영업일 계산과 주차 관련 함수들입니다.

### `isWorkday()`

```typescript
function isWorkday(
  date: PlainDate | string,
  holidayList?: Holiday[],
  dayOffWeekdays?: WeekDay[]
): boolean
```

주어진 날짜가 영업일(근무일)인지 확인합니다.

**매개변수**
- `date`: 확인할 날짜 (Temporal.PlainDate 객체 또는 ISO 날짜 문자열)
- `holidayList` (선택): 공휴일 목록 (기본값: [])
- `dayOffWeekdays` (선택): 휴무 요일 배열, ISO 표준 (기본값: [6, 7] - 토, 일요일)

**반환값**
- `boolean`: 영업일이면 `true`, 아니면 `false`

**사용 예제**
```typescript
// 기본 사용법
console.log(isWorkday('2024-01-15')); // true (월요일)
console.log(isWorkday('2024-01-13')); // false (토요일)

// 공휴일 목록과 함께 사용
const holidays = [
  { date: '2024-01-01', name: '신정', recurring: true },
  { date: '2024-12-25', name: '크리스마스', recurring: true }
];
console.log(isWorkday('2024-01-01', holidays)); // false

// 커스텀 주말 (금-토요일을 주말로 설정)
console.log(isWorkday('2024-01-12', [], [5, 6])); // false (금요일이 주말)

// Temporal.PlainDate 객체 사용
const date = Temporal.PlainDate.from('2024-01-15');
console.log(isWorkday(date)); // true
```

---

### `getWeekDay()`

```typescript
function getWeekDay(date: PlainDate | string): WeekDay
```

날짜의 요일을 ISO 표준 번호로 반환합니다.

**매개변수**
- `date`: 요일을 확인할 날짜

**반환값**
- `WeekDay`: 요일 번호 (1=월요일, 2=화요일, ..., 7=일요일)

**사용 예제**
```typescript
console.log(getWeekDay('2024-01-15')); // 1 (월요일)
console.log(getWeekDay('2024-01-14')); // 7 (일요일)

// Temporal.PlainDate 객체 사용
const date = Temporal.PlainDate.from('2024-01-16');
console.log(getWeekDay(date)); // 2 (화요일)
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

해당 날짜가 속한 월의 몇 번째 주인지 계산합니다.

**주차 계산 규칙**
- 주는 월요일부터 시작 (ISO 주 날짜 시스템)
- 해당 날짜가 포함된 주의 월요일이 다른 월에 속하면, 그 월요일 기준으로 주차 계산
- 주 번호는 1부터 시작

**반환값**
- `Object`: `{ year, month, weekNum }` 형태의 객체

**사용 예제**
```typescript
// 월 중간의 날짜
const week1 = getWeekNum('2024-01-15');
console.log(week1); // { year: 2024, month: 1, weekNum: 3 }

// 월요일이 이전 월에 속하는 경우
const week2 = getWeekNum('2024-02-01');
console.log(week2); // { year: 2024, month: 1, weekNum: 5 } (가능한 결과)

// Temporal.PlainDate 객체 사용
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

주어진 날짜 이후의 다음 영업일을 찾습니다.

**매개변수**
- `date`: 시작 날짜
- `holidayList` (선택): 공휴일 목록
- `dayOffWeekdays` (선택): 휴무 요일 배열

**반환값**
- `PlainDate`: 다음 영업일

**사용 예제**
```typescript
// 금요일 다음 영업일 찾기
const nextWorkday1 = getNextWorkday('2024-01-12'); 
console.log(nextWorkday1.toString()); // "2024-01-15" (월요일)

// 공휴일을 고려한 다음 영업일
const holidays = [{ date: '2024-01-15', name: '특별휴일', recurring: false }];
const nextWorkday2 = getNextWorkday('2024-01-12', holidays);
console.log(nextWorkday2.toString()); // "2024-01-16" (화요일)

// Temporal.PlainDate 객체 사용
const date = Temporal.PlainDate.from('2024-01-31');
const nextWorkday3 = getNextWorkday(date);
console.log(nextWorkday3.toString()); // 다음 영업일
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

주어진 날짜 이전의 이전 영업일을 찾습니다.

**사용 예제**
```typescript
// 월요일 이전 영업일 찾기
const prevWorkday1 = getPreviousWorkday('2024-01-15');
console.log(prevWorkday1.toString()); // "2024-01-12" (금요일)

// 공휴일을 고려한 이전 영업일
const holidays = [{ date: '2024-01-12', name: '특별휴일', recurring: false }];
const prevWorkday2 = getPreviousWorkday('2024-01-15', holidays);
console.log(prevWorkday2.toString()); // "2024-01-11" (목요일)

// Temporal.PlainDate 객체 사용
const date = Temporal.PlainDate.from('2024-02-01');
const prevWorkday3 = getPreviousWorkday(date);
console.log(prevWorkday3.toString()); // 이전 영업일
```

---

## 🎨 Format 모듈

날짜/시간을 다양한 형식으로 포맷팅하는 함수들입니다.

### `format()`

```typescript
function format(
  date: ZonedDateTime | PlainDate | PlainDateTime | string,
  type?: DateFormatType,
  formatString?: string
): string
```

날짜/시간을 지정된 형식으로 포맷팅합니다.

**매개변수**
- `date`: 포맷팅할 날짜/시간
- `type` (선택): 포맷 타입 (기본값: "datetime")
- `formatString` (선택): 커스텀 포맷 문자열 (type이 "custom"일 때 필요)

**지원하는 포맷 타입**
- `"date"`: YYYY-MM-DD 형식
- `"time"`: HH:mm:ss 형식
- `"datetime"`: YYYY-MM-DD HH:mm:ss 형식
- `"iso"`: ISO 8601 형식
- `"custom"`: 사용자 정의 형식

**커스텀 포맷 토큰**
- `YYYY`: 4자리 연도 (예: 2024)
- `YY`: 2자리 연도 (예: 24)
- `MM`: 2자리 월 (01-12)
- `M`: 월 (1-12)
- `DD`: 2자리 일 (01-31)
- `D`: 일 (1-31)
- `HH`: 2자리 시 (00-23)
- `H`: 시 (0-23)
- `mm`: 2자리 분 (00-59)
- `m`: 분 (0-59)
- `ss`: 2자리 초 (00-59)
- `s`: 초 (0-59)

**사용 예제**
```typescript
const date = '2024-01-15T14:30:45';

// 기본 포맷 타입들
console.log(format(date, 'date'));     // "2024-01-15"
console.log(format(date, 'time'));     // "14:30:45"
console.log(format(date, 'datetime')); // "2024-01-15 14:30:45"
console.log(format(date, 'iso'));      // "2024-01-15T14:30:45"

// 커스텀 포맷
console.log(format(date, 'custom', 'YYYY/MM/DD HH:mm')); // "2024/01/15 14:30"
console.log(format(date, 'custom', 'M/D/YY'));           // "1/15/24"
console.log(format(date, 'custom', 'H시 m분'));          // "14시 30분"

// ZonedDateTime 사용
const zonedDate = Temporal.Now.zonedDateTimeISO('Asia/Seoul');
console.log(format(zonedDate, 'datetime')); // 현재 시간 포맷팅

// PlainDate 사용 (시간은 00:00:00으로 표시)
const plainDate = Temporal.PlainDate.from('2024-01-15');
console.log(format(plainDate, 'datetime')); // "2024-01-15 00:00:00"

// 유연한 문자열 파싱
console.log(format('2024.01.15', 'date'));      // "2024-01-15"
console.log(format('2024년 1월 15일', 'date'));  // "2024-01-15"
console.log(format('20240115', 'date'));        // "2024-01-15"
```

**예외 상황**
- PlainDate를 "time" 형식으로 포맷하려 하면 `IncompatibleOperationError` 발생
- "custom" 타입 사용 시 `formatString` 미제공하면 `MissingParameterError` 발생

---

### `formatKorean()`

```typescript
function formatKorean(
  date: ZonedDateTime | PlainDate | PlainDateTime | string
): string
```

날짜를 한국어 형식으로 포맷팅합니다.

**사용 예제**
```typescript
console.log(formatKorean('2024-01-15')); // "2024년 1월 15일"

const datetime = Temporal.ZonedDateTime.from('2024-01-15T14:30:00+09:00[Asia/Seoul]');
console.log(formatKorean(datetime)); // "2024년 1월 15일"

// 다양한 입력 형식 지원
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

상대적 시간 표현으로 포맷팅합니다.

**매개변수**
- `date`: 대상 날짜/시간
- `baseDate` (선택): 기준 날짜 (기본값: 현재 시간, Asia/Seoul)

**사용 예제**
```typescript
const now = Temporal.Now.zonedDateTimeISO('Asia/Seoul');

// 과거/미래 날짜
const yesterday = now.subtract({ days: 1 });
const tomorrow = now.add({ days: 1 });
const twoHoursLater = now.add({ hours: 2 });
const fiveMinutesAgo = now.subtract({ minutes: 5 });

console.log(formatRelative(yesterday));    // "1일 전"
console.log(formatRelative(tomorrow));     // "1일 후"
console.log(formatRelative(twoHoursLater)); // "2시간 후"
console.log(formatRelative(fiveMinutesAgo)); // "5분 전"

// 매우 최근 시간
const justNow = now.subtract({ seconds: 30 });
console.log(formatRelative(justNow)); // "방금 전"

// 커스텀 기준 날짜 사용
const baseDate = Temporal.ZonedDateTime.from('2024-01-15T12:00:00+09:00[Asia/Seoul]');
const targetDate = '2024-01-16T12:00:00+09:00[Asia/Seoul]';
console.log(formatRelative(targetDate, baseDate)); // "1일 후"
```

---

## 🌏 Timezone 모듈

타임존 관련 함수들로 날짜/시간을 다양한 타임존으로 변환하고 관리할 수 있습니다.

### `DEFAULT_TIMEZONE`

```typescript
const DEFAULT_TIMEZONE: string = "Asia/Seoul"
```

라이브러리 전체에서 사용하는 기본 타임존입니다.

---

### `getNow()`

```typescript
function getNow(): ZonedDateTime
```

현재 시간을 한국 표준시(KST)로 반환합니다.

**사용 예제**
```typescript
const now = getNow();
console.log(now.toString()); 
// "2024-01-15T14:30:00+09:00[Asia/Seoul]"

// 개별 컴포넌트 접근
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

현재 시간을 UTC로 반환합니다.

**사용 예제**
```typescript
const nowUTC = getNowUTC();
console.log(nowUTC.toString()); 
// "2024-01-15T05:30:00+00:00[UTC]"

const nowSeoul = getNow();
// 같은 순간을 나타내는지 확인
console.log(nowUTC.epochMilliseconds === nowSeoul.epochMilliseconds); // true
```

---

### `getDate()`, `getDateUTC()`

```typescript
function getDate(year: number, month: number, day: number): ZonedDateTime
function getDateUTC(year: number, month: number, day: number): ZonedDateTime
```

지정된 연도, 월, 일로 날짜를 생성합니다.

**사용 예제**
```typescript
// 한국 시간 기준
const date = getDate(2024, 1, 15);
console.log(date.toString()); 
// "2024-01-15T00:00:00+09:00[Asia/Seoul]"

// UTC 기준
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

function getDateTimeUTC(/* 동일한 매개변수 */): ZonedDateTime
```

지정된 날짜와 시간으로 날짜/시간을 생성합니다.

**사용 예제**
```typescript
// 한국 시간 기준
const dateTime = getDateTime(2024, 1, 15, 14, 30, 45, 123, 456, 789);
console.log(dateTime.toString()); 
// "2024-01-15T14:30:45.123456789+09:00[Asia/Seoul]"

// UTC 기준
const utcDateTime = getDateTimeUTC(2024, 1, 15, 14, 30, 45);
console.log(utcDateTime.toString()); 
// "2024-01-15T14:30:45+00:00[UTC]"

// 선택적 매개변수 사용
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

시간 정보만으로 PlainTime 객체를 생성합니다.

**사용 예제**
```typescript
const time = getTime(14, 30, 45, 123, 456, 789);
console.log(time.toString()); 
// "14:30:45.123456789"

// 시, 분만 지정
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

다양한 형태의 날짜/시간을 지정된 타임존의 ZonedDateTime으로 변환합니다.

**매개변수**
- `date`: 변환할 날짜/시간
- `timeZone` (선택): 대상 타임존 (기본값: "Asia/Seoul")

**사용 예제**
```typescript
// ISO 문자열을 한국 시간으로 변환
const fromISOString = convertToZonedDateTime('2024-01-15T10:00:00Z', 'Asia/Seoul');
console.log(fromISOString.hour); // 19 (UTC 10시는 Seoul 19시)

// 날짜만 있는 문자열 (시간은 00:00:00으로 설정)
const fromDateString = convertToZonedDateTime('2024-01-15');
console.log(fromDateString.toString());
// "2024-01-15T00:00:00+09:00[Asia/Seoul]"

// PlainDateTime을 특정 타임존으로 해석
const plainDateTime = Temporal.PlainDateTime.from('2024-01-15T12:00:00');
const zonedDateTime = convertToZonedDateTime(plainDateTime, 'America/New_York');
console.log(zonedDateTime.hour); // 12 (뉴욕 시간 12시로 해석)

// 기존 ZonedDateTime의 타임존 변경
const utcTime = Temporal.ZonedDateTime.from('2024-01-15T10:00:00+00:00[UTC]');
const seoulTime = convertToZonedDateTime(utcTime, 'Asia/Seoul');
console.log(seoulTime.hour); // 19 (같은 순간, 다른 타임존)
```

---

### `toUTC()`, `fromUTC()`

```typescript
function toUTC(zonedDateTime: ZonedDateTime): ZonedDateTime
function fromUTC(utcDateTime: ZonedDateTime, timeZone?: string): ZonedDateTime
```

UTC와 다른 타임존 간의 변환을 수행합니다.

**사용 예제**
```typescript
// ZonedDateTime을 UTC로 변환
const seoulTime = Temporal.ZonedDateTime.from('2024-01-15T14:30:00+09:00[Asia/Seoul]');
const utcTime = toUTC(seoulTime);
console.log(utcTime.toString()); 
// "2024-01-15T05:30:00+00:00[UTC]"

// UTC를 다른 타임존으로 변환
const utc = Temporal.ZonedDateTime.from('2024-01-15T05:30:00+00:00[UTC]');

const seoul = fromUTC(utc); // 기본값: Asia/Seoul
console.log(seoul.hour); // 14

const tokyo = fromUTC(utc, 'Asia/Tokyo');
console.log(tokyo.hour); // 14

const ny = fromUTC(utc, 'America/New_York');
console.log(ny.hour); // 0 (EST 기준)
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

두 타임존 간의 시차를 시간 단위로 계산합니다.

**매개변수**
- `fromTimeZone`: 기준 타임존
- `toTimeZone`: 대상 타임존
- `referenceDate` (선택): 계산 기준 날짜 (일광절약시간 고려용)

**사용 예제**
```typescript
// 기본 시차 계산
console.log(getTimeZoneOffset('UTC', 'Asia/Seoul')); // 9
console.log(getTimeZoneOffset('Asia/Seoul', 'UTC')); // -9
console.log(getTimeZoneOffset('Asia/Seoul', 'Asia/Tokyo')); // 0

// 일광절약시간 고려
const summerDate = Temporal.ZonedDateTime.from('2024-07-15T12:00:00+09:00[Asia/Seoul]');
const summerOffset = getTimeZoneOffset('UTC', 'America/New_York', summerDate);
console.log(summerOffset); // -4 (EDT)

const winterDate = Temporal.ZonedDateTime.from('2024-01-15T12:00:00+09:00[Asia/Seoul]');
const winterOffset = getTimeZoneOffset('UTC', 'America/New_York', winterDate);
console.log(winterOffset); // -5 (EST)
```

---

## 🗄️ Transform 모듈

Date객체 관련 변환 함수들입니다.

### `temporalToDate()`

```typescript
function temporalToDate(
  temporal: Temporal.Instant | ZonedDateTime | PlainDate | PlainDateTime | null | undefined
): Date | null
```

Temporal 객체를 JavaScript Date 객체로 변환합니다.

**매개변수**
- `temporal`: 변환할 Temporal 객체

**반환값**
- `Date | null`: 변환된 Date 객체 (null 입력 시 null 반환)

**사용 예제**
```typescript
const zonedDateTime = getNow();
const date = temporalToDate(zonedDateTime);
console.log(date instanceof Date); // true

const plainDate = Temporal.PlainDate.from('2024-01-15');
const dateFromPlain = temporalToDate(plainDate);
// PlainDate는 기본 타임존(Asia/Seoul)의 당일 00:00:00으로 변환

const plainDateTime = Temporal.PlainDateTime.from('2024-01-15T14:30:00');
const dateFromPlainDT = temporalToDate(plainDateTime);
// PlainDateTime은 기본 타임존(Asia/Seoul)으로 해석되어 변환
```

---

### `dateToZonedDateTime()`

```typescript
function dateToZonedDateTime(
  date: Date | null | undefined,
  timeZone?: string
): ZonedDateTime | null
```

JavaScript Date 객체를 지정된 타임존의 ZonedDateTime으로 변환합니다.

**매개변수**
- `date`: 변환할 Date 객체
- `timeZone` (선택): 대상 타임존 (기본값: "Asia/Seoul")

**반환값**
- `ZonedDateTime | null`: 지정된 타임존의 ZonedDateTime 객체

**사용 예제**
```typescript
const date = new Date('2024-01-15T05:30:00.000Z');
const zoned = dateToZonedDateTime(date);
console.log(zoned.timeZoneId); // "Asia/Seoul"
console.log(zoned.hour); // 14 (5:30 UTC = 14:30 KST)

// 다른 타임존으로 변환
const nyTime = dateToZonedDateTime(date, 'America/New_York');
console.log(nyTime.hour); // 0 (5:30 UTC = 00:30 EST)
```

---

### `dateToPlainDate()`

```typescript
function dateToPlainDate(
  date: Date | null | undefined,
  timeZone?: string
): PlainDate | null
```

JavaScript Date 객체를 PlainDate로 변환합니다.

**매개변수**
- `date`: 변환할 Date 객체
- `timeZone` (선택): 날짜 계산에 사용할 타임존 (기본값: "Asia/Seoul")

**반환값**
- `PlainDate | null`: 변환된 PlainDate 객체

**사용 예제**
```typescript
const date = new Date('2024-01-15T05:30:00.000Z');
const plainDate = dateToPlainDate(date);
console.log(plainDate.toString()); // "2024-01-15" (Asia/Seoul 기준)

// UTC 기준으로 변환
const utcPlainDate = dateToPlainDate(date, 'UTC');
console.log(utcPlainDate.toString()); // "2024-01-15" (UTC 기준)
```

---

### `dateToPlainDateTime()`

```typescript
function dateToPlainDateTime(
  date: Date | null | undefined,
  timeZone?: string
): PlainDateTime | null
```

JavaScript Date 객체를 PlainDateTime으로 변환합니다.

**매개변수**
- `date`: 변환할 Date 객체
- `timeZone` (선택): 계산에 사용할 타임존 (기본값: "Asia/Seoul")

**반환값**
- `PlainDateTime | null`: 변환된 PlainDateTime 객체

**사용 예제**
```typescript
const date = new Date('2024-01-15T05:30:00.000Z');
const plainDateTime = dateToPlainDateTime(date);
console.log(plainDateTime.toString()); // "2024-01-15T14:30:00" (Asia/Seoul 기준)

// UTC 기준으로 변환
const utcPlainDateTime = dateToPlainDateTime(date, 'UTC');
console.log(utcPlainDateTime.toString()); // "2024-01-15T05:30:00" (UTC 기준)
```
---

## 📝 Types

### `DateFormatType`

```typescript
type DateFormatType = "date" | "time" | "datetime" | "iso" | "custom"
```

`format()` 함수에서 사용하는 포맷 타입을 정의합니다.

---

### `WeekDay`

```typescript
type WeekDay = 1 | 2 | 3 | 4 | 5 | 6 | 7
```

ISO 표준 요일 번호입니다 (1=월요일, 7=일요일).

---

### `Holiday`

```typescript
interface Holiday {
  date: string;        // YYYY-MM-DD 형식의 날짜
  name: string;        // 공휴일 이름
  recurring?: boolean; // 매년 반복 여부 (기본값: false)
}
```

공휴일 정보를 정의하는 인터페이스입니다.

**사용 예제**
```typescript
const holidays: Holiday[] = [
  { date: '2024-01-01', name: '신정', recurring: true },
  { date: '2024-02-09', name: '설날', recurring: false },
  { date: '2024-03-01', name: '삼일절', recurring: true },
  { date: '2024-05-05', name: '어린이날', recurring: true }
];
```

---

### Temporal 타입 별칭

```typescript
type ZonedDateTime = Temporal.ZonedDateTime;    // 타임존 포함 날짜/시간
type PlainDate = Temporal.PlainDate;            // 날짜만
type PlainTime = Temporal.PlainTime;            // 시간만  
type PlainDateTime = Temporal.PlainDateTime;    // 타임존 없는 날짜/시간
type TimeZone = string;                         // 타임존 문자열
```

편의성과 일관성을 위한 Temporal API 객체들의 타입 별칭입니다.

---

## ⚠️ Errors

라이브러리에서 발생할 수 있는 커스텀 에러 타입들입니다.

### `DateError`

```typescript
class DateError extends Error
```

모든 il-gaemi 에러의 기본 클래스입니다.

---

### `InvalidDateFormatError`

```typescript
class InvalidDateFormatError extends DateError
```

지원하지 않는 날짜 형식을 사용했을 때 발생합니다.

**예제**
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

유효하지 않은 날짜 값을 사용했을 때 발생합니다.

**예제**
```typescript
try {
  format('2024-02-30', 'date'); // 2월 30일은 존재하지 않음
} catch (error) {
  console.log(error instanceof InvalidDateError); // true
}
```

---

### `UnsupportedFormatTypeError`

```typescript
class UnsupportedFormatTypeError extends DateError
```

지원하지 않는 포맷 타입을 사용했을 때 발생합니다.

**예제**
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

필수 매개변수가 누락되었을 때 발생합니다.

**예제**
```typescript
try {
  format('2024-01-15', 'custom'); // formatString 누락
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

호환되지 않는 연산을 시도했을 때 발생합니다.

**예제**
```typescript
try {
  const plainDate = Temporal.PlainDate.from('2024-01-15');
  format(plainDate, 'time'); // PlainDate는 시간 정보가 없음
} catch (error) {
  console.log(error instanceof IncompatibleOperationError); // true
  console.log(error.message); 
  // "Incompatible operation: formatting as time. Reason: PlainDate does not contain time information"
}
```

---

## 🔗 관련 문서

- [🚀 QuickStart](./QuickStart.md) - 빠른 시작 가이드

---

## 💡 지원하는 날짜 형식

라이브러리는 다음과 같은 다양한 날짜 형식을 자동으로 인식하고 파싱합니다:

- **ISO 형식**: `2024-01-15`, `2024-01-15T14:30:00`
- **타임존 포함**: `2024-01-15T14:30:00+09:00[Asia/Seoul]`
- **점 구분**: `2024.01.15`, `24.01.15`
- **슬래시 구분**: `2024/01/15`, `01/15/24`, `01/15/2024`
- **한국어 형식**: `2024년 1월 15일`, `2024년1월15일`
- **압축 형식**: `20240115`
- **유연한 구분**: `2024-1-15`, `2024.1.15`

모든 함수는 Temporal API를 기반으로 하여 정밀하고 안전한 날짜/시간 처리를 제공합니다. 
