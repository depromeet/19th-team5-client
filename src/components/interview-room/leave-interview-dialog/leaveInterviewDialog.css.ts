import { style } from '@vanilla-extract/css';
import { space } from '@/styles/token';

/** Figma의 다이얼로그는 제목과 보조 문구를 가운데 정렬한다. */
export const centeredText = style({ textAlign: 'center' });

/** 두 버튼이 같은 폭으로 나란히 선다. */
export const actions = style({
  display: 'grid',
  gridAutoColumns: 'minmax(0, 1fr)',
  gridAutoFlow: 'column',
  gap: space[8],
});
