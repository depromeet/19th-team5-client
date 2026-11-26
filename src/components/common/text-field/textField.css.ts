import { style } from '@vanilla-extract/css';
import { color, radius, space, typography } from '@/styles/token';

export const root = style({
  display: 'flex',
  flexDirection: 'column',
  gap: space[8],
  width: '100%',
});

export const label = style({
  ...typography.bodySStrong,
  display: 'inline-flex',
  gap: space[4],
  alignSelf: 'flex-start',
  color: color.neutral[900],
});

export const requiredMark = style({
  color: color.danger[500],
});

export const box = style({
  boxSizing: 'border-box',
  display: 'flex',
  alignItems: 'center',
  gap: space[12],
  width: '100%',
  height: '52px',
  paddingInline: space[16],
  border: `1px solid ${color.neutral[200]}`,
  borderRadius: radius[12],
  background: color.neutral[0],
  overflow: 'hidden',
  selectors: {
    '&:focus-within': {
      borderColor: color.neutral[400],
      boxShadow: `inset 0 0 0 0.5px ${color.neutral[400]}`,
    },
    [`${root}[data-invalid] &`]: {
      borderColor: color.danger[500],
      boxShadow: 'none',
    },
    '&:has(:disabled)': {
      background: color.neutral[50],
      borderColor: color.neutral[200],
      boxShadow: 'none',
    },
  },
});

export const input = style({
  ...typography.bodyM,
  flex: 1,
  alignSelf: 'stretch',
  minWidth: 0,
  margin: 0,
  padding: 0,
  border: 0,
  outline: 'none',
  background: 'transparent',
  color: color.neutral[900],
  selectors: {
    '&::placeholder': { color: color.neutral[400] },
    '&::-ms-reveal': { display: 'none' },
    '&:disabled': { color: color.neutral[300], cursor: 'not-allowed' },
    '&:disabled::placeholder': { color: color.neutral[300] },
  },
});

export const visibilityButton = style({
  display: 'grid',
  placeItems: 'center',
  flexShrink: 0,
  width: space[40],
  height: space[40],
  marginInlineEnd: `-${space[8]}`,
  padding: 0,
  border: 0,
  borderRadius: radius[8],
  color: color.neutral[600],
  background: 'transparent',
  cursor: 'pointer',
  ':hover': { background: color.neutral[50] },
  ':focus-visible': {
    outline: `2px solid ${color.primary[500]}`,
    outlineOffset: -2,
  },
  ':disabled': { color: color.neutral[300], cursor: 'not-allowed' },
});

export const count = style({
  ...typography.caption,
  flexShrink: 0,
  color: color.neutral[400],
  whiteSpace: 'nowrap',
  selectors: {
    [`${root}[data-invalid] &`]: { color: color.danger[500] },
  },
});

export const helper = style({
  ...typography.caption,
  margin: 0,
  color: color.neutral[500],
  selectors: {
    [`${root}[data-invalid] &`]: { color: color.danger[500] },
  },
});
