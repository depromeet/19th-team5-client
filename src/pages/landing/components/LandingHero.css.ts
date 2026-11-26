import { globalStyle, keyframes, style } from '@vanilla-extract/css';
import { button } from '@/components/common/button/button.css';
import { menuLink } from '@/components/common/gnb/gnb.css';
import { color, radius, space, typography } from '@/styles/token';
import { gutter, headerHeight, mobile, shortScreen } from '../HomePage.css';

export const header = style({
  position: 'fixed',
  inset: '0 0 auto',
  zIndex: 10,
  background: color.neutral[200],
  selectors: {
    '&[data-scrolled="true"]': {
      background: color.neutral[0],
      boxShadow: `0 1px ${color.neutral[100]}`,
    },
  },
});
export const headerInner = style({
  selectors: {
    'header &': {
      minHeight: headerHeight,
      maxWidth: 'none',
      width: `calc(100% - 2 * ${gutter})`,
    },
  },
});
export const backToTop = style([
  button({ variant: 'outline' }),
  {
    position: 'fixed',
    zIndex: 9,
    right: `calc(${space[24]} + env(safe-area-inset-right, 0px))`,
    bottom: `calc(${space[24]} + env(safe-area-inset-bottom, 0px))`,
    width: space[48],
    height: space[48],
    padding: 0,
    borderRadius: radius.full,
    border: `1px solid ${color.neutral[200]}`,
    boxShadow: '0 4px 16px rgba(14, 26, 46, 0.12)',
    ':hover': { color: color.primary[600], background: color.primary[50] },
    '@media': {
      [mobile]: {
        right: `calc(${space[16]} + env(safe-area-inset-right, 0px))`,
        bottom: `calc(${space[16]} + env(safe-area-inset-bottom, 0px))`,
      },
    },
  },
]);
export const navItem = style([
  menuLink,
  {
    color: color.neutral[900],
    border: 0,
    padding: 0,
    background: 'transparent',
    selectors: {
      'a&:hover': { color: color.primary[500] },
    },
  },
]);
export const login = style([navItem, { color: color.primary[500] }]);
export const headerCta = style([
  button({}),
  {
    minWidth: '118px',
    paddingBlock: space[8],
    minHeight: space[40],
    background: color.primary[500],
    ':hover': { background: color.primary[600] },
    '@media': { [mobile]: { minWidth: 0 } },
  },
]);
export const hero = style({
  position: 'relative',
  background: color.neutral[200],
  display: 'grid',
  placeItems: 'center',
  textAlign: 'center',
  padding: `calc(${headerHeight} + 3dvh) ${gutter} calc(${headerHeight} + 11dvh)`,
  '@media': {
    [shortScreen]: {
      paddingBlock: `calc(${headerHeight} + 2dvh) ${space[48]}`,
    },
  },
});
export const heroCopy = style({
  display: 'flex',
  alignItems: 'center',
  flexDirection: 'column',
  gap: 'clamp(12px, 2.4dvh, 24px)',
});
export const roomCount = style({
  ...typography.bodySStrong,
  display: 'inline-flex',
  gap: space[8],
  alignItems: 'center',
  padding: `${space[8]} ${space[16]}`,
  borderRadius: radius.full,
  color: color.neutral[700],
  background: color.neutral[0],
});
export const liveDot = style({
  width: '6px',
  height: '6px',
  borderRadius: radius.full,
  background: color.success[500],
});
export const headline = style({
  ...typography.display,
  fontSize: 'clamp(36px, 5vw, 56px)',
  lineHeight: 1.15,
  textWrap: 'balance',
});
export const heroDescription = style({
  ...typography.bodyLStrong,
  color: color.neutral[600],
  textWrap: 'balance',
  '@media': { [mobile]: { ...typography.bodyMStrong } },
});
export const heroActions = style({
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'center',
  gap: space[12],
});
export const browseButton = style([
  button({ variant: 'outline', size: 'large' }),
  { boxShadow: `inset 0 0 0 1px ${color.neutral[100]}` },
]);
export const heroNote = style({
  ...typography.bodyS,
  color: color.neutral[500],
});
export const scrollHint = style({
  ...typography.caption,
  position: 'absolute',
  bottom: space[40],
  left: '50%',
  transform: 'translateX(-50%)',
  display: 'grid',
  justifyItems: 'center',
  gap: space[8],
  color: color.neutral[600],
  '@media': {
    [mobile]: { bottom: space[24] },
    [shortScreen]: { bottom: space[20], display: 'flex', alignItems: 'center' },
  },
});
const arrowBounce = keyframes({
  from: { transform: 'translateY(0)' },
  to: { transform: `translateY(${space[16]})` },
});
globalStyle(`${scrollHint} > svg`, {
  '@media': {
    '(prefers-reduced-motion: no-preference)': {
      animation: `${arrowBounce} 800ms ease-in-out infinite alternate`,
    },
  },
});
export const mouse = style({
  width: space[24],
  height: '36px',
  border: `1.5px solid ${color.neutral[500]}`,
  borderRadius: radius.full,
  display: 'flex',
  justifyContent: 'center',
  paddingTop: '6px',
  '@media': { [shortScreen]: { display: 'none' } },
  '::after': {
    content: '""',
    width: '3px',
    height: space[8],
    borderRadius: radius.full,
    background: color.neutral[500],
  },
});
