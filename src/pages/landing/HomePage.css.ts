import { createVar, globalStyle, style } from '@vanilla-extract/css';
import { color, radius, space, typography } from '@/styles/token';

export const mobile = '(max-width: 640px)';
export const tablet = '(max-width: 1024px)';
export const shortScreen = '(max-height: 600px)';
export const reducedMotion = '(prefers-reduced-motion: reduce)';
export const gutter = createVar();
export const headerHeight = createVar();
const sectionSpace = createVar();
export const page = style({
  vars: { [gutter]: '7vw', [headerHeight]: '72px', [sectionSpace]: '5dvh' },
  color: color.neutral[900],
  wordBreak: 'keep-all',
  overflowWrap: 'break-word',
  '@media': {
    '(min-width: 1600px)': { vars: { [gutter]: '10vw' } },
    [tablet]: { vars: { [gutter]: '4vw' } },
    [mobile]: {
      vars: {
        [gutter]: '5vw',
        [headerHeight]: '100px',
        [sectionSpace]: '4dvh',
      },
    },
    [shortScreen]: { vars: { [sectionSpace]: '3dvh' } },
  },
});
globalStyle(`html:has(${page})`, {
  scrollSnapType: 'y mandatory',
  scrollBehavior: 'smooth',
  '@media': {
    [reducedMotion]: { scrollBehavior: 'auto' },
  },
});
globalStyle(`${page} > section`, {
  minHeight: '100dvh',
  scrollSnapAlign: 'start',
  scrollSnapStop: 'always',
});
globalStyle(`${page} > section:not(#top)`, {
  display: 'grid',
  alignContent: 'center',
  paddingBlock: `calc(${headerHeight} + ${sectionSpace}) ${sectionSpace}`,
});
globalStyle(`${page} :where(p,h1,h2,h3,ol,figure,blockquote)`, { margin: 0 });
globalStyle(`${page} ol`, { padding: 0, listStyleType: 'none' });
globalStyle(`${page} a`, { textDecoration: 'none' });
globalStyle(`${page} :is(button,a,summary):focus-visible`, {
  outline: `3px solid ${color.primary[400]}`,
  outlineOffset: space[4],
});
export const container = style({
  width: `calc(100% - 2 * ${gutter})`,
  marginInline: 'auto',
});

export const eyebrow = style({
  ...typography.bodySStrong,
  color: color.neutral[500],
  marginBottom: space[8],
});
export const title = style({
  ...typography.h1,
  fontSize: 'clamp(28px, 3.4vw, 40px)',
  lineHeight: 1.3,
  textWrap: 'balance',
});
export const description = style({
  ...typography.bodyM,
  color: color.neutral[600],
  marginTop: space[16],
});
export const detailDescription = style([
  description,
  {
    ...typography.bodyLStrong,
    '@media': { [mobile]: { ...typography.bodyMStrong } },
  },
]);
export const cardTitle = style({
  ...typography.h3,
  '@media': { [mobile]: { ...typography.title } },
});
export const cardDescription = style({
  ...typography.bodyM,
  color: color.neutral[600],
  marginTop: space[8],
  whiteSpace: 'pre-line',
  '@media': { [mobile]: { ...typography.bodyS } },
});
export const fluidImage = style({
  display: 'block',
  width: '100%',
  height: 'auto',
});
const threeColumns = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
  gap: space[24],
  alignItems: 'start',
  '@media': { [mobile]: { gridTemplateColumns: '1fr', rowGap: space[32] } },
});
export const stepGrid = style([threeColumns, { marginTop: space[48] }]);
export const step = style({
  '@media': {
    [mobile]: {
      display: 'grid',
      gridTemplateColumns: '2fr 3fr',
      alignItems: 'center',
      gap: space[16],
    },
  },
});
export const stepImage = style([fluidImage, { borderRadius: radius[24] }]);
export const stepLabel = style({
  ...typography.caption,
  color: color.primary[500],
  marginBlock: `${space[20]} ${space[24]}`,
  '@media': { [mobile]: { marginBlock: `0 ${space[4]}` } },
});
export const peerSection = style({
  background: color.neutral[50],
});
export const peerGrid = style({
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  alignItems: 'center',
  gap: space[24],
  '@media': { [mobile]: { gridTemplateColumns: '1fr' } },
});

export const levelSection = style({
  textAlign: 'center',
  background: `radial-gradient(ellipse at top left, #efeafe99, transparent 52%), radial-gradient(ellipse at bottom right, ${color.primary[50]}, transparent 64%), ${color.neutral[50]}`,
});
export const staircase = style({
  display: 'grid',
  gridTemplateColumns: '120fr 144fr 168fr 192fr 216fr',
  gap: 'clamp(12px, 2vw, 24px)',
  alignItems: 'end',
  width: '78%',
  margin: `${space[48]} auto 0`,
  '@media': {
    [tablet]: { width: '100%' },
    [mobile]: {
      gridTemplateColumns: '1fr',
      textAlign: 'left',
    },
  },
});
export const stair = style({
  minWidth: 0,
  '@media': {
    [mobile]: { display: 'flex', alignItems: 'center', gap: space[20] },
  },
});
export const levelTile = style({
  ...typography.display,
  display: 'grid',
  placeItems: 'center',
  aspectRatio: '1',
  borderRadius: radius[24],
  color: color.neutral[300],
  border: `1px solid ${color.neutral[200]}`,
  background: `linear-gradient(135deg, ${color.neutral[0]}, ${color.neutral[100]} 80%)`,
  boxShadow: '0 12px 24px rgba(14, 26, 46, .06)',
  selectors: {
    [`${stair}:first-child &`]: { fontSize: typography.h1.fontSize },
    [`${stair}:last-child &`]: {
      color: color.neutral[0],
      borderColor: 'transparent',
      background: `linear-gradient(135deg, ${color.neutral[900]}, #293654 80%)`,
      boxShadow: '0 12px 24px rgba(14, 26, 46, .16)',
    },
  },
  '@media': {
    [mobile]: {
      width: space[64],
      borderRadius: radius[16],
      fontSize: typography.h1.fontSize,
    },
  },
});
export const levelCaption = style({
  ...typography.caption,
  display: 'grid',
  gap: space[4],
  marginTop: space[16],
  color: color.neutral[500],
  '@media': { [mobile]: { marginTop: 0 } },
});
export const levelName = style({
  ...typography.bodyLStrong,
  color: color.neutral[900],
});

export const serviceGrid = style([
  threeColumns,
  { alignItems: 'stretch', gridAutoRows: '1fr', marginTop: space[16] },
]);
export const serviceCard = style({
  display: 'grid',
  gridTemplateRows: 'auto auto 1fr auto',
  padding: 'clamp(20px, 2.5vw, 32px)',
  borderRadius: radius[24],
  background: color.neutral[50],
});
globalStyle(`${serviceCard} .${eyebrow}`, { marginBottom: space[16] });
export const serviceIllustration = style({
  aspectRatio: '328 / 140',
  marginTop: space[16],
  background: color.neutral[100],
  borderRadius: radius[16],
  '@media': { [mobile]: { aspectRatio: 'auto', height: '6dvh' } },
});
export const roleSection = style({ background: color.neutral[50] });
export const passes = style({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'start',
  gap: `clamp(16px, 4vw, ${space[48]})`,
  marginTop: space[16],
});
export const pass = style({
  ...typography.bodyM,
  textAlign: 'center',
  width: 'min(24%, 32dvh)',
  minWidth: 0,
  color: color.neutral[600],
  '@media': { [mobile]: { ...typography.bodyS, width: '46%' } },
});
export const passImage = style([
  fluidImage,
  {
    marginBottom: space[16],
    filter: 'drop-shadow(0 8px 12px rgba(14, 26, 46, .12))',
  },
]);
export const lastInvitation = style({
  justifyItems: 'center',
  textAlign: 'center',
  gap: space[24],
  paddingInline: gutter,
  color: color.neutral[0],
  background: color.neutral[900],
});
