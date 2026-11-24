import { style } from '@vanilla-extract/css';
import { color, radius, space, typography } from '@/styles/token';

export const headerRow = style({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: space[12],
  width: '100%',
});

export const name = style({ ...typography.h3, margin: 0 });

export const interviewCard = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  gap: space[16],
  minHeight: '303px',
});
export const badge = style({
  ...typography.captionStrong,
  padding: `${space[4]} ${space[8]}`,
  background: color.neutral[100],
  color: color.neutral[700],
  borderRadius: radius[8],
});
export const question = style({
  ...typography.title,
  wordBreak: 'keep-all',
  overflowWrap: 'anywhere',
  margin: 0,
});
export const questionNavigation = style({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: space[8],
  width: '100%',
});
export const questionMeta = style({
  ...typography.bodySStrong,
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  gap: space[8],
});
export const answerLabel = style({ color: color.primary[500] });
export const questionControls = style({
  display: 'flex',
  alignItems: 'center',
  gap: space[8],
  marginInlineStart: 'auto',
});
export const navigationLabel = style({
  ...typography.caption,
  color: color.neutral[500],
});
export const arrowButton = style({
  selectors: {
    'button&': { width: '44px', height: '44px', padding: 0 },
  },
});
export const tip = style({
  display: 'flex',
  alignItems: 'center',
  gap: space[12],
});
export const tipNumber = style({
  ...typography.captionStrong,
  display: 'grid',
  placeItems: 'center',
  flexShrink: 0,
  width: space[24],
  height: space[24],
  borderRadius: radius.full,
  background: color.neutral[900],
  color: color.neutral[0],
});
export const memo = style({
  ...typography.bodyM,
  width: '100%',
  height: '100%',
  minHeight: space[80],
  padding: space[16],
  background: color.neutral[0],
  border: `1px solid ${color.neutral[200]}`,
  borderRadius: radius[12],
  color: color.neutral[900],
  resize: 'none',
});
