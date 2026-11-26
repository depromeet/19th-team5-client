import { style } from '@vanilla-extract/css';
import { space } from '@/styles/token';

/** HUD 위치는 Figma(1920×1080, GNB 80px 아래 기준) 값을 따른다. */
const sideInset = '68px';

export const notice = style({
  position: 'absolute',
  top: space[24],
  right: sideInset,
});

export const upcoming = style({
  position: 'absolute',
  right: sideInset,
  bottom: space[48],
});

export const worldChat = style({
  position: 'absolute',
  left: sideInset,
  bottom: space[32],
});

/** 3D 씬이 생기면 키오스크 앞 캐릭터 머리 위로 옮긴다. */
export const kioskPrompt = style({
  position: 'absolute',
  top: '380px',
  left: '560px',
});
