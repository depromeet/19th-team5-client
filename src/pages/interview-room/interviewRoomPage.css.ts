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

/**
 * 앉기 안내의 기본 위치. 3D 씬이 내 자리 위 좌표를 알려주면 그 위 24px로 옮겨 가고,
 * 씬을 불러오는 중이거나 3D를 쓸 수 없을 때만 이 자리에 있다.
 */
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
