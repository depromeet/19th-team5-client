import { style } from '@vanilla-extract/css';
import { color, radius, space, typography } from '@/styles/token';

export const prompt = style({
  ...typography.bodySStrong,
  display: 'inline-flex',
  alignItems: 'center',
  gap: space[8],
  margin: 0,
  paddingBlock: space[8],
  paddingInline: `${space[8]} ${space[16]}`,
  border: 0,
  borderRadius: radius[12],
  background: color.neutral[900],
  color: color.neutral[0],
  whiteSpace: 'nowrap',
  cursor: 'pointer',
  transition: 'opacity 0.2s ease',
  selectors: {
    '&:focus-visible': {
      outline: `2px solid ${color.primary[500]}`,
      outlineOffset: '2px',
    },
    /** 범위 밖: 위치만 알려주고 누를 수는 없다. */
    '&:disabled': {
      opacity: 0.55,
      cursor: 'default',
    },
  },
});
