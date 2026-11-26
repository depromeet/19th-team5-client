import { style } from '@vanilla-extract/css';
import { color, radius, space, typography } from '@/styles/token';
import { hudShadow } from '../hud.css';

/** 카드는 접힌 버튼 자리에서 왼쪽 위로 펼친다. 카드가 바깥으로 나가도 호버가 이어지도록 같은 상자 안에 둔다. */
export const peek = style({
  position: 'relative',
  width: space[64],
  height: space[64],
});

export const toggle = style({
  selectors: {
    'button&': {
      width: space[64],
      height: space[64],
      padding: 0,
      borderRadius: radius[16],
      background: color.success[400],
      color: color.neutral[0],
      boxShadow: hudShadow,
    },
    'button&[hidden]': { display: 'none' },
  },
});

/** 64px 상자 기준 100%가 되지 않도록 FloatingCard의 최대 너비를 화면 기준으로 바꾼다. */
export const card = style({
  position: 'absolute',
  right: 0,
  bottom: 0,
  selectors: {
    'aside&': { maxWidth: 'calc(100vw - 136px)' },
  },
});

export const content = style({
  display: 'flex',
  flexDirection: 'column',
  gap: space[16],
});

export const header = style({
  display: 'flex',
  alignItems: 'center',
  gap: space[12],
});

export const iconBadge = style({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
  width: space[32],
  height: space[32],
  borderRadius: radius[8],
  background: color.success[50],
  color: color.success[400],
});

export const label = style({
  ...typography.bodySStrong,
  flex: 1,
  minWidth: 0,
  margin: 0,
  color: color.neutral[600],
});

export const closeButton = style({
  selectors: {
    'button&': {
      width: space[32],
      height: space[32],
      margin: `-${space[8]}`,
      padding: 0,
      color: color.neutral[700],
    },
  },
});

export const titleGroup = style({
  display: 'flex',
  flexDirection: 'column',
  gap: space[8],
});

export const title = style({
  ...typography.h3,
  margin: 0,
  color: color.neutral[900],
});

export const description = style({
  ...typography.bodyM,
  margin: 0,
  color: color.neutral[600],
  wordBreak: 'keep-all',
});

export const previewBox = style({
  ...typography.bodyS,
  display: 'flex',
  flexDirection: 'column',
  gap: space[8],
  margin: 0,
  paddingBlock: space[12],
  paddingInline: space[16],
  borderRadius: radius[12],
  background: color.neutral[50],
  color: color.neutral[700],
  listStyle: 'none',
});

export const questionRow = style({
  display: 'flex',
  gap: space[8],
  minWidth: 0,
});

export const questionNumber = style({
  ...typography.bodySStrong,
  flexShrink: 0,
  color: color.primary[500],
});

export const questionText = style({
  flex: 1,
  minWidth: 0,
  overflow: 'hidden',
  color: color.neutral[900],
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
});

export const resumeQuestion = style({
  ...typography.bodySStrong,
  margin: 0,
  color: color.neutral[700],
});

export const resumeAnswer = style({
  margin: 0,
  display: '-webkit-box',
  overflow: 'hidden',
  WebkitBoxOrient: 'vertical',
  WebkitLineClamp: 2,
  wordBreak: 'keep-all',
  overflowWrap: 'anywhere',
});
