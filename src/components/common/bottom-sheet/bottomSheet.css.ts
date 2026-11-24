import { keyframes, style } from '@vanilla-extract/css';
import { type RecipeVariants, recipe } from '@vanilla-extract/recipes';
import { color, radius, space, typography } from '@/styles/token';

const slideUp = keyframes({
  from: { transform: 'translateY(100%)' },
  to: { transform: 'translateY(0)' },
});

export const root = style({
  position: 'fixed',
  inset: 'auto 0 0',
  zIndex: 1,
  width: '100%',
  maxWidth: '1224px',
  maxHeight: `calc(100dvh - max(${space[48]}, env(safe-area-inset-top)))`,
  margin: '0 auto',
  padding: space[24],
  paddingBottom: `calc(${space[24]} + env(safe-area-inset-bottom))`,
  border: 0,
  borderRadius: `${radius[24]} ${radius[24]} 0 0`,
  background: color.neutral[0],
  color: color.neutral[900],
  boxShadow: '0 -8px 40px rgb(18 23 28 / 16%)',
  flexDirection: 'column',
  gap: space[20],
  overflow: 'auto',
  overscrollBehavior: 'contain',
  selectors: {
    '&[open]': { display: 'flex' },
    '&::before': {
      content: '""',
      position: 'absolute',
      top: '10px',
      left: '50%',
      transform: 'translateX(-50%)',
      width: space[48],
      height: space[4],
      borderRadius: radius.full,
      background: color.neutral[300],
      pointerEvents: 'none',
    },
  },
  '@media': {
    '(prefers-reduced-motion: no-preference)': {
      selectors: { '&[open]': { animation: `${slideUp} 200ms ease-out` } },
    },
  },
});

export const header = style({
  display: 'flex',
  flexShrink: 0,
  alignItems: 'center',
  gap: space[16],
  flexWrap: 'wrap',
});

export const candidateTabs = style({
  ...typography.bodyS,
  display: 'flex',
  gap: space[8],
  minWidth: 0,
  maxWidth: '100%',
  overflowX: 'auto',
  margin: 0,
  padding: 0,
  border: 0,
});

export const candidateButton = style({
  flexShrink: 0,
  selectors: {
    'button&': { borderRadius: radius.full },
    '&[aria-pressed="false"]': {
      boxShadow: `inset 0 0 0 1px ${color.neutral[200]}`,
    },
    '&:focus-visible': { outlineOffset: '-2px' },
  },
});

export const avatar = style({
  display: 'inline-grid',
  placeItems: 'center',
  flexShrink: 0,
  width: space[64],
  height: space[64],
  overflow: 'hidden',
  borderRadius: radius.full,
  background: color.neutral[100],
  color: color.neutral[500],
});

export const avatarImage = style({
  width: '100%',
  height: '100%',
  objectFit: 'cover',
});

export const body = style({
  display: 'grid',
  gridTemplateColumns: 'minmax(0, 1fr)',
  gap: space[24],
  overflowY: 'auto',
  overscrollBehavior: 'contain',
});

export const withSidebar = style({
  '@media': {
    '(min-width: 768px)': {
      gridTemplateColumns: 'minmax(0, 760fr) minmax(0, 392fr)',
    },
  },
});

export const column = style({
  display: 'flex',
  flexDirection: 'column',
  minWidth: 0,
});

export const panel = recipe({
  base: {
    flex: 1,
    minWidth: 0,
    padding: space[24],
    borderRadius: radius[16],
  },
  variants: {
    variant: {
      default: { background: color.neutral[50] },
      highlighted: {
        background: color.primary[50],
        boxShadow: `inset 0 0 0 1.5px ${color.primary[500]}`,
      },
    },
  },
  defaultVariants: { variant: 'default' },
});

export type PanelVariants = NonNullable<RecipeVariants<typeof panel>>;
