import { style } from '@vanilla-extract/css';
import { recipe } from '@vanilla-extract/recipes';
import { color, radius, space, typography } from '@/styles/token';

export const root = style({
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  gap: space[20],
  boxShadow: `inset 0 -1px 0 ${color.neutral[100]}`,
});

export const item = recipe({
  base: {
    ...typography.bodyMStrong,
    position: 'relative',
    boxSizing: 'border-box',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    minWidth: '44px',
    maxWidth: '200px',
    minHeight: '48px',
    paddingBlock: space[12],
    paddingInline: 0,
    border: 0,
    background: 'transparent',
    cursor: 'pointer',
    selectors: {
      '&:focus-visible': {
        outline: `2px solid ${color.primary[500]}`,
        outlineOffset: '2px',
      },
    },
  },
  variants: {
    selected: {
      true: {
        color: color.neutral[800],
        '::after': {
          content: '""',
          position: 'absolute',
          insetInline: 0,
          bottom: 0,
          height: '3px',
          borderRadius: radius.full,
          background: color.neutral[900],
        },
      },
      false: {
        color: color.neutral[400],
      },
    },
  },
  defaultVariants: {
    selected: false,
  },
});

export const label = style({
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
});
