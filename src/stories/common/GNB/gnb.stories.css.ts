import { style } from '@vanilla-extract/css';
import { color, space } from '@/styles/token';

export const stickyHeader = style({
  position: 'sticky',
  top: 0,
  zIndex: 1,
});

export const comparison = style({
  display: 'grid',
  gap: space[16],
  background: color.neutral[50],
});
