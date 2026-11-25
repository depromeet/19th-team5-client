import { style } from '@vanilla-extract/css';
import { color, radius, space, typography } from '@/styles/token';

export const history = style({
  display: 'flex',
  flexDirection: 'column',
  gap: space[12],
  minHeight: 0,
});

export const heading = style({
  ...typography.bodyS,
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: space[8],
  minHeight: space[32],
  color: color.neutral[500],
});

export const title = style({
  ...typography.bodySStrong,
  margin: 0,
  color: color.neutral[900],
});

/** Figma처럼 세 번째 메모가 살짝 보이는 높이에서 자르고, 아래쪽을 흐리게 해 더 있음을 알린다. */
export const list = style({
  display: 'grid',
  gap: space[8],
  maxHeight: '174px',
  margin: 0,
  padding: 0,
  paddingBottom: space[24],
  overflowY: 'auto',
  overscrollBehavior: 'contain',
  listStyle: 'none',
  maskImage: `linear-gradient(to bottom, black calc(100% - ${space[24]}), transparent)`,
});

export const item = style({
  display: 'flex',
  alignItems: 'flex-start',
  gap: space[12],
  paddingBlock: space[12],
  paddingInline: space[16],
  borderRadius: radius[12],
  background: color.neutral[0],
});

export const text = style({
  ...typography.bodyS,
  margin: 0,
  color: color.neutral[700],
  wordBreak: 'keep-all',
  overflowWrap: 'anywhere',
});

export const empty = style({
  ...typography.bodyS,
  margin: 0,
  color: color.neutral[600],
});
