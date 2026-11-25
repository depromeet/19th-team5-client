import { globalStyle, style } from '@vanilla-extract/css';
import { color, radius, space, typography } from '@/styles/token';

const narrow = '(max-width: 900px)';
export const background = style({
  background: color.neutral[50],
  minHeight: 'calc(100svh - 80px)',
  color: color.neutral[900],
  paddingBlock: space[40],
  '@media': { [narrow]: { paddingBlock: space[20] } },
});
export const layout = style({
  display: 'grid',
  gridTemplateColumns: 'minmax(0, 808fr) minmax(0, 392fr)',
  gap: space[24],
  alignItems: 'start',
  maxWidth: 1224,
  width: 'calc(100% - 48px)',
  marginInline: 'auto',
  '@media': {
    [narrow]: {
      gridTemplateColumns: 'minmax(0, 1fr)',
      width: 'calc(100% - 32px)',
    },
  },
});
const surface = style({
  border: `1px solid ${color.neutral[200]}`,
  borderRadius: radius[24],
  background: color.neutral[0],
  minWidth: 0,
});
export const paper = style([
  surface,
  { padding: space[48], '@media': { [narrow]: { padding: space[20] } } },
]);
export const sidebar = style({
  display: 'grid',
  gap: space[16],
  position: 'sticky',
  top: space[16],
  '@media': {
    '(max-height: 820px), (max-width: 900px)': { position: 'static' },
  },
});
export const sideCard = style([
  surface,
  { padding: space[24], display: 'grid', gap: space[12] },
]);
export const profile = style({
  display: 'flex',
  alignItems: 'center',
  gap: space[12],
  ...typography.bodyLStrong,
  paddingBottom: space[12],
  borderBottom: `1px solid ${color.neutral[100]}`,
});
export const radios = style({
  border: 0,
  padding: 0,
  margin: 0,
  display: 'flex',
  gap: space[8],
  flexWrap: 'wrap',
});
globalStyle(`${radios} legend`, {
  ...typography.bodySStrong,
  padding: 0,
  marginBottom: space[8],
});
export const star = style({ color: color.danger[500] });
export const section = style({
  marginTop: space[48],
  scrollMarginBlock: space[16],
});
export const sectionTitle = style({
  display: 'flex',
  alignItems: 'center',
  gap: space[8],
  paddingBottom: space[16],
  borderBottom: `2px solid ${color.neutral[900]}`,
});
globalStyle(`${sectionTitle} h2`, { ...typography.h3, margin: 0 });
export const number = style({
  ...typography.bodySStrong,
  color: color.neutral[500],
  marginLeft: 'auto',
  whiteSpace: 'nowrap',
});
export const help = style({
  ...typography.bodyS,
  color: color.neutral[500],
  margin: `${space[16]} 0`,
});
export const entries = style({ display: 'grid', gap: space[16] });
export const experience = style({
  display: 'grid',
  gap: space[16],
  padding: space[24],
  background: color.neutral[50],
  borderRadius: radius[16],
  '@media': { '(max-width: 520px)': { padding: space[16] } },
});
export const itemHeading = style({
  ...typography.bodySStrong,
  color: color.neutral[600],
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: space[8],
  minHeight: 36,
});
globalStyle(`${itemHeading} h3`, {
  ...typography.bodyLStrong,
  color: color.neutral[900],
  margin: 0,
  overflowWrap: 'anywhere',
});
globalStyle(`${itemHeading} button`, { padding: space[8] });
export const threeFields = style({
  display: 'grid',
  gap: space[12],
  gridTemplateColumns: 'repeat(3,minmax(0,1fr))',
  '@media': {
    '(max-width: 600px)': {
      gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)',
    },
  },
});
export const rowActions = style({
  display: 'flex',
  justifyContent: 'flex-end',
  gap: space[8],
});
globalStyle(`${rowActions} button`, { minWidth: 84 });
export const summary = style({
  padding: space[20],
  border: `1px solid ${color.neutral[200]}`,
  borderRadius: radius[16],
});
export const meta = style({
  ...typography.bodyS,
  color: color.neutral[500],
  margin: `${space[8]} 0`,
});
globalStyle(`${meta} strong`, { color: color.primary[500] });
export const savedText = style({
  ...typography.bodyM,
  color: color.neutral[700],
  whiteSpace: 'pre-wrap',
  overflowWrap: 'anywhere',
  margin: `${space[12]} 0 0`,
});
export const add = style({});
globalStyle(`${add} button`, { justifyContent: 'center' });
globalStyle(`${add} button:disabled`, { opacity: 0.6, cursor: 'not-allowed' });
export const answer = style({ display: 'grid', gap: space[12] });
export const selectWrap = style({ position: 'relative' });
globalStyle(`${selectWrap} select`, {
  ...typography.bodyMStrong,
  color: color.neutral[900],
  background: color.neutral[0],
  border: `1px solid ${color.neutral[200]}`,
  borderRadius: radius[12],
  appearance: 'none',
  padding: `${space[12]} ${space[40]} ${space[12]} ${space[16]}`,
  height: 52,
  width: '100%',
});
globalStyle(`${selectWrap} svg`, {
  position: 'absolute',
  right: space[16],
  top: '50%',
  transform: 'translateY(-50%)',
  pointerEvents: 'none',
});
export const error = style({
  ...typography.bodyS,
  color: color.danger[600],
  margin: 0,
});
export const uploads = style({
  display: 'grid',
  gap: space[16],
  marginTop: space[16],
});
export const drop = style({
  ...typography.bodyMStrong,
  color: color.neutral[900],
  cursor: 'pointer',
  minHeight: 174,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: space[8],
  padding: space[16],
  textAlign: 'center',
  background: color.neutral[50],
  border: `1px dashed ${color.neutral[300]}`,
  borderRadius: radius[16],
  selectors: {
    '&[data-dragging="true"]': {
      borderColor: color.primary[500],
      background: color.primary[50],
    },
  },
});
export const clip = style({
  display: 'grid',
  placeItems: 'center',
  width: space[48],
  height: space[48],
  borderRadius: radius.full,
  background: color.neutral[0],
  color: color.neutral[600],
  marginBottom: space[4],
});
export const muted = style({ ...typography.bodyS, color: color.neutral[500] });
export const file = style({
  display: 'flex',
  alignItems: 'center',
  gap: space[12],
  padding: space[16],
  border: `1px solid ${color.neutral[200]}`,
  borderRadius: radius[12],
  overflowWrap: 'anywhere',
});
export const fileName = style({ ...typography.bodyMStrong, margin: 0 });
export const status = style({
  ...typography.caption,
  color: color.success[500],
  margin: `${space[4]} 0 0`,
});
export const removeFile = style({ marginLeft: 'auto', flexShrink: 0 });
export const progressBox = style({
  display: 'grid',
  gap: space[12],
  padding: space[24],
  border: `1px solid ${color.neutral[300]}`,
  borderRadius: radius[16],
  justifyItems: 'start',
  overflowWrap: 'anywhere',
});
export const progress = style({
  width: '100%',
  height: 6,
  appearance: 'none',
  borderRadius: radius.full,
  overflow: 'hidden',
  accentColor: color.primary[500],
  '::-webkit-progress-bar': { background: color.neutral[200] },
  '::-webkit-progress-value': { background: color.primary[500] },
});
export const qualityHeader = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  ...typography.bodyLStrong,
});
globalStyle(`${qualityHeader} strong`, {
  ...typography.h3,
  color: color.primary[500],
});
export const meter = style({ display: 'flex', gap: space[4] });
globalStyle(`${meter} span`, {
  flex: 1,
  height: space[8],
  borderRadius: radius.full,
  background: color.neutral[100],
});
globalStyle(`${meter} span[data-on="true"]`, {
  background: color.primary[500],
});
export const meterLegend = style({
  ...typography.bodyS,
  color: color.neutral[400],
  display: 'flex',
  justifyContent: 'space-between',
  gap: space[8],
});
export const hint = style({
  ...typography.bodyS,
  display: 'grid',
  gap: space[4],
  background: color.primary[50],
  padding: `${space[12]} ${space[16]}`,
  borderRadius: radius[12],
});
globalStyle(`${hint} strong`, { color: color.primary[500] });
export const checklist = style({
  listStyle: 'none',
  padding: 0,
  margin: `${space[4]} 0`,
  display: 'grid',
  gap: space[4],
});
globalStyle(`${checklist} li`, {
  display: 'flex',
  gap: space[12],
  alignItems: 'center',
  minHeight: 48,
  paddingInline: space[12],
  borderRadius: radius[8],
  ...typography.bodyMStrong,
  color: color.neutral[700],
});
globalStyle(`${checklist} li:nth-child(2)`, { background: color.neutral[50] });
globalStyle(`${checklist} li small`, {
  ...typography.caption,
  marginLeft: 'auto',
  color: color.neutral[500],
});
