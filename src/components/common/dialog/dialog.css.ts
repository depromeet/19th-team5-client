import { style } from '@vanilla-extract/css';
import { color, radius, space, typography } from '@/styles/token';

const dim = `${color.neutral[900]}99`;
export const dialogShadow = `0 20px 56px ${color.neutral[900]}29`;

export const root = style({
  flexDirection: 'column',
  width: '600px',
  margin: 'auto',
  padding: space[32],
  border: 'none',
  borderRadius: radius[24],
  background: color.neutral[0],
  boxShadow: dialogShadow,
  selectors: {
    '&[open]': { display: 'flex' },
    '&::backdrop': { background: dim },
  },
});

const part = style({
  margin: 0,
  selectors: {
    '* + &': { marginTop: space[32] },
  },
});

export const header = style([
  part,
  {
    ...typography.h3,
    color: color.neutral[900],
  },
]);

export const description = style([
  part,
  {
    ...typography.bodyM,
    color: color.neutral[600],
    selectors: {
      [`${header} + &`]: { marginTop: space[8] },
    },
  },
]);

export const body = style([part]);

export const footer = style([
  part,
  {
    display: 'flex',
    gap: space[8],
  },
]);
