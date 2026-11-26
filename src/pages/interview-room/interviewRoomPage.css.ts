import { style } from '@vanilla-extract/css';
import { space } from '@/styles/token';

/** HUD 위치는 Figma(1920×1080, 면접방은 GNB 없음) 값을 따른다. */

export const partStepper = style({
  position: 'absolute',
  top: space[24],
  left: space[24],
});

export const timeStatus = style({
  position: 'absolute',
  top: space[24],
  right: space[24],
});

export const stageCard = style({
  position: 'absolute',
  top: '139px',
  left: '50%',
  transform: 'translateX(-50%)',
});

/** 3D 씬이 생기면 내 자리 의자 위로 옮긴다. */
export const seatPrompt = style({
  position: 'absolute',
  top: '600px',
  left: '50%',
  transform: 'translateX(-50%)',
});

export const dock = style({
  position: 'absolute',
  bottom: space[24],
  left: '50%',
  transform: 'translateX(-50%)',
});
