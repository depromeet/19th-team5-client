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

랜딩과 로그인·회원가입 진입점은 `/`에 있습니다. 역할별 로비와 리뷰 화면을 확인하는 프로토타입 홈은 `/prototype`에서 열 수 있습니다.

회원가입은 계정 정보 → 아바타 → 이력서 → 방문 출입증 → 대기실 순서로 진행합니다. 로그인에 성공하면 대기실로 이동합니다. 가입을 중단했다면 랜딩의 **가입 이어하기**로 돌아갈 수 있습니다. 가입 초안과 발급 정보는 같은 브라우저에서 계정별로 복원됩니다.

이력서 초안은 같은 계정의 여러 탭에서 수정한 항목을 병합합니다. 등록할 때 작성 중인 경험이나 답변이 미완성이면 해당 항목의 마지막 저장본을 제출합니다.

로비는 로그인 없이 둘러볼 수 있습니다. 면접방 예약과 개설 요청에는 방문 출입증이 필요합니다. 예약 화면에서 로그인하거나 가입을 마치면 대기실의 **예약 이어하기**로 요청했던 화면에 돌아갈 수 있습니다. 예약 정보와 면접권은 브라우저에서 계정별로 유지됩니다.

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

공통 컴포넌트 스토리는 `src/stories/common/<컴포넌트명>/`에 둡니다. 예를 들어 `GNB/`에는 `GNB.stories.tsx`와 미리보기 전용 스타일 `gnb.stories.css.ts`를 함께 둡니다.

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
| 아이콘        | SEED Design, SVGR           |
| 폼            | React Hook Form             |
| 3D            | three.js, React Three Fiber |
| 컴포넌트 문서 | Storybook 10                |
| 코드 퀄리티   | Biome, Husky                |
| 테스트        | Playwright                  |
| 패키지 매니저 | pnpm 12                     |

## 아이콘 사용법

SEED 아이콘을 이름으로 import해 JSX 태그로 사용합니다.

```tsx
import { IconBellLine } from '@karrotmarket/react-monochrome-icon';

<IconBellLine size={20} role='img' aria-label='알림' />;
```

프로젝트 SVG 아이콘은 `src/assets/icons/`에 케밥 케이스 파일명으로 저장합니다. `index.ts`에서 SVGR의 `?react`로 불러와 `IconIdMini`처럼 PascalCase 이름으로 내보내고, 사용하는 컴포넌트에서는 `@/assets/icons`에서 가져옵니다.

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
