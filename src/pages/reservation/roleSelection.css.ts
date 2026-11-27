import { style } from '@vanilla-extract/css';
import { color, radius, space, typography } from '@/styles/token';

const narrow = '(max-width: 800px)';

export const layout = style({
  display: 'grid',
  gridTemplateColumns: 'minmax(0, 800fr) minmax(280px, 392fr)',
  alignItems: 'start',
  gap: space[32],
  '@media': {
    [narrow]: { gridTemplateColumns: 'minmax(0, 1fr)', gap: space[24] },
  },
});

export const choices = style({
  display: 'grid',
  gap: space[24],
  margin: 0,
  padding: 0,
  border: 0,
  minWidth: 0,
});

export const card = style({
  ...typography.bodyL,
  display: 'grid',
  gridTemplateColumns: 'minmax(0, 1fr) auto',
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
      background: color.primary[50],
      boxShadow: `inset 0 0 0 3px ${color.primary[500]}`,
    },
    '&:disabled': { opacity: 0.6, cursor: 'not-allowed' },
  },
  '@media': { [narrow]: { padding: space[20], minHeight: '168px' } },
});

export const portrait = style({
  width: 'clamp(120px, 17vw, 240px)',
  aspectRatio: '1',
  borderRadius: radius.full,
  background: color.neutral[50],
  objectFit: 'cover',
  '@media': { [narrow]: { width: 'clamp(64px, 22vw, 144px)' } },
});

export const copy = style({
  display: 'grid',
  alignContent: 'space-between',
  alignSelf: 'stretch',
  gap: space[16],
  wordBreak: 'keep-all',
});

export const title = style({
  display: 'flex',
  alignItems: 'center',
  flexWrap: 'wrap',
  gap: space[8],
  marginBottom: space[8],
});

export const name = style({
  ...typography.h2,
  '@media': { [narrow]: { ...typography.h3 } },
});

export const ticket = style({
  ...typography.tag,
  display: 'inline-flex',
  alignItems: 'center',
  gap: space[4],
  padding: `${space[4]} ${space[8]}`,
  borderRadius: radius.full,
  background: color.primary[50],
  color: color.neutral[700],
});

export const ticketIcon = style({ flexShrink: 0 });

export const ticketAmount = style({ color: color.primary[500] });

export const hint = style({
  ...typography.bodySStrong,
  justifySelf: 'start',
  borderRadius: radius[8],
  padding: `${space[8]} ${space[12]}`,
  background: color.primary[50],
  color: color.neutral[700],
});

export const policy = style({
  ...typography.bodyS,
  display: 'grid',
  gap: space[4],
  margin: 0,
  padding: 0,
  listStyle: 'none',
  color: color.neutral[600],
  wordBreak: 'keep-all',
});
