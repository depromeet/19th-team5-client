import { style } from '@vanilla-extract/css';

/** 화면에는 보이지 않고 스크린 리더만 읽는 요소 */
export const visuallyHidden = style({
  position: 'absolute',
  width: '1px',
  height: '1px',
  margin: '-1px',
  padding: 0,
  border: 0,
  overflow: 'hidden',
  clip: 'rect(0 0 0 0)',
  whiteSpace: 'nowrap',
});
