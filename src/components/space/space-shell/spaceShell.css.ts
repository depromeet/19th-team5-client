import { globalStyle, style } from '@vanilla-extract/css';
import { color } from '@/styles/token';

export const root = style({
  display: 'flex',
  flexDirection: 'column',
  height: '100dvh',
  overflow: 'hidden',
  background: color.neutral[200],
});

export const stage = style({
  position: 'relative',
  flex: 1,
  minHeight: 0,
  isolation: 'isolate',
});

export const sceneLayer = style({
  position: 'absolute',
  inset: 0,
});

/** HUD 빈 곳은 클릭이 3D 씬까지 닿도록 통과시키고, HUD 요소만 클릭을 받는다. */
export const hudLayer = style({
  position: 'absolute',
  inset: 0,
  pointerEvents: 'none',
});

globalStyle(`${hudLayer} > *`, {
  pointerEvents: 'auto',
});
