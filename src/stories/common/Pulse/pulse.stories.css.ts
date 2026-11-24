import { style } from '@vanilla-extract/css';
import { color, radius, space, typography } from '@/styles/token';

export const preview = style({
  ...typography.bodyS,
  display: 'grid',
  justifyItems: 'center',
  alignContent: 'center',
  gap: space[16],
  padding: space[24],
  borderRadius: radius[16],
  background: color.neutral[50],
  color: color.neutral[900],
});
