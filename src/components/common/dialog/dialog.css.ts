import { style } from '@vanilla-extract/css';
import { color, radius, space, typography } from '@/styles/token';

// Figma 사용 규칙: 오버레이(Dim)는 neutral/900 + 투명도 60%
const dim = `${color.neutral[900]}99`;
const shadow = `0 20px 56px ${color.neutral[900]}29`;

export const root = style({
  flexDirection: 'column',
  width: '600px',
  margin: 'auto',
  padding: space[32],
  border: 'none',
  borderRadius: radius[24],
  background: color.neutral[0],
  boxShadow: shadow,
  selectors: {
    // 닫힌 dialog는 UA 스타일(display: none)을 유지한다.
    '&[open]': { display: 'flex' },
    '&::backdrop': { background: dim },
  },
});

// 파트 사이 기본 간격은 32px, Header 바로 뒤의 Description만 8px이다.
// gap 대신 인접 형제 선택자로 간격을 준다.
const part = style({
  margin: 0,
  selectors: {
    '* + &': { marginTop: space[32] },
  },
});

export const header = style([
  part,
  {
    ...typography.h3,
    color: color.neutral[900],
  },
]);

export const description = style([
  part,
  {
    ...typography.bodyM,
    color: color.neutral[600],
    selectors: {
      [`${header} + &`]: { marginTop: space[8] },
    },
  },
]);

export const body = style([part]);

export const footer = style([
  part,
  {
    display: 'flex',
    gap: space[8],
  },
]);
