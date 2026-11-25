import { globalStyle, style } from '@vanilla-extract/css';
import * as interview from '@/components/review/Review.css';
import { color, radius, space, typography } from '@/styles/token';

export const reviewSheet = style([interview.sheet, {}]);
globalStyle(`${reviewSheet} ${interview.info}`, { marginTop: space[8] });
export const sectionHeading = style([interview.stack, { gap: space[4] }]);
export const keywordCaption = style([
  interview.stack,
  { gap: space[4], marginTop: space[4] },
]);
export const level = style([
  interview.inline,
  {
    justifyContent: 'flex-end',
    gap: space[8],
    ...typography.bodySStrong,
  },
]);
export const reserveButton = style({
  selectors: {
    'button&:disabled': {
      background: color.neutral[900],
      color: color.neutral[0],
    },
  },
});
export const lobbyButton = style({
  selectors: {
    'button&:disabled': {
      background: color.neutral[100],
      color: color.neutral[900],
    },
  },
});

export const section = style({
  display: 'grid',
  gap: space[16],
  marginTop: space[32],
});
export const keywords = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
  columnGap: space[32],
  paddingBlock: space[24],
  '@media': {
    '(max-width: 560px)': { gridTemplateColumns: '1fr', gap: space[16] },
  },
});
export const keyword = style({
  display: 'grid',
  justifyItems: 'center',
  textAlign: 'center',
  paddingInline: space[24],
  position: 'relative',
  selectors: {
    '& + &::before': {
      content: '""',
      position: 'absolute',
      left: -16,
      height: '100%',
      width: 1,
      background: color.neutral[200],
    },
  },
  '@media': {
    '(max-width: 560px)': {
      selectors: { '& + &::before': { display: 'none' } },
    },
  },
});
export const keywordIcon = style({ marginTop: space[8] });
export const envelope = style({
  width: '100%',
  height: 'auto',
  display: 'block',
});
export const details = style({
  background: color.neutral[50],
  borderRadius: radius[12],
  padding: `${space[16]} ${space[24]}`,
});
export const summary = style({
  ...typography.bodyMStrong,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: space[12],
  cursor: 'pointer',
  listStyle: 'none',
  selectors: {
    '&::-webkit-details-marker': { display: 'none' },
    '&:focus-visible': {
      outline: `2px solid ${color.primary[500]}`,
      outlineOffset: space[4],
    },
  },
});
globalStyle(`details[open] > ${summary} > svg`, {
  transform: 'rotate(180deg)',
});
export const group = style({
  padding: `${space[16]} ${space[20]}`,
  border: `1px solid ${color.neutral[200]}`,
  borderRadius: radius[16],
  selectors: { '&[open]': { borderColor: color.neutral[700] } },
});
export const groupTag = style({
  minHeight: space[24],
  ...typography.bodyS,
  selectors: {
    [`${group}[open] > summary > &`]: {
      background: color.neutral[800],
      color: color.neutral[0],
    },
  },
});
export const answer = style({
  display: 'grid',
  gap: space[12],
  marginTop: space[12],
});
export const question = style({ marginTop: space[12] });
export const questionSummary = style([
  summary,
  {
    justifyContent: 'flex-start',
    gap: space[8],
  },
]);
globalStyle(`${questionSummary} > svg`, {
  flexShrink: 0,
  color: color.neutral[500],
  transform: 'rotate(-90deg)',
});
globalStyle(`${question}[open] > ${questionSummary} > svg`, {
  transform: 'none',
});
export const questionAnswer = style([answer, { paddingLeft: space[24] }]);
export const questionIntent = style({
  ...typography.bodyS,
  color: color.neutral[700],
});
export const guide = style({
  background: color.primary[50],
  border: `1px solid ${color.primary[300]}`,
  borderRadius: radius[12],
  padding: `${space[12]} ${space[16]}`,
  display: 'grid',
  gap: space[4],
});
export const guideText = style({
  ...typography.bodyS,
  color: color.neutral[700],
});
export const guideTitle = style({
  ...typography.bodySStrong,
  color: color.primary[600],
});
