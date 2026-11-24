import { style } from '@vanilla-extract/css';
import { color, radius, typography } from '@/styles/token';

export const hiddenInput = style({
  position: 'absolute',
  width: '1px',
  height: '1px',
  margin: '-1px',
  padding: 0,
  border: 0,
  overflow: 'hidden',
  clip: 'rect(0 0 0 0)',
  whiteSpace: 'nowrap',
});

export const root = style({
  position: 'relative',
  display: 'inline-flex',
  flexShrink: 0,
  cursor: 'pointer',
  selectors: {
    '&:has(:disabled)': { cursor: 'not-allowed' },
  },
});

export const chip = style({
  ...typography.bodySStrong,
  boxSizing: 'border-box',
  display: 'inline-flex',
  alignItems: 'center',
  height: '38px',
  paddingInline: '16px',
  borderRadius: radius.full,
  background: color.neutral[0],
  color: color.neutral[700],
  boxShadow: `inset 0 0 0 1px ${color.neutral[200]}`,
  whiteSpace: 'nowrap',
  selectors: {
    [`${hiddenInput}:checked + &`]: {
      background: color.neutral[900],
      color: color.neutral[0],
      boxShadow: 'none',
    },
    [`${hiddenInput}:focus-visible + &`]: {
      outline: `2px solid ${color.primary[500]}`,
      outlineOffset: '2px',
    },
  },
});
