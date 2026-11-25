import { style } from '@vanilla-extract/css';
import { color, radius, space, typography } from '@/styles/token';
import { hudShadow } from '../hud.css';

export const status = style({
  display: 'inline-flex',
  alignItems: 'center',
  gap: space[12],
  margin: 0,
  paddingBlock: space[12],
  paddingInline: `${space[24]} ${space[12]}`,
  borderRadius: radius.full,
  background: color.neutral[0],
  boxShadow: hudShadow,
  whiteSpace: 'nowrap',
});

export const statusLabel = style({
  ...typography.caption,
  color: color.neutral[500],
});

export const statusTitle = style({
  ...typography.bodySStrong,
  color: color.neutral[900],
});
