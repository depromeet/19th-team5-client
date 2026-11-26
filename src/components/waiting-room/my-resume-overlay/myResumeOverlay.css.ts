import { style } from '@vanilla-extract/css';

/** Figma: 1224px 중 왼쪽 1016px. 질문지 화면의 서류 칸보다 넓게 읽는다. */
export const panel = style({
  flex: 1,
  width: '100%',
  maxWidth: '1016px',
});
