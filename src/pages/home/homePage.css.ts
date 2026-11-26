import { style } from '@vanilla-extract/css';
import { color, space, typography } from '@/styles/token';

export const page = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: space[32],
  minHeight: '100dvh',
  background: color.neutral[50],
});

export const title = style({
  ...typography.h1,
  margin: 0,
  color: color.neutral[900],
});

export const actions = style({
  display: 'flex',
  gap: space[12],
});
