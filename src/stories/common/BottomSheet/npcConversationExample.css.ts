import { globalStyle, style } from '@vanilla-extract/css';
import { color, radius, space, typography } from '@/styles/token';

export const header = style({
  display: 'flex',
  alignItems: 'center',
  gap: space[12],
  width: '100%',
  '@media': {
    '(max-width: 767px)': {
      display: 'grid',
      gridTemplateColumns: `${space[64]} minmax(0, 1fr) auto`,
      rowGap: space[8],
    },
  },
});

export const avatar = style({
  '@media': {
    '(min-width: 768px)': { marginInlineEnd: space[24] },
  },
});

export const introduction = style({
  flex: 1,
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  minWidth: 0,
  columnGap: space[16],
  '@media': {
    '(max-width: 767px)': { display: 'contents' },
  },
});

export const greeting = style({
  ...typography.bodyL,
  margin: 0,
  color: color.neutral[700],
  wordBreak: 'keep-all',
  '@media': {
    '(max-width: 767px)': { gridColumn: '1 / -1', gridRow: 2 },
  },
});

export const closeButton = style({
  selectors: {
    'button&': {
      width: '44px',
      height: '44px',
      padding: 0,
      flexShrink: 0,
      color: color.neutral[700],
      gridColumn: 3,
      gridRow: 1,
    },
  },
});

export const card = style({
  display: 'flex',
  flexDirection: 'column',
  gap: space[12],
  minHeight: '260px',
});

export const details = style({
  position: 'relative',
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  gap: space[12],
});

export const answer = style({
  ...typography.bodyM,
  margin: 0,
});

export const flipButton = style({
  ...typography.caption,
  display: 'inline-flex',
  alignItems: 'center',
  gap: space[4],
  border: 0,
  background: 'transparent',
  padding: 0,
  textAlign: 'start',
  color: color.neutral[600],
  cursor: 'pointer',
  selectors: {
    '&::after': { content: '""', position: 'absolute', inset: 0 },
  },
});

export const actions = style({
  display: 'flex',
  alignItems: 'center',
  gap: space[8],
});

export const voiceBadge = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '2px',
  width: '56px',
  height: '56px',
  flexShrink: 0,
  background: color.danger[500],
  borderRadius: radius[16],
});

globalStyle(`${voiceBadge} > i`, {
  background: color.neutral[0],
  width: '2.5px',
  height: '6px',
  borderRadius: radius.full,
});
globalStyle(`${voiceBadge} > i:nth-child(even)`, { height: space[12] });
globalStyle(`${voiceBadge} > i:nth-child(3)`, { height: space[20] });

export const tipHeading = style({
  ...typography.bodySStrong,
  minHeight: '44px',
  display: 'flex',
  alignItems: 'center',
  margin: 0,
});

export const tips = style({
  ...typography.bodyM,
  display: 'grid',
  gap: space[16],
  marginBlock: `${space[16]} 0`,
  listStyle: 'none',
  padding: 0,
  color: color.neutral[700],
});
