import { style } from '@vanilla-extract/css';
import { color, radius, space, typography } from '@/styles/token';

export const countDown = style({
  display: 'inline-flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: space[16],
});

export const circle = style({
  ...typography.display,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '180px',
  height: '180px',
  borderRadius: radius.full,
  background: color.neutral[0],
  color: color.neutral[900],
  filter: 'drop-shadow(0 20px 28px rgba(18, 23, 28, 0.16))',
  fontVariantNumeric: 'tabular-nums',
  transition: 'background-color 0.3s ease, color 0.3s ease',
  selectors: {
    '&[data-last="true"]': {
      background: color.danger[500],
      color: color.neutral[0],
    },
  },
});

export const description = style({
  ...typography.bodyLStrong,
  margin: 0,
  color: color.neutral[0],
  whiteSpace: 'nowrap',
});
