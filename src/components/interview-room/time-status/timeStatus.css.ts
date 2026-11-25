import { style } from '@vanilla-extract/css';
import { color, radius, space, typography } from '@/styles/token';
import { hudShadow } from '../hud.css';

export const status = style({
  display: 'inline-flex',
  alignItems: 'center',
  gap: space[12],
  paddingBlock: space[8],
  paddingInline: `${space[16]} ${space[8]}`,
  borderRadius: radius.full,
  background: color.neutral[0],
  boxShadow: hudShadow,
  whiteSpace: 'nowrap',
});

export const remainingLabel = style({
  ...typography.bodyS,
  color: color.neutral[600],
});

export const divider = style({
  alignSelf: 'stretch',
  width: '1px',
  marginBlock: space[4],
  background: color.neutral[200],
});

/** 진행 바는 문구 폭에 맞춰 늘어나되, Figma의 최소 폭(172px)보다 줄지 않는다. */
export const progress = style({
  display: 'flex',
  flexDirection: 'column',
  gap: space[4],
  minWidth: '172px',
});

export const progressText = style({
  display: 'flex',
  alignItems: 'baseline',
  gap: space[12],
  margin: 0,
});

export const progressLabel = style({
  ...typography.bodySStrong,
  color: color.neutral[900],
});

export const progressTime = style({
  ...typography.bodyS,
  color: color.neutral[500],
  fontVariantNumeric: 'tabular-nums',
});

export const track = style({
  height: space[4],
  overflow: 'hidden',
  borderRadius: radius.full,
  background: color.neutral[200],
});

export const fill = style({
  height: '100%',
  borderRadius: radius.full,
  background: color.neutral[900],
});
