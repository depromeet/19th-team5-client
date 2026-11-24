import { style } from '@vanilla-extract/css';
import { color, space, typography } from '@/styles/token';

export const comparison = style({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'flex-start',
  gap: space[40],
  width: '100%',
  maxWidth: '1240px',
  marginInline: 'auto',
  padding: space[40],
  overflow: 'hidden',
  borderRadius: '5px',
  background: color.neutral[100],
  '@media': {
    '(max-width: 480px)': { padding: space[16], gap: space[24] },
  },
});

export const preview = style({
  minHeight: '100dvh',
  background: color.neutral[100],
});

const topInset = `max(${space[24]}, env(safe-area-inset-top))`;
const bottomInset = `max(${space[24]}, env(safe-area-inset-bottom))`;
const leftInset = `max(${space[24]}, env(safe-area-inset-left))`;
const rightInset = `max(${space[24]}, env(safe-area-inset-right))`;

export const floatingExample = style({
  position: 'fixed',
  zIndex: 1,
  top: topInset,
  right: rightInset,
  maxHeight: `calc(100dvh - ${topInset} - ${bottomInset})`,
  selectors: {
    [`${preview} &`]: { maxWidth: `calc(100% - ${leftInset} - ${rightInset})` },
  },
});

export const heading = style({
  ...typography.title,
  margin: 0,
  color: color.neutral[900],
});

export const message = style({
  ...typography.bodyM,
  margin: 0,
  marginTop: space[8],
  color: color.neutral[600],
});
