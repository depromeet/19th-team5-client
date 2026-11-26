import { style } from '@vanilla-extract/css';
import { space } from '@/styles/token';

/** HUD 위치는 Figma(1920×1080, GNB 80px 아래 기준) 값을 따른다. */

export const participants = style({
  position: 'absolute',
  top: '26px',
  left: '108px',
});

export const status = style({
  position: 'absolute',
  top: space[24],
  left: '50%',
  transform: 'translateX(-50%)',
});

/** 3D 씬이 생기면 김대리 옆 캐릭터 머리 위로 옮긴다. */
export const npcPrompt = style({
  position: 'absolute',
  top: '343px',
  left: '50%',
  transform: 'translateX(-50%)',
});

export const dock = style({
  position: 'absolute',
  bottom: space[32],
  left: '50%',
  transform: 'translateX(-50%)',
});
