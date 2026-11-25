import { style } from '@vanilla-extract/css';
import { color, radius, space, typography } from '@/styles/token';

/** Figma Interaction Prompt의 Key */
export const keycap = style({
  ...typography.bodyS,
  display: 'inline-flex',
  justifyContent: 'center',
  minWidth: space[24],
  paddingBlock: space[4],
  paddingInline: space[8],
  borderRadius: radius[8],
  background: color.neutral[0],
  color: color.neutral[700],
  fontFamily: 'inherit',
});
