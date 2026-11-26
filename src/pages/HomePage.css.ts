import { style } from '@vanilla-extract/css';
import { color, space, typography } from '@/styles/token';

export const page = style({ padding: space[24], color: color.neutral[900] });
export const title = style({ ...typography.h1, margin: 0 });
export const links = style({
  display: 'flex',
  flexWrap: 'wrap',
  gap: space[12],
  marginTop: space[24],
});
export const link = style({
  textDecoration: 'none',
  selectors: {
    '&:focus-visible': {
      outline: `2px solid ${color.primary[500]}`,
      outlineOffset: space[4],
    },
  },
});
