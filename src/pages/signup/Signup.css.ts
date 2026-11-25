import { style } from '@vanilla-extract/css';
import { color, radius, space, typography } from '@/styles/token';

const mobile = '(max-width: 800px)';

export const signup = style({ WebkitFontSmoothing: 'antialiased' });

export const main = style({
  display: 'grid',
  alignItems: 'center',
  minHeight: `calc(100svh - ${space[80]})`,
  width: `calc(100% - 2 * ${space[24]})`,
  maxWidth: 1224,
  marginInline: 'auto',
  paddingBlock: space[40],
  color: color.neutral[900],
  '@media': {
    [mobile]: {
      width: `calc(100% - 2 * ${space[16]})`,
      paddingBlock: space[24],
    },
  },
});

export const step = style({
  display: 'grid',
  gridTemplateAreas: '"preview heading" "preview controls"',
  gridTemplateColumns: 'minmax(0, 600fr) minmax(0, 496fr)',
  gridTemplateRows: 'auto 1fr',
  columnGap: 'clamp(32px, calc((100vw - 1000px) * 0.38), 128px)',
  rowGap: space[32],
  '@media': {
    [mobile]: {
      gridTemplateAreas: '"heading" "preview" "controls"',
      gridTemplateColumns: 'minmax(0, 1fr)',
      gridTemplateRows: 'auto auto auto',
      rowGap: space[24],
    },
  },
});

export const heading = style({ gridArea: 'heading' });
export const title = style({
  ...typography.h1,
  margin: 0,
  wordBreak: 'keep-all',
  '@media': { [mobile]: { ...typography.h2 } },
});
export const notice = style({
  ...typography.bodyS,
  display: 'flex',
  alignItems: 'center',
  gap: space[8],
  margin: `${space[12]} 0 0`,
  padding: `${space[12]} ${space[16]}`,
  borderRadius: radius[12],
  background: color.neutral[50],
  color: color.neutral[700],
});
export const noticeIcon = style({ flexShrink: 0, color: color.neutral[600] });

export const preview = style({
  gridArea: 'preview',
  position: 'relative',
  overflow: 'hidden',
  minHeight: 'clamp(520px, calc(100svh - 160px), 760px)',
  borderRadius: radius[24],
  background: color.neutral[100],
  '@media': { [mobile]: { minHeight: 'clamp(254px, 36svh, 350px)' } },
});
export const resumePreview = style([preview, { borderRadius: 28 }]);

export const avatarPreview = style({
  position: 'absolute',
  top: 'calc(50% - 0.5px)',
  left: '51.6%',
  height: '62.5%',
  maxWidth: '90%',
  objectFit: 'contain',
  transform: 'translate(-50%, -50%)',
  transition: 'transform 360ms ease',
  selectors: {
    '&[data-flipped="true"]': {
      transform: 'translate(-50%, -50%) rotateY(180deg)',
    },
  },
  '@media': { '(prefers-reduced-motion: reduce)': { transition: 'none' } },
});
export const rotate = style({
  position: 'absolute',
  left: '51.5%',
  top: 'calc(87.5% - 1px)',
  transform: 'translate(-50%, -50%)',
  width: space[48],
  height: space[48],
  selectors: {
    'button&': {
      padding: 0,
      borderRadius: radius.full,
      color: color.neutral[400],
    },
    '&:focus-visible': { outline: `2px solid ${color.primary[500]}` },
  },
});
export const controls = style({
  gridArea: 'controls',
  display: 'flex',
  flexDirection: 'column',
  minWidth: 0,
});
export const label = style({
  ...typography.bodySStrong,
  marginBottom: space[8],
});
export const required = style({ color: color.danger[500] });
export const nicknameRow = style({ display: 'flex', gap: space[8] });
export const field = style({
  flex: 1,
  minWidth: 0,
  display: 'flex',
  alignItems: 'center',
  gap: space[4],
  paddingInline: space[16],
  height: 52,
  border: `1px solid ${color.neutral[200]}`,
  borderRadius: radius[12],
  selectors: {
    '&:focus-within': {
      borderColor: color.neutral[400],
      boxShadow: `inset 0 0 0 0.5px ${color.neutral[400]}`,
    },
    '&[data-invalid="true"]': {
      borderColor: color.danger[500],
      boxShadow: 'none',
    },
  },
  '@media': { [mobile]: { paddingInline: space[12] } },
});
export const input = style({
  ...typography.bodyM,
  flex: 1,
  minWidth: 0,
  width: '100%',
  border: 0,
  padding: 0,
  outline: 'none',
  color: color.neutral[900],
  background: 'transparent',
  '::placeholder': { color: color.neutral[400] },
});
export const count = style({
  ...typography.bodyS,
  whiteSpace: 'nowrap',
  color: color.neutral[400],
  selectors: {
    [`${field}[data-invalid="true"] &`]: { color: color.danger[500] },
  },
});
export const randomButton = style({
  minWidth: 124,
  '@media': { [mobile]: { minWidth: 0 } },
});
export const helper = style({
  ...typography.bodyS,
  margin: `${space[8]} 0 0`,
  color: color.neutral[500],
  selectors: { '&[data-invalid="true"]': { color: color.danger[500] } },
});
export const visuallyHidden = style({
  position: 'absolute',
  width: 1,
  height: 1,
  overflow: 'hidden',
  clipPath: 'inset(50%)',
  whiteSpace: 'nowrap',
});
export const choices = style({
  display: 'flex',
  gap: space[12],
  border: 0,
  padding: 0,
  minWidth: 0,
  margin: `${space[32]} 0 0`,
});
export const option = style({
  position: 'relative',
  display: 'flex',
  justifyContent: 'center',
  width: 'min(156px, calc((100% - 12px) / 2))',
  aspectRatio: '1',
  overflow: 'hidden',
  borderRadius: radius[16],
  background: color.neutral[50],
  cursor: 'pointer',
  selectors: {
    '&:has(:checked)::after': {
      content: '""',
      position: 'absolute',
      inset: 0,
      border: `2px solid ${color.primary[500]}`,
      borderRadius: 'inherit',
    },
    '&:has(:focus-visible)': {
      outline: `2px solid ${color.primary[500]}`,
      outlineOffset: 3,
    },
  },
});
export const portrait = style({
  height: '100%',
  maxWidth: '100%',
  objectFit: 'contain',
});
export const actions = style({
  display: 'grid',
  gap: space[12],
  marginTop: 'auto',
  paddingTop: space[32],
});

export const benefits = style({
  display: 'grid',
  gap: space[12],
  listStyle: 'none',
  padding: 0,
  margin: 0,
});
export const benefit = style({
  display: 'flex',
  alignItems: 'center',
  gap: space[16],
  minHeight: 88,
  padding: space[16],
  borderRadius: radius[16],
  background: color.neutral[50],
});
export const benefitTitle = style({ ...typography.bodyLStrong, margin: 0 });
export const benefitText = style({
  ...typography.bodyM,
  wordBreak: 'keep-all',
  color: color.neutral[600],
  margin: `${space[4]} 0 0`,
});
export const resumeSample = style({
  position: 'absolute',
  left: '50%',
  top: '17.1%',
  transform: 'translateX(-50%)',
  height: '65%',
  maxWidth: '78%',
  aspectRatio: '400 / 494',
  containerType: 'inline-size',
  background:
    "url('/images/signup/resume-sample.svg') center / contain no-repeat",
});
export const sampleHeader = style({
  display: 'flex',
  alignItems: 'center',
  gap: '4cqw',
  padding: '8cqw',
});
export const samplePortrait = style({
  width: '14cqw',
  height: '14cqw',
  objectFit: 'contain',
  objectPosition: 'top',
  borderRadius: radius.full,
});
export const sampleName = style({
  ...typography.h3,
  display: 'block',
  fontSize: '6cqw',
  lineHeight: 1.33,
});
export const sampleJob = style({
  ...typography.caption,
  display: 'block',
  marginTop: '1cqw',
  fontSize: '3cqw',
  lineHeight: 1.33,
  color: color.neutral[500],
});
export const sampleCaption = style({
  ...typography.caption,
  position: 'absolute',
  top: '85.5%',
  insetInline: space[12],
  margin: 0,
  textAlign: 'center',
  color: color.neutral[500],
});
