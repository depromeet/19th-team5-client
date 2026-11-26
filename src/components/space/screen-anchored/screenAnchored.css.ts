import { style } from '@vanilla-extract/css';

/** HUD 레이어 왼쪽 위를 기준으로 두고, 컴포넌트가 transform으로 좌표까지 옮긴다. */
export const anchored = style({
  position: 'absolute',
  top: 0,
  left: 0,
  willChange: 'transform',
});
