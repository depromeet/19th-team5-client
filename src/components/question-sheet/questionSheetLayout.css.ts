import { style } from '@vanilla-extract/css';
import { space } from '@/styles/token';

export const mobile = '(max-width: 700px)';

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

/** 작성 화면과 읽기 전용 화면에 같은 서류·질문 레이아웃을 쓴다. */
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
