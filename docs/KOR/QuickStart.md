# 🚀 QuickStart Guide

**il-gaemi** 라이브러리를 사용하여 빠르게 시작하는 방법을 안내합니다.

## 📦 설치

다음 명령어 중 하나를 사용하여 라이브러리를 설치하세요:

```bash
# npm 사용
npm install @zwoninstitute/il-gaemi

# yarn 사용
yarn add @zwoninstitute/il-gaemi

# bun 사용
bun add @zwoninstitute/il-gaemi
```

## 🏃‍♂️ 5분 만에 시작하기

### 1. 기본 import

```typescript
import { 
  isWorkday, 
  format, 
  formatKorean, 
  getNow, 
  getNextWorkday 
} from '@zwoninstitute/il-gaemi';
```

### 2. 현재 시간 가져오기

```typescript
// 한국 시간(KST)으로 현재 시간 가져오기
const now = getNow();
console.log(now.toString()); 
// 출력: "2024-01-15T14:30:00+09:00[Asia/Seoul]"

// UTC 시간으로 현재 시간 가져오기
import { getNowUTC } from '@zwoninstitute/il-gaemi';
const nowUTC = getNowUTC();
console.log(nowUTC.toString()); 
// 출력: "2024-01-15T05:30:00+00:00[UTC]"
```

### 3. 영업일 확인하기

```typescript
// 오늘이 영업일인지 확인
const today = getNow();
const isTodayWorkday = isWorkday(today);
console.log(`오늘은 영업일인가요? ${isTodayWorkday ? '네' : '아니오'}`);

// 특정 날짜가 영업일인지 확인
const isMonday = isWorkday('2024-01-15'); // true (월요일)
const isSaturday = isWorkday('2024-01-13'); // false (토요일)
```

### 4. 다음 영업일 찾기

```typescript
// 다음 영업일 찾기
const nextWorkday = getNextWorkday(today);
console.log(`다음 영업일: ${format(nextWorkday, 'date')}`);
// 출력: "다음 영업일: 2024-01-16"
```

### 5. 날짜 포맷팅

```typescript
const date = '2024-01-15T14:30:00';

// 다양한 형식으로 포맷팅
console.log(format(date, 'date'));     // "2024-01-15"
console.log(format(date, 'time'));     // "14:30:00"
console.log(format(date, 'datetime')); // "2024-01-15 14:30:00"

// 한국 스타일로 포맷팅
console.log(formatKorean(date)); // "2024년 1월 15일"

// 상대 시간 표현
import { formatRelative } from '@zwoninstitute/il-gaemi';
const yesterday = getNow().subtract({ days: 1 });
console.log(formatRelative(yesterday)); // "1일 전"
```

### 6. 공휴일을 고려한 영업일 계산

```typescript
// 공휴일 목록 정의
const koreanHolidays = [
  { date: '2024-01-01', recurring: true },  // 신정 (매년 반복)
  { date: '2024-02-09', recurring: false }, // 설날 (2024년만)
  { date: '2024-03-01', recurring: true },  // 삼일절 (매년 반복)
  { date: '2024-05-05', recurring: true },  // 어린이날 (매년 반복)
];

// 공휴일을 고려한 영업일 확인
const isNewYearWorkday = isWorkday('2024-01-01', koreanHolidays); 
console.log(isNewYearWorkday); // false

// 공휴일을 고려한 다음 영업일 찾기
const nextWorkdayWithHolidays = getNextWorkday('2024-12-31', koreanHolidays);
console.log(format(nextWorkdayWithHolidays, 'date')); // "2024-01-02" (신정 제외)
```

### 7. 타임존 변환

```typescript
import { convertToZonedDateTime, toUTC, fromUTC } from '@zwoninstitute/il-gaemi';

// 문자열을 한국 시간으로 변환
const koreanTime = convertToZonedDateTime('2024-01-15T14:30:00', 'Asia/Seoul');

// 한국 시간을 UTC로 변환
const utcTime = toUTC(koreanTime);
console.log(format(utcTime, 'datetime')); // "2024-01-15 05:30:00"

// UTC를 다시 한국 시간으로 변환
const backToKorean = fromUTC(utcTime, 'Asia/Seoul');
console.log(format(backToKorean, 'datetime')); // "2024-01-15 14:30:00"
```

## 🎯 주요 사용 사례

### 📅 비즈니스 일정 관리

```typescript
import { getNextWorkday, getPreviousWorkday, getWeekDay } from '@zwoninstitute/il-gaemi';

const today = getNow();

// 이번 주 몇 번째 영업일인지 확인
const weekday = getWeekDay(today);
console.log(`오늘은 ${weekday}요일입니다`); // 1=월요일, 7=일요일

// 이전/다음 영업일
const prevWorkday = getPreviousWorkday(today);
const nextWorkday = getNextWorkday(today);

console.log(`이전 영업일: ${formatKorean(prevWorkday)}`);
console.log(`다음 영업일: ${formatKorean(nextWorkday)}`);
```

### 📊 월별 주차 계산

```typescript
import { getWeekNum } from '@zwoninstitute/il-gaemi';

const date = '2024-01-15';
const weekInfo = getWeekNum(date);

console.log(`${weekInfo.year}년 ${weekInfo.month}월 ${weekInfo.weekNum}주차`);
// 출력: "2024년 1월 3주차"
```

### 🌐 다국가 서비스 시간 관리

```typescript
import { getTimeZoneOffset } from '@zwoninstitute/il-gaemi';

// 한국과 미국 동부 시간의 차이 계산
const offset = getTimeZoneOffset('Asia/Seoul', 'America/New_York');
console.log(`한국과 뉴욕의 시차: ${offset}시간`);
```

## 🔧 고급 사용법

### 커스텀 주말 정의

```typescript
// 금요일-토요일을 주말로 설정 (중동 지역 스타일)
const customWeekends = [5, 6]; // 5=금요일, 6=토요일

const isFridayWorkday = isWorkday('2024-01-12', [], customWeekends);
console.log(isFridayWorkday); // false (금요일이 주말)
```

### 유연한 날짜 파싱

```typescript
// 다양한 형식의 날짜 문자열을 자동으로 파싱
const dates = [
  '2024-01-15',      // ISO 형식
  '2024.01.15',      // 점 구분
  '2024/01/15',      // 슬래시 구분
  '2024년 1월 15일',  // 한국어 형식
  '20240115'         // 압축 형식
];

dates.forEach(dateStr => {
  console.log(`${dateStr} → ${format(dateStr, 'datetime')}`);
});
```

## 🚨 주의사항

1. **Temporal API**: 이 라이브러리는 최신 Temporal API를 사용합니다. 폴리필이 자동으로 포함되어 있습니다.

2. **타임존**: 기본 타임존은 `Asia/Seoul`(한국 표준시)입니다.

3. **영업일**: 기본적으로 토요일(6)과 일요일(7)을 주말로 간주합니다.

4. **공휴일**: 공휴일 목록은 직접 정의해야 합니다. 라이브러리에는 기본 공휴일이 포함되어 있지 않습니다.

## 🔗 다음 단계

- 📖 [API 레퍼런스](./API-Reference.md) - 모든 함수의 상세한 문서

---

💡 **팁**: 더 많은 예제와 사용법은 프로젝트의 `tests/` 폴더에서 확인할 수 있습니다! 