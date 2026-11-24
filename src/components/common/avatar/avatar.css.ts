import { style } from '@vanilla-extract/css';
import { type RecipeVariants, recipe } from '@vanilla-extract/recipes';
import { color, radius, space } from '@/styles/token';

export const avatar = recipe({
  base: {
    display: 'inline-block',
    flexShrink: 0,
    width: space[48],
    height: space[48],
    overflow: 'hidden',
    borderRadius: radius.full,
  },
  variants: {
    empty: {
      true: {
        background: color.neutral[0],
        border: `1.5px dashed ${color.neutral[300]}`,
      },
      false: {
        background: color.neutral[100],
      },
    },
  },
  defaultVariants: {
    empty: false,
  },
});

export const image = style({
  display: 'block',
  width: '100%',
  height: '100%',
  objectFit: 'cover',
});

export type AvatarVariants = NonNullable<RecipeVariants<typeof avatar>>;
