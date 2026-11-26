import { createVar, globalStyle, keyframes, style } from '@vanilla-extract/css';
import { color, radius, space, typography } from '@/styles/token';
import { reducedMotion, tablet } from '../HomePage.css';

export const levelFillDurationMs = 560;

export const progressList = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(5, minmax(0, 1fr))',
  gap: space[12],
  marginTop: space[16],
  '@media': {
    [tablet]: { gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))' },
  },
});
export const progressCard = style({
  position: 'relative',
  isolation: 'isolate',
  padding: space[24],
  borderRadius: radius[16],
  background: color.neutral[50],
  color: color.neutral[400],
  '::before': {
    content: '""',
    position: 'absolute',
    inset: 0,
    zIndex: -1,
    borderRadius: 'inherit',
    background: color.neutral[900],
    transformOrigin: 'left center',
    transform: 'scaleX(0)',
  },
  selectors: {
    '&[data-achieved="true"]': { color: color.neutral[0] },
    '&[data-achieved="true"]::before': { transform: 'scaleX(1)' },
  },
  '@media': {
    '(prefers-reduced-motion: no-preference)': {
      transition: 'color 160ms ease-out 60ms',
      '::before': {
        transition: `transform ${levelFillDurationMs}ms cubic-bezier(0.22, 1, 0.36, 1)`,
      },
    },
  },
});
globalStyle(`${progressCard} p`, {
  ...typography.bodyS,
  color: color.neutral[500],
  marginTop: space[8],
});
globalStyle(`${progressCard}[data-achieved="true"] p`, {
  color: color.neutral[400],
});
export const confetti = style({
  position: 'absolute',
  top: space[12],
  right: space[32],
  pointerEvents: 'none',
  '@media': { [reducedMotion]: { display: 'none' } },
});
const burstX = createVar();
const burstY = createVar();
const burstTurn = createVar();
const burst = keyframes({
  '0%': { opacity: 0, transform: 'scale(0.2)' },
  '12%': { opacity: 1 },
  '65%': {
    opacity: 1,
    transform: `translate(${burstX}, ${burstY}) rotate(${burstTurn})`,
  },
  '100%': {
    opacity: 0,
    transform: `translate(${burstX}, calc(${burstY} + 15px)) rotate(calc(${burstTurn} + 60deg)) scale(.7)`,
  },
});
const confettiPiece = style({
  position: 'absolute',
  width: space[4],
  height: space[8],
  borderRadius: '2px',
  opacity: 0,
  '@media': {
    '(prefers-reduced-motion: no-preference)': {
      animation: `${burst} 650ms ease-out ${levelFillDurationMs}ms both`,
    },
  },
});
export const confettiPieces = (
  [
    [-27, -9, -70, color.primary[400]],
    [-24, -25, 80, color.success[400]],
    [-15, -35, -140, color.danger[300]],
    [-4, -40, 110, color.primary[300]],
    [8, -34, 160, color.success[300]],
    [19, -29, -100, color.primary[400]],
    [26, -16, 70, color.danger[300]],
    [22, -5, -130, color.success[400]],
  ] as const
).map(([x, y, turn, fill]) =>
  style([
    confettiPiece,
    {
      background: fill,
      vars: {
        [burstX]: `${x}px`,
        [burstY]: `${y}px`,
        [burstTurn]: `${turn}deg`,
      },
    },
  ]),
);
