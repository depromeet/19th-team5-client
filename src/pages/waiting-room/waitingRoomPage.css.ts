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

/**
 * 말 걸기 안내의 기본 위치(Figma). 3D 씬이 김대리 머리 위 좌표를 알려주면 그 위 24px로 옮겨 가고,
 * 씬을 불러오는 중이거나 3D를 쓸 수 없을 때만 이 자리에 있다.
 */
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
