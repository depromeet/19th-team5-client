import { style } from '@vanilla-extract/css';
import { color, radius, space, typography } from '@/styles/token';

export const steps = style({
  ...typography.bodyM,
  display: 'flex',
  flexDirection: 'column',
  gap: space[12],
  margin: 0,
  padding: space[24],
  borderRadius: radius[12],
  background: color.neutral[50],
  color: color.neutral[800],
  listStyle: 'none',
});

export const step = style({
  display: 'flex',
  alignItems: 'center',
  gap: space[12],
});

export const stepNumber = style({
  ...typography.captionStrong,
  display: 'inline-grid',
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
