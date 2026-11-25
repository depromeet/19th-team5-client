import { style } from '@vanilla-extract/css';
import { type RecipeVariants, recipe } from '@vanilla-extract/recipes';
import { color, radius, space, typography } from '@/styles/token';

export const timer = recipe({
  base: {
    ...typography.bodySStrong,
    boxSizing: 'border-box',
    display: 'inline-flex',
    alignItems: 'center',
    gap: space[8],
    paddingBlock: space[8],
    paddingInline: space[12],
    borderRadius: radius.full,
    fontVariantNumeric: 'tabular-nums',
    whiteSpace: 'nowrap',
  },
  variants: {
    tone: {
      live: { background: color.danger[50], color: color.danger[500] },
      default: { background: color.neutral[100], color: color.neutral[900] },
      dark: { background: color.neutral[900], color: color.neutral[0] },
    },
  },
  defaultVariants: {
    tone: 'live',
  },
});

export type TimerVariants = NonNullable<RecipeVariants<typeof timer>>;

export const dot = style({
  flexShrink: 0,
  width: '6px',
  height: '6px',
  borderRadius: radius.full,
  background: 'currentColor',
});
