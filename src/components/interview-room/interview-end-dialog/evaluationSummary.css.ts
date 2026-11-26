import { style } from '@vanilla-extract/css';
import { color, fontWeight, radius, space, typography } from '@/styles/token';

export const summary = style({
  ...typography.bodyM,
  display: 'grid',
  gap: space[12],
  margin: 0,
  paddingBlock: space[16],
  paddingInline: space[24],
  borderRadius: radius[12],
  background: color.neutral[50],
  color: color.neutral[600],
});

export const row = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: space[12],
});

const value = style({
  margin: 0,
  fontWeight: fontWeight.semibold,
});

export const deadline = style([
  value,
  { color: color.danger[500], fontVariantNumeric: 'tabular-nums' },
]);

export const reward = style([value, { color: color.neutral[900] }]);
