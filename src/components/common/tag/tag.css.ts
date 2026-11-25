import { type RecipeVariants, recipe } from '@vanilla-extract/recipes';
import { color, space, typography } from '@/styles/token';

export const tag = recipe({
  base: {
    ...typography.tag,
    display: 'inline-flex',
    alignItems: 'center',
    flexShrink: 0,
    paddingBlock: space[4],
    paddingInline: space[8],
    borderRadius: '6px',
    whiteSpace: 'nowrap',
  },
  variants: {
    tone: {
      dark: { background: color.neutral[900], color: color.neutral[0] },
      gray: { background: color.neutral[100], color: color.neutral[700] },
      red: { background: color.danger[50], color: color.danger[500] },
      green: { background: color.success[50], color: color.success[500] },
      outline: {
        background: color.neutral[0],
        color: color.neutral[700],
        boxShadow: `inset 0 0 0 1px ${color.neutral[300]}`,
      },
    },
  },
  defaultVariants: {
    tone: 'dark',
  },
});

export type TagVariants = NonNullable<RecipeVariants<typeof tag>>;
