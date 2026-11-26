import { style } from '@vanilla-extract/css';
import { color, radius, space, typography } from '@/styles/token';

export const pass = style({
  position: 'relative',
  isolation: 'isolate',
  overflow: 'hidden',
  display: 'grid',
  gap: space[16],
  textAlign: 'left',
  padding: space[24],
  borderRadius: radius[16],
  color: color.neutral[0],
  background: `linear-gradient(130deg, ${color.neutral[900]}, ${color.neutral[800]})`,
});
export const row = style({
  ...typography.caption,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: space[8],
});
export const time = style({ ...typography.h2 });
export const watermark = style({
  position: 'absolute',
  zIndex: -1,
  bottom: 0,
  right: 0,
});
export const passEntry = style([
  row,
  {
    ...typography.bodyM,
    borderTop: `1px dashed ${color.neutral[500]}`,
    paddingTop: space[16],
  },
]);
export const barcode = style({
  width: space[64],
  height: space[24],
  flexShrink: 0,
  background: `repeating-linear-gradient(90deg, ${color.neutral[500]} 0 1px, transparent 1px 3px, ${color.neutral[500]} 3px 5px, transparent 5px 8px)`,
});
