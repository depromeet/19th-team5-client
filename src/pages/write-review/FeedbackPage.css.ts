import { globalStyle, style } from '@vanilla-extract/css';
import { stack } from '@/components/review/Review.css';
import { color, radius, space, typography } from '@/styles/token';

const mobile = '(max-width: 760px)';
export const tabs = style({ marginTop: space[32], flexWrap: 'wrap' });
export const fields = style({
  display: 'grid',
  gap: space[64],
  paddingTop: space[24],
  '@media': { [mobile]: { gap: space[32] } },
});
export const chips = style({
  display: 'flex',
  flexWrap: 'wrap',
  gap: space[8],
  marginBlock: space[8],
});
export const required = style({ color: color.danger[500] });
export const comment = style({ marginTop: space[8] });
globalStyle(`${comment} > div`, { height: '174px' });
export const memoList = style({
  display: 'grid',
  alignContent: 'start',
  gap: space[8],
  maxHeight: 432,
  overflowY: 'auto',
});
export const memo = style([
  stack,
  {
    padding: '12px 16px',
    borderRadius: radius[12],
    background: color.neutral[50],
  },
]);
export const memoText = style({
  ...typography.bodyS,
  color: color.neutral[700],
});
export const deadline = style({
  display: 'inline-flex',
  alignItems: 'center',
  background: color.danger[50],
  color: color.danger[500],
  borderRadius: radius.full,
  padding: '0 12px',
  ...typography.bodySStrong,
});
globalStyle(`${deadline} [role=timer]`, { paddingInline: 0, gap: 0 });
globalStyle(`${deadline} [role=timer] > span`, { display: 'none' });
