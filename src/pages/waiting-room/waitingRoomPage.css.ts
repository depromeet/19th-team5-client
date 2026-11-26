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

/** 면접 시작 직전 카운트다운. 씬 전체를 어둡게 덮고 가운데에 숫자를 띄운다. */
export const startCountdown = style({
  position: 'absolute',
  inset: 0,
  display: 'grid',
  placeItems: 'center',
  background: 'rgb(18 23 28 / 40%)',
});

export const dock = style({
  position: 'absolute',
  bottom: space[32],
  left: '50%',
  transform: 'translateX(-50%)',
});

export const dockWithExit = style([
  dock,
  {
    '@media': {
      '(max-width: 640px)': {
        bottom: `calc(${space[48]} + ${space[64]} + ${space[12]})`,
      },
    },
  },
]);

/** Figma: 우측 68px · 하단 48px */
export const documentPeek = style({
  position: 'absolute',
  right: '68px',
  bottom: space[48],
});
