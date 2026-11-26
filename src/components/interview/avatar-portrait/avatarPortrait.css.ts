import { type RecipeVariants, recipe } from '@vanilla-extract/recipes';
import { color, radius, space } from '@/styles/token';

/**
 * 캐릭터 3종이 한 장에 있는 스프라이트 시트에서 정장 캐릭터 얼굴을 잘라 보여준다.
 * 크기와 위치는 Figma의 Character 프레임 값을 그대로 쓴다.
 */
export const portrait = recipe({
  base: {
    display: 'block',
    flexShrink: 0,
    overflow: 'hidden',
    borderRadius: radius.full,
    backgroundColor: color.neutral[0],
    backgroundImage: "url('/images/avatar-sheet.png')",
    backgroundRepeat: 'no-repeat',
  },
  variants: {
    size: {
      stage: {
        width: '140px',
        height: '140px',
        backgroundSize: '443.5px 221.75px',
        backgroundPosition: '-22.37px -25.35px',
      },
      small: {
        width: space[40],
        height: space[40],
        backgroundSize: '126.7px 63.36px',
        backgroundPosition: '-5.83px -7.5px',
      },
    },
  },
  defaultVariants: { size: 'small' },
});

export type PortraitVariants = NonNullable<RecipeVariants<typeof portrait>>;
