import { style } from '@vanilla-extract/css';
import { color, space, typography } from '@/styles/token';

export const placeholder = style({
  position: 'relative',
  width: '100%',
  height: '100%',
  background: color.neutral[200],
});

export const label = style({
  ...typography.caption,
  position: 'absolute',
  left: space[24],
  bottom: space[24],
  margin: 0,
  color: color.neutral[400],
});
