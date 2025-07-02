# Temporal 기반 사내 유틸리티 패키지 PRD

## 📌 개요

`@zwongroup/zwon-date-utils`는 JavaScript Temporal을 활용하여 사내 백엔드 및 프론트엔드에서 공통으로 사용할 수 있는 날짜/시간 유틸리티 기능을 제공하는 npm 패키지입니다. 이 패키지는 비즈니스 도메인에 맞는 시간 계산, 타임존 처리, 날짜 포맷팅 등을 표준화합니다.

---

## ❗ 문제 정의

- 기존 JavaScript `Date` 객체는 타임존 처리와 일관성 부족으로 인해 오류 가능성이 높음
- 프로젝트마다 시간 계산 로직이 중복되고 검증되지 않은 상태로 유지됨
- DST, 공휴일, 영업일 등 사내 비즈니스 규칙을 날짜 계산에 반영하기 어려움
- 백엔드(NestJS)에서 일관된 시간 계산 기준 필요

---

## 🎯 목표

- JavaScript `Temporal` 기반으로 사내 비즈니스 규칙을 반영한 날짜/시간 유틸리티 제공
- 모든 날짜/시간 연산은 불변성(immutable)을 보장
- 타임존, 영업일 계산, ISO 포맷팅 등 실무에서 자주 사용되는 기능을 공통화
- 백엔드(NestJS)에서 사용할 수 있는 구조 제공

---

## 🧩 주요 기능

### 날짜 계산
- `isWorkday(date, holydayList)` : 해당 날짜가 영업일인지 판별
- `getWeekDay(date)`: 해당 날짜의 요일을 반환함
- `getWeekNum(date)`: 해당 날짜가 해당 월에서 몇 번째 주에 해당하는지 반환함. 


### 타임존 처리
- `getNow()`: Asia/Seoul 기준 현재 시간 반환
- `convertToZonedDateTime(date, timeZone)`: 특정 타임존으로 시간 변환


### 포맷팅
- `format(date, type, formatString?)`: Temporal 객체를 문자열로 포맷팅. type에 따라 정해진 포맷으로 반환하거나 formatString으로 전달한 포맷으로 변환

---

## 🛠 기술 스택

- **언어**: TypeScript
- **Temporal**: `@js-temporal/polyfill` (Node.js 18 이하 또는 브라우저 지원 목적)
- **번들러**: `tsup` (향후 `rolldown` 평가 예정)
- **테스트**: `vitest`
- **패키지 배포**: 사내 npm registry 또는 public npm

---

## 🧪 사용 시나리오 예시

1. **리포트 자동 생성 스케줄**
   - 매월 영업일 기준 마지막 날에 리포트 자동 생성
   - 휴일이 겹칠 경우 직전 영업일로 조정

2. **글로벌 사용자 이벤트 시간 계산**
   - 사용자의 타임존 기준으로 이벤트 시간 표시
   - 서버 시간은 UTC 기준으로 기록

3. **프론트/백엔드 공통 날짜 포맷**
   - `formatDate` 함수로 일관된 형식 제공 (`YYYY-MM-DD`, `HH:mm` 등)

---

## 🔭 향후 확장 계획

- 로케일 기반 포맷 (`Intl.DateTimeFormat` 통합)
- 정기 스케줄 반복 계산 (`every 2nd Tuesday`)
- rollup/rolldown 기반 번들 최적화 시도

---

## 📎 참고

- Temporal proposal: https://tc39.es/proposal-temporal/
- Polyfill: https://github.com/tc39/proposal-temporal