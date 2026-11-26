import { style } from '@vanilla-extract/css';
import { recipe } from '@vanilla-extract/recipes';
import { color, radius, space, typography } from '@/styles/token';
import { hudShadow } from '../hud.css';

export const card = recipe({
  base: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: space[8],
    boxSizing: 'border-box',
    width: 'max-content',
    maxWidth: `calc(100% - ${space[48]})`,
    paddingInline: space[32],
    borderRadius: radius[24],
    background: color.neutral[0],
    boxShadow: hudShadow,
    textAlign: 'center',
  },
  variants: {
    variant: {
      notice: { paddingBlock: space[20] },
      question: { width: '1016px', paddingBlock: space[24] },
    },
  },
});

export const caption = style({
  ...typography.captionStrong,
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'center',
  gap: space[8],
  margin: 0,
  color: color.neutral[500],
});

export const separator = style({ color: color.neutral[300] });

export const title = recipe({
  base: {
    margin: 0,
    color: color.neutral[900],
    wordBreak: 'keep-all',
  },
  variants: {
    variant: {
      notice: typography.h3,
      question: typography.h1,
    },
  },
});
