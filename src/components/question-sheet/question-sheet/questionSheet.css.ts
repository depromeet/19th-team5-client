import { style } from '@vanilla-extract/css';
import { color, space, typography } from '@/styles/token';
import { mobile } from '../questionSheetLayout.css';

export const sheet = style({
  display: 'flex',
  flexDirection: 'column',
  gap: space[32],
  width: '100%',
  maxWidth: '1224px',
  height: '100%',
  minHeight: '640px',
  marginInline: 'auto',
  '@media': {
    [mobile]: { height: 'auto', minHeight: '100%', gap: space[16] },
  },
});

export const header = style({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: space[12],
});

export const title = style({
  ...typography.h1,
  margin: 0,
  color: color.neutral[900],
  '@media': { [mobile]: typography.h2 },
});

export const timerGroup = style({
  ...typography.caption,
  display: 'flex',
  alignItems: 'center',
  gap: space[12],
  color: color.neutral[500],
});

/** Figma의 다이얼로그는 제목과 보조 문구를 가운데 정렬한다. */
export const centeredText = style({ textAlign: 'center' });
