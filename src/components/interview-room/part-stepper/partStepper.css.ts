import { style } from '@vanilla-extract/css';
import { color, radius, space, typography } from '@/styles/token';
import { hudShadow } from '../hud.css';

export const stepper = style({
  display: 'flex',
  gap: space[4],
  margin: 0,
  padding: space[8],
  listStyle: 'none',
  borderRadius: radius.full,
  background: color.neutral[0],
  boxShadow: hudShadow,
});

export const step = style({
  ...typography.bodySStrong,
  paddingBlock: space[8],
  paddingInline: space[16],
  borderRadius: radius.full,
  color: color.neutral[600],
  whiteSpace: 'nowrap',
  selectors: {
    '&[data-state="current"]': {
      background: color.neutral[900],
      color: color.neutral[0],
    },
    '&[data-state="done"]': { color: color.neutral[400] },
  },
});
