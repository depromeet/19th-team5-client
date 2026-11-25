import { style } from '@vanilla-extract/css';
import { color, typography } from '@/styles/token';

export const root = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
  width: '100%',
});

export const button = style({
  ...typography.bodySStrong,
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  width: '100%',
  margin: 0,
  padding: '16px',
  border: `1px dashed ${color.neutral[300]}`,
  borderRadius: '12px',
  background: 'transparent',
  color: color.neutral[600],
  textAlign: 'start',
  whiteSpace: 'nowrap',
  cursor: 'pointer',
  selectors: {
    [`${root}[data-limited] &`]: {
      borderColor: color.danger[500],
      color: color.danger[500],
      cursor: 'not-allowed',
    },
  },
});

export const description = style({
  ...typography.caption,
  margin: 0,
  color: color.danger[500],
});
