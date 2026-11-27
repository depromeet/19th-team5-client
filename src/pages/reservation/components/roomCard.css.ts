import { style } from '@vanilla-extract/css';
import { color, radius, space, typography } from '@/styles/token';

export const card = style({
  display: 'grid',
  gridTemplateRows: 'auto 1fr auto auto',
  gap: space[16],
  padding: space[24],
  borderRadius: radius[16],
  background: color.neutral[50],
});

export const header = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: space[8],
});

export const schedule = style({
  display: 'flex',
  alignItems: 'baseline',
  flexWrap: 'wrap',
  columnGap: space[8],
});

export const time = style({
  ...typography.h2,
  fontVariantNumeric: 'tabular-nums',
});

export const date = style({ ...typography.tag, color: color.neutral[600] });

export const details = style({
  display: 'grid',
  alignContent: 'start',
  gap: space[8],
});

export const title = style({
  ...typography.h3,
  margin: 0,
  wordBreak: 'keep-all',
});

export const meta = style({
  ...typography.bodyS,
  margin: 0,
  color: color.neutral[600],
});

export const seats = style({
  ...typography.bodySStrong,
  display: 'flex',
  alignItems: 'center',
  flexWrap: 'wrap',
  columnGap: space[16],
  rowGap: space[4],
  minHeight: space[24],
  color: color.neutral[700],
});

export const seatGroup = style({
  display: 'inline-flex',
  alignItems: 'center',
  gap: space[4],
});

export const availableSeat = style({ color: color.neutral[500] });
