# il-gaemi 🐜

<div align="center">
<img src="ilgaemi.png" alt="il-gaemi Logo" width=200>
</div>

Temporal API 기반의 포괄적인 TypeScript 날짜/시간 유틸리티 라이브러리로, 한국 현지화, 영업일 계산, 그리고 TypeORM 통합에 특화되어 있습니다.

## ✨ 주요 기능

- **🏢 영업일 계산**: 주말과 공휴일을 제외한 영업일 판단 및 계산
- **🎨 유연한 날짜 포맷팅**: 한국어 형식 포함 다양한 출력 형식 지원
- **🌏 타임존 관리**: 한국 표준시 기본 지원으로 타임존 간 변환 용이
- **🗄️ TypeORM 통합**: 데이터베이스 저장을 위한 자동 변환 및 transformer 제공
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

# TypeORM 사용 시 (선택사항)
npm install typeorm
```

## 🚀 빠른 시작

### 기본 사용법

```typescript
import { 
  getNow, 
  format, 
  isWorkday, 
  getNextWorkday,
  formatKorean,
  formatRelative 
} from '@zwoninstitute/il-gaemi';

// 현재 시간 (한국 표준시)
const now = getNow();
console.log(format(now, 'datetime')); // "2024-01-15 14:30:00"

// 다양한 포맷팅
console.log(format(now, 'date'));        // "2024-01-15"
console.log(formatKorean(now));          // "2024년 1월 15일"
console.log(formatRelative(now));        // "방금 전"

// 영업일 계산
const today = now.toPlainDate();
console.log(isWorkday(today));           // true/false

const nextWorkday = getNextWorkday(today);
console.log(format(nextWorkday, 'date')); // 다음 영업일
```

### TypeORM 통합

```typescript
// entity/User.ts
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { 
  ZonedDateTime, 
  PlainDate, 
  ZonedDateTimeTransformer, 
  PlainDateTransformer 
} from '@zwoninstitute/il-gaemi';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({
    type: 'timestamp',
    transformer: ZonedDateTimeTransformer
  })
  createdAt: ZonedDateTime;

  @Column({
    type: 'date',
    transformer: PlainDateTransformer,
    nullable: true
  })
  birthDate: PlainDate | null;
}

// service/UserService.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { getNow } from '@zwoninstitute/il-gaemi';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async createUser(name: string): Promise<User> {
    const user = new User();
    user.name = name;
    user.createdAt = getNow(); // 자동으로 한국 시간으로 설정

    return this.userRepository.save(user);
    // 데이터베이스에는 Date 객체로 자동 변환되어 저장
  }
}
```

## 📚 문서

자세한 사용법과 API 참조는 다음 문서를 확인하세요:

- [🚀 빠른 시작 가이드](docs/KOR/QuickStart.md) - 5분 만에 시작하기
- [📖 API 참조](docs/KOR/API-Reference.md) - 모든 함수와 타입의 상세 문서
- [🗄️ TypeORM 통합 가이드](docs/KOR/TypeORM-Integration.md) - 데이터베이스 통합 방법

## 🏗️ 모듈 구조

라이브러리는 여러 모듈로 구성되어 있습니다:

- **Date 모듈**: 영업일 계산 및 주차 유틸리티
- **Format 모듈**: 다양한 출력 스타일의 날짜/시간 포맷팅
- **Timezone 모듈**: 타임존 변환 및 관리
- **TypeORM 모듈**: 데이터베이스 통합 유틸리티 및 transformer
- **Types 모듈**: TypeScript 타입 정의

```typescript
// 특정 함수만 가져오기
import { isWorkday, getWeekDay } from '@zwoninstitute/il-gaemi';

// TypeORM 관련 기능
import { 
  ZonedDateTimeTransformer, 
  temporalToDate,
  dateToZonedDateTime 
} from '@zwoninstitute/il-gaemi';

// 모든 것 가져오기
import * as DateUtils from '@zwoninstitute/il-gaemi';

// 타입만 가져오기
import type { Holiday, WeekDay, DateFormatType } from '@zwoninstitute/il-gaemi';
```

## 🗄️ TypeORM 주요 기능

### 자동 변환 Transformer

```typescript
// 기본 제공 transformer들
ZonedDateTimeTransformer    // 타임존 정보가 있는 날짜/시간
PlainDateTransformer        // 날짜만
PlainDateTimeTransformer    // 타임존 없는 날짜/시간

// 커스텀 타임존 transformer
const UTCTransformer = createZonedDateTimeTransformer('UTC');
const NYTransformer = createZonedDateTimeTransformer('America/New_York');
```

### 수동 변환 함수

```typescript
// Temporal → Date 변환 (데이터베이스 저장용)
const jsDate = temporalToDate(zonedDateTime);

// Date → Temporal 변환 (데이터베이스에서 읽기용)
const zoned = dateToZonedDateTime(jsDate);
const plain = dateToPlainDate(jsDate);
const plainDT = dateToPlainDateTime(jsDate);
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

### TypeORM 통합

- TypeORM은 선택적 의존성(peer dependency)입니다
- Transformer는 자동으로 null 값을 처리합니다
- 대량 데이터 처리 시 성능을 고려하여 사용하세요

## 📄 라이센스

MIT

## 🤝 기여하기

기여를 환영합니다! Pull Request를 자유롭게 제출해 주세요.

## 🐛 버그 리포트

버그를 발견하시면 [GitHub Issues](https://github.com/zwoninstitute/il-gaemi/issues)에 신고해 주세요.

---

*il-gaemi (일개미) - 개미처럼 열심히 일해서 날짜 처리를 쉽게 만들어 드립니다* 🐜 