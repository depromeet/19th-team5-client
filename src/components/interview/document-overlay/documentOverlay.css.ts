import { style } from '@vanilla-extract/css';
import { color, space, typography } from '@/styles/token';

/** GNB는 그대로 보이도록 그 아래 영역만 덮는다. */
const gnbHeight = space[80];

export const overlay = style({
  position: 'fixed',
  inset: `${gnbHeight} 0 0`,
  width: '100%',
  maxWidth: 'none',
  height: `calc(100dvh - ${gnbHeight})`,
  maxHeight: 'none',
  margin: 0,
  paddingBlock: space[40],
  paddingInline: space[24],
  border: 0,
  background: color.neutral[50],
  color: color.neutral[900],
  overflowY: 'auto',
  selectors: {
    '&::backdrop': { background: 'transparent' },
  },
});

export const content = style({
  display: 'flex',
  flexDirection: 'column',
  gap: space[32],
  width: '100%',
  maxWidth: '1224px',
  height: '100%',
  minHeight: '640px',
  marginInline: 'auto',
  '@media': {
    '(max-width: 700px)': {
      height: 'auto',
      minHeight: '100%',
      gap: space[16],
    },
  },
});

export const header = style({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: space[12],
});

export const titleGroup = style({
  display: 'flex',
  alignItems: 'center',
  gap: space[12],
});

export const backButton = style({
  selectors: {
    'button&': {
      width: space[40],
      height: space[40],
      padding: 0,
      color: color.neutral[900],
    },
  },
});

export const title = style({
  ...typography.h1,
  margin: 0,
  color: color.neutral[900],
});

export const timerGroup = style({
  ...typography.caption,
  display: 'flex',
  alignItems: 'center',
  gap: space[12],
  color: color.neutral[500],
});
