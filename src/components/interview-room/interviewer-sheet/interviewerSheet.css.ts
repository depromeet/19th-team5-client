import { style } from '@vanilla-extract/css';
import { color, space, typography } from '@/styles/token';

/** 2부 건너뛰기·면접 마치기는 면접자 탭 반대편 끝에 둔다. */
export const headerAction = style({
  selectors: {
    'button&': { marginInlineStart: 'auto' },
  },
});

export const panel = style({
  display: 'flex',
  flexDirection: 'column',
  gap: space[12],
  // Figma 기준 질문 카드 높이 350px에서 위아래 안쪽 여백(24px씩)을 뺀 값
  minHeight: '302px',
});

export const empty = style({
  ...typography.bodyS,
  margin: 0,
  color: color.neutral[600],
});

/** 하단 독은 질문 카드 아래쪽 가운데에 붙인다. */
export const dock = style({
  display: 'flex',
  justifyContent: 'center',
  marginTop: 'auto',
});
