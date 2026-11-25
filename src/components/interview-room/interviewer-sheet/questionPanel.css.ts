import { style } from '@vanilla-extract/css';
import { color, radius, space, typography } from '@/styles/token';

export const navigation = style({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: space[8],
});

export const meta = style({
  ...typography.bodySStrong,
  display: 'flex',
  alignItems: 'center',
  gap: space[8],
  color: color.neutral[900],
  fontVariantNumeric: 'tabular-nums',
});

export const controls = style({
  display: 'flex',
  alignItems: 'center',
  gap: space[8],
});

export const controlsLabel = style({
  ...typography.bodyS,
  color: color.neutral[500],
});

export const arrowButton = style({
  selectors: {
    'button&': {
      width: '44px',
      height: '44px',
      padding: 0,
      borderRadius: radius[12],
    },
  },
});

export const question = style({
  ...typography.title,
  margin: 0,
  color: color.neutral[900],
  wordBreak: 'keep-all',
});

export const intent = style({
  ...typography.bodyS,
  margin: 0,
  color: color.neutral[600],
});
