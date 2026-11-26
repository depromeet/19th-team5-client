import { style } from '@vanilla-extract/css';
import { color, radius, space, typography } from '@/styles/token';

const narrow = '(max-width: 800px)';
export const page = style({
  minHeight: '100dvh',
  background: color.neutral[50],
  color: color.neutral[900],
});
export const main = style({
  maxWidth: '1224px',
  width: `calc(100% - 2 * ${space[24]})`,
  marginInline: 'auto',
  paddingBlock: `${space[48]} ${space[80]}`,
  display: 'grid',
  gap: space[32],
  '@media': {
    [narrow]: {
      width: `calc(100% - 2 * ${space[16]})`,
      paddingBlock: space[32],
      gap: space[24],
    },
  },
});
export const heading = style({
  ...typography.h1,
  margin: 0,
  wordBreak: 'keep-all',
  '@media': { [narrow]: { ...typography.h2 } },
});
export const subtitle = style({
  ...typography.bodyL,
  margin: `${space[8]} 0 0`,
  color: color.neutral[600],
});
export const sectionTitle = style({ ...typography.h3, margin: 0 });
export const muted = style({
  ...typography.bodyS,
  margin: 0,
  color: color.neutral[600],
});
export const panel = style({
  padding: space[32],
  background: color.neutral[0],
  borderRadius: radius[16],
  display: 'grid',
  gap: space[24],
  minWidth: 0,
  '@media': { [narrow]: { padding: space[16] } },
});
export const bordered = style([
  panel,
  { border: `1px solid ${color.neutral[200]}`, alignContent: 'start' },
]);
export const row = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  flexWrap: 'wrap',
  gap: space[12],
});
export const chips = style({
  display: 'flex',
  alignItems: 'center',
  flexWrap: 'wrap',
  gap: space[8],
  margin: 0,
  padding: 0,
  border: 0,
});
export const columns = style({
  display: 'grid',
  gridTemplateColumns: 'minmax(0, 2fr) minmax(280px, 1fr)',
  alignItems: 'start',
  gap: space[24],
  '@media': { [narrow]: { gridTemplateColumns: 'minmax(0, 1fr)' } },
});
export const stack = style({ display: 'grid', gap: space[16] });
export const roleChoices = style([
  stack,
  { margin: 0, padding: 0, border: 0, minWidth: 0 },
]);
export const grid = style({
  display: 'grid',
  gap: space[20],
  gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 285px), 1fr))',
});
export const roomCard = style({
  display: 'grid',
  gap: space[16],
  alignContent: 'start',
  borderRadius: radius[16],
  background: color.neutral[50],
  padding: space[24],
});
export const time = style({ ...typography.h2 });
export const banner = style([
  row,
  {
    padding: space[24],
    background: color.primary[100],
    borderRadius: radius[16],
  },
]);
export const info = style({
  background: color.neutral[50],
  borderRadius: radius[12],
  padding: space[16],
  display: 'grid',
  gap: space[8],
});
export const empty = style({
  minHeight: '220px',
  display: 'grid',
  placeContent: 'center',
  justifyItems: 'center',
  gap: space[16],
  textAlign: 'center',
});
export const form = style([bordered, { gap: space[32] }]);
export const field = style({ border: 0, padding: 0, margin: 0, minWidth: 0 });
export const legend = style({
  ...typography.bodySStrong,
  padding: 0,
  marginBottom: space[8],
});
export const facts = style({
  display: 'grid',
  gridTemplateColumns: 'auto minmax(0, 1fr)',
  gap: space[12],
  margin: 0,
  ...typography.bodyM,
  color: color.neutral[600],
});
export const value = style({
  ...typography.bodyMStrong,
  textAlign: 'right',
  color: color.neutral[900],
  margin: 0,
  overflowWrap: 'anywhere',
});
export const roleCard = style({
  ...typography.bodyL,
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: space[16],
  minHeight: '304px',
  width: '100%',
  textAlign: 'left',
  border: 0,
  borderRadius: radius[24],
  padding: space[32],
  background: color.neutral[0],
  color: color.neutral[900],
  cursor: 'pointer',
  selectors: {
    '&[aria-pressed=true]': {
      boxShadow: `inset 0 0 0 3px ${color.primary[500]}`,
    },
    '&:disabled': { opacity: 0.6, cursor: 'not-allowed' },
  },
  '@media': { [narrow]: { padding: space[20], minHeight: '160px' } },
});
export const portrait = style({
  width: 'clamp(120px, 17vw, 236px)',
  aspectRatio: '1',
  borderRadius: radius.full,
  background: color.neutral[50],
  objectFit: 'cover',
  '@media': { [narrow]: { width: space[64] } },
});
export const roleCopy = style({
  display: 'grid',
  alignContent: 'space-between',
  alignSelf: 'stretch',
  gap: space[24],
});
export const roleTitle = style([chips, { marginBottom: space[8] }]);
export const roleHint = style({
  ...typography.bodySStrong,
  justifySelf: 'start',
  borderRadius: radius[8],
  padding: `${space[8]} ${space[12]}`,
  background: color.primary[50],
  color: color.neutral[700],
});
export const dialog = style({
  maxWidth: `calc(100% - 2 * ${space[16]})`,
  textAlign: 'center',
});
export const actions = style({
  display: 'flex',
  gap: space[8],
  flexWrap: 'wrap',
});
