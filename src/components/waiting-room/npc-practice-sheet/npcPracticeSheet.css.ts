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

export const name = style({ ...typography.h3, margin: 0 });

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

export const navigation = style({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: space[8],
  width: '100%',
});

export const meta = style({
  ...typography.bodySStrong,
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  gap: space[8],
});

export const answerLabel = style({ color: color.primary[500] });

export const controls = style({
  display: 'flex',
  alignItems: 'center',
  gap: space[8],
  marginInlineStart: 'auto',
});

export const controlsLabel = style({
  ...typography.caption,
  color: color.neutral[500],
});

export const arrowButton = style({
  selectors: {
    'button&': { width: '44px', height: '44px', padding: 0 },
  },
});

export const details = style({
  position: 'relative',
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  gap: space[12],
});

export const question = style({
  ...typography.title,
  margin: 0,
  wordBreak: 'keep-all',
  overflowWrap: 'anywhere',
});

export const answer = style({
  ...typography.bodyM,
  margin: 0,
});

/** 카드 전체를 눌러 질문과 모범답안을 뒤집는다. */
export const flipButton = style({
  ...typography.caption,
  display: 'inline-flex',
  alignItems: 'center',
  gap: space[4],
  padding: 0,
  border: 0,
  background: 'transparent',
  color: color.neutral[600],
  textAlign: 'start',
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
  borderRadius: radius[16],
  background: color.danger[500],
});

globalStyle(`${voiceBadge} > i`, {
  width: '2.5px',
  height: '6px',
  borderRadius: radius.full,
  background: color.neutral[0],
});
globalStyle(`${voiceBadge} > i:nth-child(even)`, { height: space[12] });
globalStyle(`${voiceBadge} > i:nth-child(3)`, { height: space[20] });

export const tipHeading = style({
  ...typography.bodySStrong,
  display: 'flex',
  alignItems: 'center',
  minHeight: '44px',
  margin: 0,
});

export const tips = style({
  ...typography.bodyM,
  display: 'grid',
  gap: space[16],
  marginBlock: `${space[16]} 0`,
  padding: 0,
  color: color.neutral[700],
  listStyle: 'none',
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

/** Figma의 다이얼로그는 제목과 보조 문구를 가운데 정렬한다. */
export const centeredText = style({ textAlign: 'center' });
