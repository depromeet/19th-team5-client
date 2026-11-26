import { style } from '@vanilla-extract/css';
import { color, radius, space, typography } from '@/styles/token';

/**
 * 녹음 동의 줄을 뺀 만큼 아래 공간이 줄어, 장치 목록이 다이얼로그 밖으로 펼쳐지게 둔다.
 * (기본값 overflow: auto면 목록을 열 때 다이얼로그가 스크롤된다.)
 */
export const dialog = style({
  selectors: {
    'dialog&': { overflow: 'visible' },
  },
});

export const body = style({
  display: 'flex',
  flexDirection: 'column',
  gap: space[24],
});

export const micBox = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: space[16],
  paddingTop: space[24],
  paddingInline: space[20],
  paddingBottom: space[20],
  borderRadius: radius[16],
  background: color.neutral[50],
});

/** 듣는 중인 아바타 주변의 파란 빛. Figma: drop-shadow(0 0 12px rgba(54,84,240,0.62)) */
export const avatar = style({
  filter: 'drop-shadow(0 0 12px rgb(54 84 240 / 62%))',
});

export const status = style({
  ...typography.bodySStrong,
  display: 'flex',
  alignItems: 'center',
  gap: space[8],
  margin: 0,
  color: color.neutral[900],
});

export const statusDot = style({
  width: space[8],
  height: space[8],
  borderRadius: radius.full,
  background: color.neutral[400],
  selectors: {
    '&[data-on="true"]': { background: color.success[500] },
  },
});

export const elapsed = style({
  color: color.neutral[500],
  fontVariantNumeric: 'tabular-nums',
});

export const waveGroup = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
});

export const wave = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: space[40],
});

export const helper = style({
  ...typography.caption,
  margin: 0,
  color: color.neutral[500],
});

/** Figma의 다이얼로그는 제목과 보조 문구를 가운데 정렬한다. */
export const centeredText = style({ textAlign: 'center' });
