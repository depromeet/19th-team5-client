import { style } from '@vanilla-extract/css';
import { color, radius, space, typography } from '@/styles/token';

export const panel = style({
  display: 'flex',
  flexDirection: 'column',
  minWidth: 0,
  minHeight: 0,
  overflow: 'hidden',
  border: `1px solid ${color.neutral[200]}`,
  borderRadius: radius[16],
  background: color.neutral[0],
});

export const tabs = style({
  selectors: {
    'div&': {
      flexShrink: 0,
      alignItems: 'flex-end',
      gap: space[24],
      paddingInline: space[32],
    },
  },
});

/** Figma의 서류 탭은 공통 Tabs보다 작은 14px 글자와 2px 표시줄을 쓴다. */
export const tab = style({
  selectors: {
    'button&': {
      ...typography.bodySStrong,
      minWidth: '44px',
      paddingTop: space[16],
      paddingBottom: '18px',
      paddingInline: 0,
    },
    'button&[aria-selected="true"]': { color: color.neutral[900] },
    'button&[aria-selected="false"]': { color: color.neutral[500] },
    'button&::after': {
      height: '2px',
      borderRadius: 0,
      background: color.neutral[900],
    },
    'button&:disabled': { cursor: 'not-allowed' },
  },
});

export const paper = style({
  display: 'flex',
  flexDirection: 'column',
  flex: 1,
  minHeight: 0,
  gap: space[16],
  padding: space[32],
  overflowY: 'auto',
  overscrollBehavior: 'contain',
});

export const profile = style({
  display: 'flex',
  alignItems: 'center',
  gap: space[12],
});

export const profileText = style({
  display: 'flex',
  flexDirection: 'column',
  flex: 1,
  gap: space[4],
  minWidth: 0,
});

export const name = style({
  ...typography.bodyLStrong,
  margin: 0,
  color: color.neutral[900],
});

export const summary = style({
  ...typography.caption,
  margin: 0,
  color: color.neutral[500],
});

export const divider = style({
  flexShrink: 0,
  width: '100%',
  height: '1px',
  margin: 0,
  border: 0,
  background: color.neutral[200],
});

export const answers = style({
  display: 'flex',
  flexDirection: 'column',
  gap: space[24],
  margin: 0,
});

export const answer = style({
  display: 'flex',
  flexDirection: 'column',
  gap: space[8],
});

export const answerQuestion = style({
  ...typography.bodySStrong,
  color: color.neutral[500],
});

export const answerText = style({
  ...typography.bodyM,
  margin: 0,
  color: color.neutral[800],
  wordBreak: 'keep-all',
  overflowWrap: 'anywhere',
});
