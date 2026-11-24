import { style } from '@vanilla-extract/css';
import { color, space, typography } from '@/styles/token';

export const logo = style({
  ...typography.h3,
  width: space[80],
  flexShrink: 0,
  color: color.neutral[900],
  textDecoration: 'none',
});
