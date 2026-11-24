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

| 명령                   | 설명                                        |
| ---------------------- | ------------------------------------------- |
| `pnpm dev`             | 개발 서버                                   |
| `pnpm build`           | 타입 검사 후 프로덕션 빌드                  |
| `pnpm lint`            | Biome 검사 + 타입 검사                      |
| `pnpm lint:fix`        | Biome 자동 수정                             |
| `pnpm typecheck`       | 타입 검사                                   |
| `pnpm test`            | E2E 테스트 (Playwright)                     |
| `pnpm storybook`       | Storybook 개발 서버 (http://localhost:6006) |
| `pnpm build-storybook` | Storybook 정적 빌드 (`storybook-static/`)   |

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
| 아이콘        | SVGR (vite-plugin-svgr)     |
| 폼            | React Hook Form             |
| 3D            | three.js, React Three Fiber |
| 컴포넌트 문서 | Storybook 10                |
| 코드 퀄리티   | Biome, Husky                |
| 테스트        | Playwright                  |
| 패키지 매니저 | pnpm 12                     |

## 디자인 토큰

Figma 「디자인 시스템」(DS/01~03)의 값을 `src/styles/token/`에 `as const` 상수로 정의합니다.
CSS 변수로 등록하지 않으므로 recipe·style과 JS(three.js 등)에서 같은 값을 그대로 씁니다.

| 계층       | 파일                                  | 내용                                                               |
| ---------- | ------------------------------------- | ------------------------------------------------------------------ |
| Primitive  | `src/styles/token/primitives.ts`      | color, fontFamily, fontSize, fontWeight, lineHeight, space, radius |
| Foundation | `src/styles/token/foundations.ts`     | typography (Figma 텍스트 스타일 13개)                              |
| Component  | `src/components/<이름>/<이름>.css.ts` | recipe·style로 작성하는 컴포넌트 스타일                            |

```ts
import { style } from '@vanilla-extract/css';
import { color, space, typography } from '@/styles/token';

export const title = style({
  ...typography.h1,
  color: color.neutral[900],
  marginBottom: space[32],
});
```

- 토큰은 primitive → foundation → component 한 방향으로만 소비합니다.
  `src/styles/`는 `src/components/`를 import하지 않습니다.
- 길이 값은 모두 px 문자열, fontWeight는 숫자입니다.
- Semantic 토큰은 디자인 파트와 확정되지 않아 두지 않습니다.
  컴포넌트 고유 값(폭, 그림자, Dim 등)은 각 컴포넌트의 `.css.ts`에 정의합니다.
- Primary 색이 바뀌면 디자인 파트가 전달한 값으로 `primitives.ts`를 교체합니다.
