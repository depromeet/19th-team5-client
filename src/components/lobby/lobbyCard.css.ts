import { style } from '@vanilla-extract/css';
import { color, space, typography } from '@/styles/token';

export const content = style({
  display: 'flex',
  flexDirection: 'column',
  gap: space[16],
});

export const iconBadge = style({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
  width: space[32],
  height: space[32],
});

export const label = style({
  ...typography.bodySStrong,
  flex: 1,
  minWidth: 0,
  margin: 0,
  color: color.neutral[600],
});

export const closeButton = style({
  selectors: {
    'button&': {
      width: space[32],
      height: space[32],
      margin: `-${space[8]}`,
      padding: 0,
      color: color.neutral[700],
    },
  },
});

export const title = style({
  ...typography.h3,
  margin: 0,
  color: color.neutral[900],
});

export const description = style({
  ...typography.bodyM,
  margin: 0,
  color: color.neutral[600],
  wordBreak: 'keep-all',
});
