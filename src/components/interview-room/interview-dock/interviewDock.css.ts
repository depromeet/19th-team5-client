import { style } from '@vanilla-extract/css';
import { color, radius, space, typography } from '@/styles/token';
import { dockShadow } from '../hud.css';

export const dock = style({
  display: 'inline-flex',
  alignItems: 'center',
  gap: space[8],
  padding: space[12],
  borderRadius: radius[24],
  background: color.neutral[0],
  boxShadow: dockShadow,
});

export const micStatus = style({
  ...typography.bodySStrong,
  display: 'inline-flex',
  alignItems: 'center',
  gap: space[8],
  paddingInline: space[12],
  color: color.neutral[700],
  whiteSpace: 'nowrap',
});

export const micDot = style({
  flexShrink: 0,
  width: space[8],
  height: space[8],
  borderRadius: radius.full,
  background: color.neutral[400],
  selectors: {
    '&[data-on="true"]': { background: color.success[500] },
  },
});

export const iconButton = style({
  selectors: {
    'button&': {
      flexShrink: 0,
      width: space[48],
      height: space[48],
      padding: 0,
      borderRadius: radius[12],
    },
    'button&[aria-pressed="false"]': { color: color.neutral[500] },
  },
});

export const leaveButton = style([
  iconButton,
  {
    selectors: {
      'button&': { color: color.neutral[700] },
    },
  },
]);
