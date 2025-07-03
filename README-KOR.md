# il-gaemi 🐜

<div align="center">
<img src="ilgaemi.png" alt="il-gaemi Logo" width=200>
</div>

Temporal API 기반의 포괄적인 TypeScript 날짜/시간 유틸리티 라이브러리로, 한국 현지화와 영업일 계산에 특화되어 있습니다.

## ✨ 주요 기능

- **🏢 영업일 계산**: 주말과 공휴일을 제외한 영업일 판단 및 계산
- **🎨 유연한 날짜 포맷팅**: 한국어 형식 포함 다양한 출력 형식 지원
- **🌏 타임존 관리**: 한국 표준시 기본 지원으로 타임존 간 변환 용이
- **⚡ Temporal API 통합**: 최신 Temporal API 기반의 정확하고 안정적인 날짜/시간 처리
- **🔒 타입 안전성**: 완전한 TypeScript 지원 및 포괄적인 타입 정의
- **🇰🇷 한국어 현지화**: 한국어 날짜 형식 및 비즈니스 캘린더 기본 지원

## 📦 설치

```bash
# npm 사용
npm install @zwoninstitute/il-gaemi

# yarn 사용
yarn add @zwoninstitute/il-gaemi

# bun 사용
bun add @zwoninstitute/il-gaemi
```

## 🚀 빠른 시작

```typescript
import { isWorkday, format, getNow, getNextWorkday, formatKorean } from '@zwoninstitute/il-gaemi';

// 오늘이 영업일인지 확인
const today = getNow();
console.log(isWorkday(today)); // true/false

// 다양한 형식으로 날짜 포맷
console.log(format(today, 'date')); // "2024-01-15"
console.log(format(today, 'datetime')); // "2024-01-15 14:30:00"
console.log(formatKorean(today)); // "2024년 1월 15일"

// 다음 영업일 찾기
const nextWorkday = getNextWorkday(today);
console.log(format(nextWorkday, 'date')); // 다음 영업일

// 타임존 작업
const utcTime = getNowUTC();
const koreanTime = convertToZonedDateTime(utcTime, 'Asia/Seoul');
```

## 📚 API 참조

### 🗓️ 날짜 함수들

#### `isWorkday(date, holidayList?, dayOffWeekdays?)`
주어진 날짜가 영업일인지 판단합니다.

```typescript
// 기본 사용법
isWorkday('2024-01-15'); // true (월요일)
isWorkday('2024-01-13'); // false (토요일)

// 공휴일 포함
const holidays = [
  { date: '2024-01-01', recurring: false }, // 신정
  { date: '2024-12-25', recurring: true }   // 크리스마스 (매년 반복)
];
isWorkday('2024-01-01', holidays); // false

// 커스텀 주말 (금요일-토요일)
isWorkday('2024-01-12', [], [5, 6]); // false
```

#### `getNextWorkday(date, holidayList?, dayOffWeekdays?)`
주어진 날짜 이후의 다음 영업일을 찾습니다.

```typescript
// 금요일 다음 영업일 찾기
const nextWorkday = getNextWorkday('2024-01-12'); // 2024-01-15 (월요일)

// 공휴일 고려
const holidays = [{ date: '2024-01-15', recurring: false }];
const nextWorkday2 = getNextWorkday('2024-01-12', holidays); // 2024-01-16 (화요일)
```

#### `getPreviousWorkday(date, holidayList?, dayOffWeekdays?)`
주어진 날짜 이전의 이전 영업일을 찾습니다.

```typescript
// 월요일 이전 영업일 찾기
const prevWorkday = getPreviousWorkday('2024-01-15'); // 2024-01-12 (금요일)
```

#### `getWeekDay(date)`
ISO 요일 번호를 반환합니다 (1=월요일, 7=일요일).

```typescript
const weekday1 = getWeekDay('2024-01-15'); // 1 (월요일)
const weekday2 = getWeekDay('2024-01-14'); // 7 (일요일)
```

#### `getWeekNum(date)`
해당 월에서 몇 번째 주인지 계산합니다.

```typescript
const week = getWeekNum('2024-01-15'); 
// { year: 2024, month: 1, weekNum: 3 }
```

### 🎨 포맷 함수들

#### `format(date, type?, formatString?)`
미리 정의된 타입이나 커스텀 패턴으로 날짜를 포맷합니다.

```typescript
const date = '2024-01-15T14:30:00';

// 기본 포맷 타입들
format(date, 'date');     // "2024-01-15"
format(date, 'time');     // "14:30:00"
format(date, 'datetime'); // "2024-01-15 14:30:00"
format(date, 'iso');      // "2024-01-15T14:30:00"

// 커스텀 포맷팅
format(date, 'custom', 'YYYY/MM/DD HH:mm'); // "2024/01/15 14:30"
format(date, 'custom', 'YYYY년 M월 D일');   // "2024년 1월 15일"
format(date, 'custom', 'M/D/YY');           // "1/15/24"
```

**지원하는 포맷 토큰:**
- `YYYY`: 4자리 연도 (예: 2024)
- `YY`: 2자리 연도 (예: 24)
- `MM`: 0이 붙은 2자리 월 (예: 01, 12)
- `M`: 0이 없는 월 (예: 1, 12)
- `DD`: 0이 붙은 2자리 일 (예: 01, 31)
- `D`: 0이 없는 일 (예: 1, 31)
- `HH`: 0이 붙은 2자리 시간 (예: 00, 23)
- `H`: 0이 없는 시간 (예: 0, 23)
- `mm`: 0이 붙은 2자리 분 (예: 00, 59)
- `m`: 0이 없는 분 (예: 0, 59)
- `ss`: 0이 붙은 2자리 초 (예: 00, 59)
- `s`: 0이 없는 초 (예: 0, 59)

#### `formatKorean(date)`
한국어 스타일로 날짜를 포맷합니다.

```typescript
formatKorean('2024-01-15'); // "2024년 1월 15일"
formatKorean('2024-12-25'); // "2024년 12월 25일"
```

#### `formatRelative(date, baseDate?)`
한국어로 상대적 시간 표현을 반환합니다.

```typescript
const now = getNow();
const yesterday = now.subtract({ days: 1 });
const tomorrow = now.add({ days: 1 });
const twoHoursLater = now.add({ hours: 2 });
const fiveMinutesAgo = now.subtract({ minutes: 5 });

formatRelative(yesterday);      // "1일 전"
formatRelative(tomorrow);       // "1일 후" 
formatRelative(twoHoursLater);  // "2시간 후"
formatRelative(fiveMinutesAgo); // "5분 전"

// 매우 최근 시간
const justNow = now.subtract({ seconds: 30 });
formatRelative(justNow); // "방금 전"
```

### 🌏 타임존 함수들

#### `getNow()` / `getNowUTC()`
Asia/Seoul 또는 UTC 타임존의 현재 시간을 가져옵니다.

```typescript
const now = getNow();     // 한국 표준시 현재 시간
const nowUTC = getNowUTC(); // UTC 현재 시간

console.log(now.toString());    // "2024-01-15T14:30:00+09:00[Asia/Seoul]"
console.log(nowUTC.toString()); // "2024-01-15T05:30:00+00:00[UTC]"
```

#### `convertToZonedDateTime(date, timeZone?)`
모든 날짜를 지정된 타임존의 ZonedDateTime으로 변환합니다.

```typescript
// 문자열에서 변환 (날짜만 있을 경우 해당 타임존의 자정으로 설정)
const zoned1 = convertToZonedDateTime('2024-01-15');
// "2024-01-15T00:00:00+09:00[Asia/Seoul]"

// ISO 날짜시간 문자열에서 변환
const zoned2 = convertToZonedDateTime('2024-01-15T12:00:00Z', 'America/New_York');
// "2024-01-15T07:00:00-05:00[America/New_York]"

// 기존 ZonedDateTime의 타임존 변경
const existing = getNowUTC();
const converted = convertToZonedDateTime(existing, 'Asia/Tokyo');
// 같은 순간, 다른 타임존 표현
```

#### `toUTC(zonedDateTime)` / `fromUTC(utcDateTime, timeZone?)`
UTC와 다른 타임존 간 변환을 수행합니다.

```typescript
// 한국 시간을 UTC로 변환
const kst = getNow();
const utc = toUTC(kst);
console.log(kst.toString()); // "2024-01-15T14:30:00+09:00[Asia/Seoul]"
console.log(utc.toString()); // "2024-01-15T05:30:00+00:00[UTC]"

// UTC를 다른 타임존으로 변환
const est = fromUTC(utc, 'America/New_York');
console.log(est.toString()); // "2024-01-15T00:30:00-05:00[America/New_York]"
```

#### `getTimeZoneOffset(fromTimeZone, toTimeZone, referenceDate?)`
타임존 간의 시간 차이를 시간 단위로 계산합니다.

```typescript
// UTC와 다른 타임존 간의 차이
const utcToKst = getTimeZoneOffset('UTC', 'Asia/Seoul');
console.log(utcToKst); // 9 (KST는 UTC+9)

const utcToEst = getTimeZoneOffset('UTC', 'America/New_York');
console.log(utcToEst); // -5 (EST는 UTC-5) 또는 -4 (EDT는 UTC-4)

// 타임존 간 직접 비교
const kstToJst = getTimeZoneOffset('Asia/Seoul', 'Asia/Tokyo');
console.log(kstToJst); // 0 (둘 다 UTC+9)
```

## 🏗️ 모듈 구조

라이브러리는 여러 모듈로 구성되어 있습니다:

- **Date 모듈**: 영업일 계산 및 주차 유틸리티
- **Format 모듈**: 다양한 출력 스타일의 날짜/시간 포맷팅
- **Timezone 모듈**: 타임존 변환 및 관리
- **Types 모듈**: TypeScript 타입 정의

```typescript
// 특정 함수만 가져오기
import { isWorkday, getWeekDay } from '@zwongroup/il-gaemi';

// 모든 것 가져오기
import * as DateUtils from '@zwongroup/il-gaemi';

// 타입만 가져오기
import type { Holiday, WeekDay, DateFormatType } from '@zwongroup/il-gaemi';
```

## 🔧 고급 사용법

### 한국 공휴일 목록 만들기

```typescript
const koreanHolidays = [
  // 고정 공휴일 (매년 같은 날짜)
  { date: '2024-01-01', recurring: true },  // 신정
  { date: '2024-03-01', recurring: true },  // 삼일절
  { date: '2024-05-05', recurring: true },  // 어린이날
  { date: '2024-06-06', recurring: true },  // 현충일
  { date: '2024-08-15', recurring: true },  // 광복절
  { date: '2024-10-03', recurring: true },  // 개천절
  { date: '2024-10-09', recurring: true },  // 한글날
  { date: '2024-12-25', recurring: true },  // 크리스마스
  
  // 변동 공휴일 (연도별로 다른 날짜)
  { date: '2024-02-09', recurring: false }, // 2024년 설날 (전날)
  { date: '2024-02-10', recurring: false }, // 2024년 설날
  { date: '2024-02-11', recurring: false }, // 2024년 설날 (다음날)
  { date: '2024-02-12', recurring: false }, // 2024년 설날 대체공휴일
  { date: '2024-04-10', recurring: false }, // 2024년 총선일
  { date: '2024-05-06', recurring: false }, // 2024년 어린이날 대체공휴일
  { date: '2024-05-15', recurring: false }, // 2024년 부처님오신날
];

// 영업일 확인
const isBusinessDay1 = isWorkday('2024-03-01', koreanHolidays); // false (삼일절)
const isBusinessDay2 = isWorkday('2024-02-12', koreanHolidays); // false (설날 대체공휴일)
const isBusinessDay3 = isWorkday('2024-03-04', koreanHolidays); // true (평일)
```

### 유연한 날짜 파싱

라이브러리는 다양한 날짜 형식을 자동으로 인식합니다:

```typescript
// 다양한 입력 형식 지원
format('2024-01-15');       // ISO 형식
format('2024.01.15');       // 점으로 구분
format('2024/01/15');       // 슬래시로 구분
format('2024년 1월 15일');   // 한국어 형식
format('20240115');         // 압축 형식
format('2024-1-15');        // 0이 없는 형식

// 시간 포함 형식
format('2024-01-15T14:30:00');                    // ISO 날짜시간
format('2024-01-15T14:30:00+09:00[Asia/Seoul]');  // 타임존 포함

// 모든 형식이 동일한 결과를 출력
const date1 = format('2024-01-15', 'korean');     // "2024년 1월 15일"
const date2 = format('2024.01.15', 'korean');     // "2024년 1월 15일"
const date3 = format('2024년 1월 15일', 'korean'); // "2024년 1월 15일"
```

### 커스텀 주말 설정

일부 국가나 조직에서는 다른 요일을 주말로 사용합니다:

```typescript
// 금요일-토요일을 주말로 설정 (중동 지역)
const isFridayWorkday = isWorkday('2024-01-12', [], [5, 6]); // false (금요일)
const isSundayWorkday = isWorkday('2024-01-14', [], [5, 6]); // true (일요일)

// 토요일만 주말로 설정
const saturdayOnly = isWorkday('2024-01-13', [], [6]); // false (토요일)
const sundayWorkday = isWorkday('2024-01-14', [], [6]); // true (일요일)
```

### 주차 계산 활용

```typescript
// 월별 주차 계산
const week1 = getWeekNum('2024-01-01'); // 1월 1주
const week2 = getWeekNum('2024-01-08'); // 1월 2주
const week3 = getWeekNum('2024-01-15'); // 1월 3주

console.log(week1); // { year: 2024, month: 1, weekNum: 1 }
console.log(week2); // { year: 2024, month: 1, weekNum: 2 }
console.log(week3); // { year: 2024, month: 1, weekNum: 3 }

// 월말/월초 경계에서의 주차 계산
const lastWeekOfMonth = getWeekNum('2024-01-31');
const firstWeekOfNextMonth = getWeekNum('2024-02-01');
```

### 비즈니스 로직 예제

```typescript
// 급여일 계산 (매월 25일, 주말/공휴일이면 이전 영업일)
function getPayrollDate(year: number, month: number, holidays: Holiday[]) {
  const payrollDate = Temporal.PlainDate.from({ year, month, day: 25 });
  
  if (isWorkday(payrollDate, holidays)) {
    return payrollDate;
  } else {
    return getPreviousWorkday(payrollDate, holidays);
  }
}

// 프로젝트 마감일 계산 (영업일 기준 N일 후)
function getProjectDeadline(startDate: string, businessDays: number, holidays: Holiday[]) {
  let currentDate = Temporal.PlainDate.from(startDate);
  let remainingDays = businessDays;
  
  while (remainingDays > 0) {
    currentDate = getNextWorkday(currentDate, holidays);
    remainingDays--;
  }
  
  return currentDate;
}

// 사용 예
const koreanHolidays = [/* ... 공휴일 목록 ... */];
const payroll = getPayrollDate(2024, 1, koreanHolidays);
const deadline = getProjectDeadline('2024-01-15', 10, koreanHolidays);

console.log(`급여일: ${formatKorean(payroll)}`);
console.log(`마감일: ${formatKorean(deadline)}`);
```

## 🚨 주의사항

### Temporal API Polyfill

이 라이브러리는 Temporal API를 사용합니다. Temporal API가 아직 모든 브라우저에서 네이티브로 지원되지 않으므로, 폴리필을 포함하고 있습니다.

### 타임존 처리

- 기본 타임존은 `Asia/Seoul` (한국 표준시)입니다
- 타임존 변환 시 일광절약시간(DST) 규칙이 자동으로 적용됩니다
- 정확한 계산을 위해 참조 날짜를 제공하는 것을 권장합니다

### 공휴일 데이터

- 공휴일 목록은 사용자가 직접 관리해야 합니다
- `recurring: true`는 매년 같은 날짜의 공휴일에 사용합니다
- `recurring: false`는 특정 연도의 공휴일이나 대체공휴일에 사용합니다

## 📄 라이센스

MIT

## 🤝 기여하기

기여를 환영합니다! Pull Request를 자유롭게 제출해 주세요.

## 🐛 버그 리포트

버그를 발견하시면 [GitHub Issues](https://github.com/zwoninstitute/il-gaemi/issues)에 신고해 주세요.

---

*il-gaemi (일개미) - 개미처럼 열심히 일해서 날짜 처리를 쉽게 만들어 드립니다* 🐜 