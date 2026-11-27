import { globalStyle, style } from '@vanilla-extract/css';
import { button } from '@/components/common/button/button.css';
import { color, radius, space, typography } from '@/styles/token';

const narrow = '(max-width: 800px)';

export const layout = style({
  display: 'grid',
  gridTemplateColumns: 'minmax(0,600fr) minmax(0,496fr)',
  gap: 'clamp(32px,calc((100vw - 1000px) * .38),128px)',
  minHeight: 'clamp(620px,calc(100svh - 160px),760px)',
  '@media': {
    [narrow]: {
      gridTemplateColumns: 'minmax(0,1fr)',
      gap: space[24],
    },
  },
});
export const scene = style({
  position: 'relative',
  overflow: 'hidden',
  minWidth: 0,
  background: color.neutral[0],
  '@media': { [narrow]: { height: 'clamp(300px,52svh,480px)' } },
});
export const rings = style({
  position: 'absolute',
  inset: '16% 3.33% auto',
  aspectRatio: '1',
  background: `radial-gradient(circle, ${color.primary[50]}, ${color.neutral[0]})`,
  border: `1px solid ${color.neutral[100]}`,
  borderRadius: '50%',
  selectors: {
    '&::after': {
      content: '""',
      position: 'absolute',
      inset: '12.5%',
      borderRadius: '50%',
      border: `1px solid ${color.neutral[100]}`,
    },
  },
});
const bubble = style({
  ...typography.bodySStrong,
  position: 'absolute',
  pointerEvents: 'none',
  display: 'inline-flex',
  alignItems: 'center',
  height: 44,
  paddingInline: space[16],
  borderRadius: radius.full,
  boxShadow: `0 6px 20px ${color.neutral[900]}12`,
  '@media': {
    [narrow]: { ...typography.tag, height: space[32], paddingInline: space[8] },
  },
});
export const ticketLabel = style([
  bubble,
  {
    top: '33.5%',
    left: '3.33%',
    background: color.neutral[0],
    '@media': { [narrow]: { left: 0 } },
  },
]);
export const levelLabel = style([
  bubble,
  {
    top: '62%',
    right: '7.5%',
    background: color.neutral[800],
    color: color.neutral[0],
    '@media': { [narrow]: { right: 0 } },
  },
]);
export const cardPreview = style({
  position: 'absolute',
  inset: 0,
  maskImage: 'linear-gradient(transparent, #000 17%)',
  filter: `drop-shadow(0 ${space[16]} ${space[24]} ${color.neutral[900]}26)`,
});
export const staticPass = style({
  position: 'absolute',
  left: '50%',
  top: '24%',
  height: '52%',
  maxWidth: '75%',
  transform: 'translateX(-50%) rotate(3deg)',
});
globalStyle(`${staticPass} > *`, { width: '100%' });

export const details = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  gap: space[16],
});
export const description = style({
  ...typography.bodyL,
  color: color.neutral[600],
  margin: 0,
  wordBreak: 'keep-all',
});
export const journey = style({
  padding: space[24],
  marginTop: 'auto',
  width: '100%',
});
globalStyle(`${journey} h2`, {
  ...typography.bodySStrong,
  color: color.neutral[500],
  margin: `0 0 ${space[12]}`,
});
globalStyle(`${journey} ol`, { listStyle: 'none', margin: 0, padding: 0 });
globalStyle(`${journey} li`, {
  ...typography.bodyM,
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  gap: space[8],
  paddingLeft: space[32],
  minHeight: 38,
  color: color.neutral[500],
});
globalStyle(`${journey} li::before`, {
  content: '""',
  position: 'absolute',
  left: 4,
  top: '50%',
  transform: 'translateY(-50%)',
  width: 10,
  height: 10,
  borderRadius: radius.full,
  background: color.neutral[300],
});
globalStyle(`${journey} li:not(:last-child)::after`, {
  content: '""',
  position: 'absolute',
  left: 8,
  top: 'calc(50% + 6px)',
  height: 26,
  width: 2,
  background: color.neutral[200],
});
globalStyle(`${journey} li[aria-current]`, {
  ...typography.bodyMStrong,
  color: color.neutral[900],
});
globalStyle(`${journey} li[aria-current]::before`, {
  width: 16,
  height: 16,
  left: 1,
  background: color.neutral[900],
});
globalStyle(`${journey} li > :last-child`, { marginLeft: 'auto' });
globalStyle(`${journey} small`, {
  ...typography.caption,
  color: color.neutral[400],
});
export const stats = style({
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: space[12],
  width: '100%',
  margin: 0,
});
globalStyle(`${stats} div`, {
  padding: `${space[16]} ${space[24]}`,
  background: color.neutral[50],
  borderRadius: radius[16],
});
globalStyle(`${stats} dt`, {
  ...typography.caption,
  color: color.neutral[500],
});
globalStyle(`${stats} dd`, { ...typography.h3, margin: `${space[4]} 0 0` });
export const footer = style({
  width: '100%',
  marginTop: 'auto',
  paddingTop: space[24],
});

export const entryLink = style([
  button({ size: 'large', display: 'block' }),
  { textDecoration: 'none' },
]);
