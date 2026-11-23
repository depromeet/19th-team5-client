# 19th-team5-client

현직자의 질문으로 면접자와 면접관을 오가며 연습하는 메타버스 모의면접 서비스의 프론트엔드입니다.

## 실행 방법

### 요구 사항

- Node.js 24 (`.nvmrc`)
- pnpm 12 이상
- VS Code Biome 익스텐션 설치할 것 (저장 시 자동 포맷)

### 시작하기

```bash
nvm use
pnpm install                # Husky git hook도 함께 연결됩니다
cp .env.example .env.local
pnpm test:e2e:install       # 최초 1회, Playwright 브라우저 설치
pnpm dev                    # http://localhost:5173
```

### 스크립트

| 명령             | 설명                       |
| ---------------- | -------------------------- |
| `pnpm dev`       | 개발 서버                  |
| `pnpm build`     | 타입 검사 후 프로덕션 빌드 |
| `pnpm lint`      | Biome 검사 + 타입 검사     |
| `pnpm lint:fix`  | Biome 자동 수정            |
| `pnpm typecheck` | 타입 검사                  |
| `pnpm test`      | E2E 테스트 (Playwright)    |

### Git hook

| 시점                  | 동작                                |
| --------------------- | ----------------------------------- |
| 커밋 전               | `pnpm lint`                         |
| push 전               | 브랜치 이름 검사, `pnpm build`      |
| 브랜치 전환 · pull 후 | 패키지 변경이 있으면 `pnpm install` |

## CI

`main` 브랜치로 향하는 PR과 `main` push에서 [Verify](.github/workflows/verify.yml) 워크플로가 실행됩니다.

```
install → lint → typecheck → build → e2e
```

E2E가 실패하면 Playwright 리포트가 Artifact로 업로드됩니다(7일 보관).

## 기술 스택

| 영역          | 사용 기술                   |
| ------------- | --------------------------- |
| 코어          | React 19, TypeScript 7      |
| 빌드          | Vite 8                      |
| 라우팅        | React Router 8              |
| 상태 관리     | TanStack Query, Zustand     |
| HTTP          | Axios                       |
| 스타일링      | vanilla-extract (+ recipes) |
| 3D            | three.js, React Three Fiber |
| 코드 퀄리티   | Biome, Husky                |
| 테스트        | Playwright                  |
| 패키지 매니저 | pnpm 12                     |

## 디자인 토큰

앱 시작 시 SVG 디자인 시스템의 값을 `:root`에 등록합니다. 각 화면의
`*.css.ts`에서 `@/styles/tokens.css`의 `tokens`를 가져와 사용합니다.

```ts
import { style } from '@vanilla-extract/css';
import { tokens } from '@/styles/tokens.css';

export const title = style({
  ...tokens.typography.h1,
  color: tokens.color.text.title,
  marginBottom: tokens.space[32],
});
```

`tokens.grid`에는 1920px 데스크톱 그리드와 화면별 분할 값이,
`tokens.component`에는 로고·아이콘·출입증·버튼·입력·다이얼로그·GNB의 스타일 값이 있습니다.
컴포넌트별 토큰은 `src/components/<이름>/<이름>.css.ts`에서 관리합니다.
브랜드 색은 `src/styles/colors.css.ts`의 `brandPrimary`에서 변경합니다.
Primary 50~900과 이를 참조하는 링크·GNB 버튼·방문증 색상이 함께 바뀝니다.
일반 Primary 버튼의 배경은 시안에 지정된 임시 블랙(`neutral[900]`)입니다.
