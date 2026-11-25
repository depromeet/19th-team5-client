import { globalStyle, style } from '@vanilla-extract/css';
import { color, radius, space, typography } from '@/styles/token';

const mobile = '(max-width: 760px)';

export const page = style({
  minHeight: '100dvh',
  background: color.neutral[50],
  color: color.neutral[900],
});
globalStyle(`${page} :is(h1,h2,h3,p)`, { margin: 0 });
export const layout = style({
  display: 'grid',
  alignItems: 'start',
  gridTemplateColumns: 'minmax(0, 808fr) minmax(280px, 392fr)',
  gap: space[24],
  width: 'calc(100% - 48px)',
  maxWidth: 1224,
  margin: '0 auto',
  paddingBlock: space[40],
  '@media': {
    [mobile]: {
      gridTemplateColumns: 'minmax(0, 1fr)',
      width: 'calc(100% - 32px)',
      paddingBlock: space[16],
      gap: space[12],
    },
  },
});
const panel = style({
  minWidth: 0,
  background: color.neutral[0],
  border: `1px solid ${color.neutral[200]}`,
  borderRadius: radius[24],
});
export const sheet = style([
  panel,
  { padding: space[48], '@media': { [mobile]: { padding: space[24] } } },
]);
export const side = style({ display: 'grid', gap: space[12], minWidth: 0 });
export const card = style([
  panel,
  { display: 'grid', gap: space[16], padding: space[24] },
]);
export const row = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: space[12],
});
export const inline = style({
  display: 'flex',
  alignItems: 'center',
  gap: space[12],
});
export const heading = style({
  ...typography.h1,
  wordBreak: 'keep-all',
  '@media': { [mobile]: { ...typography.h2 } },
});
export const subtitle = style({ ...typography.title });
export const cardTitle = style({ ...typography.bodyLStrong });
export const note = style({ ...typography.bodyS, color: color.neutral[500] });
export const text = style({ ...typography.bodyM, color: color.neutral[700] });
export const info = style([
  inline,
  {
    ...typography.bodyS,
    color: color.neutral[700],
    padding: '12px 16px',
    marginTop: space[12],
    background: color.neutral[50],
    borderRadius: radius[12],
  },
]);
globalStyle(`${info} svg`, { flexShrink: 0 });
export const stack = style({ display: 'grid', gap: space[8], minWidth: 0 });
export const inset = style({
  display: 'grid',
  gap: space[12],
  padding: space[24],
  background: color.neutral[50],
  borderRadius: radius[12],
});
export const divider = style({
  height: 1,
  margin: 0,
  width: '100%',
  border: 0,
  background: color.neutral[100],
});
export const status = style({
  ...typography.bodySStrong,
  color: color.success[700],
});
export const error = style({ ...typography.bodyS, color: color.danger[600] });
export const dialog = style({
  textAlign: 'center',
  wordBreak: 'keep-all',
  selectors: { 'dialog&::backdrop': { background: `${color.neutral[900]}73` } },
  maxWidth: 'calc(100vw - 32px)',
  maxHeight: 'calc(100dvh - 32px)',
  color: color.neutral[900],
});
export const dialogActions = style({
  display: 'grid',
  gridAutoColumns: 'minmax(0, 1fr)',
  gridAutoFlow: 'column',
  width: '100%',
  gap: space[8],
});
