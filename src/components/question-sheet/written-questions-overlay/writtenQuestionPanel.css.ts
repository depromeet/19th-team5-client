import { style } from '@vanilla-extract/css';
import { color, radius, space, typography } from '@/styles/token';

export const panel = style({
  display: 'flex',
  flexDirection: 'column',
  gap: space[16],
  minWidth: 0,
  minHeight: 0,
  paddingBlock: space[32],
  paddingInline: space[32],
  border: `1px solid ${color.neutral[200]}`,
  borderRadius: radius[16],
  background: color.neutral[0],
  overflowY: 'auto',
  overscrollBehavior: 'contain',
  '@media': {
    '(max-width: 700px)': { padding: space[16] },
  },
});

export const header = style({
  display: 'flex',
  flexDirection: 'column',
  gap: space[4],
});

export const heading = style({
  ...typography.bodyLStrong,
  margin: 0,
  color: color.neutral[900],
});

export const helper = style({
  ...typography.caption,
  margin: 0,
  color: color.neutral[500],
  wordBreak: 'keep-all',
});

export const empty = style({
  ...typography.bodyM,
  margin: 0,
  color: color.neutral[500],
});

export const list = style({
  display: 'flex',
  flexDirection: 'column',
  gap: space[16],
  margin: 0,
  padding: 0,
  listStyle: 'none',
});

export const item = style({
  display: 'flex',
  flexDirection: 'column',
  gap: space[12],
  padding: space[16],
  borderRadius: radius[12],
  background: color.neutral[50],
});

export const question = style({
  ...typography.bodyM,
  display: 'flex',
  gap: space[12],
  margin: 0,
  color: color.neutral[900],
  overflowWrap: 'anywhere',
});

export const number = style({
  ...typography.bodySStrong,
  flexShrink: 0,
  lineHeight: 'inherit',
  color: color.neutral[900],
});

export const details = style({
  display: 'flex',
  flexDirection: 'column',
  gap: space[8],
  margin: 0,
  paddingInlineStart: space[20],
});

export const detail = style({
  display: 'flex',
  flexDirection: 'column',
  gap: space[4],
});

export const detailLabel = style({
  ...typography.caption,
  color: color.neutral[500],
});

export const detailText = style({
  ...typography.bodyS,
  margin: 0,
  color: color.neutral[800],
  wordBreak: 'keep-all',
  overflowWrap: 'anywhere',
});
