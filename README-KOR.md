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

## 📚 문서

자세한 사용법과 API 참조는 다음 문서를 확인하세요:

- [🚀 빠른 시작 가이드](docs/KOR/QuickStart.md) - 5분 만에 시작하기
- [📖 API 참조](docs/KOR/API-Reference.md) - 모든 함수와 타입의 상세 문서

## 🏗️ 모듈 구조

라이브러리는 여러 모듈로 구성되어 있습니다:

- **Date 모듈**: 영업일 계산 및 주차 유틸리티
- **Format 모듈**: 다양한 출력 스타일의 날짜/시간 포맷팅
- **Timezone 모듈**: 타임존 변환 및 관리
- **Types 모듈**: TypeScript 타입 정의

```typescript
// 특정 함수만 가져오기
import { isWorkday, getWeekDay } from '@zwoninstitute/il-gaemi';

// 모든 것 가져오기
import * as DateUtils from '@zwoninstitute/il-gaemi';

// 타입만 가져오기
import type { Holiday, WeekDay, DateFormatType } from '@zwoninstitute/il-gaemi';
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