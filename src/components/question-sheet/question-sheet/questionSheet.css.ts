import { style } from '@vanilla-extract/css';
import { color, space, typography } from '@/styles/token';

const mobile = '(max-width: 700px)';

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
});

export const timerGroup = style({
  ...typography.caption,
  display: 'flex',
  alignItems: 'center',
  gap: space[12],
  color: color.neutral[500],
});

export const body = style({
  display: 'flex',
  flexDirection: 'column',
  flex: 1,
  minHeight: 0,
  gap: space[12],
});

export const candidates = style({
  display: 'flex',
  flexWrap: 'wrap',
  gap: space[8],
  margin: 0,
  padding: 0,
  border: 0,
});

export const columns = style({
  display: 'grid',
  gridTemplateColumns: 'minmax(0, 704fr) minmax(0, 496fr)',
  flex: 1,
  minHeight: 0,
  gap: space[24],
  '@media': {
    [mobile]: {
      gridTemplateColumns: 'minmax(0, 1fr)',
      gridTemplateRows: 'min(40dvh, 360px) auto',
      gap: space[16],
    },
  },
});

/** Figma의 다이얼로그는 제목과 보조 문구를 가운데 정렬한다. */
export const centeredText = style({ textAlign: 'center' });
