import { style } from '@vanilla-extract/css';
import { color, radius, space, typography } from '@/styles/token';

/** Figma: 600px 다이얼로그 안에 면접관 카드 두 장을 나란히 둔다. */

export const centeredText = style({ textAlign: 'center' });

export const list = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(0, 1fr))',
  gap: space[12],
  margin: 0,
  padding: 0,
  listStyle: 'none',
});

export const card = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: space[24],
  borderRadius: radius[16],
  background: color.neutral[50],
  textAlign: 'center',
});

export const avatar = style({
  width: '88px',
  height: '88px',
  background: color.neutral[0],
});

export const name = style({
  ...typography.bodyMStrong,
  margin: `${space[16]} 0 0`,
  color: color.neutral[900],
});

export const level = style({
  ...typography.bodyS,
  margin: `${space[4]} 0 ${space[24]}`,
  color: color.neutral[500],
});
