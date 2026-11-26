import { style } from '@vanilla-extract/css';
import { color, radius, space, typography } from '@/styles/token';
import { mobile } from '../HomePage.css';

export const feature = style({
  background: `linear-gradient(83deg, ${color.neutral[800]}, ${color.neutral[600]} 132%)`,
  color: color.neutral[0],
});
export const featureGrid = style({
  display: 'grid',
  gridTemplateColumns: 'minmax(0, 600fr) minmax(0, 560fr)',
  gap: 'clamp(24px, 4.5vw, 64px)',
  alignItems: 'center',
  '@media': { [mobile]: { gridTemplateColumns: '1fr' } },
});
export const featureCopy = style({ minWidth: 0 });
export const indexLabel = style({
  ...typography.bodySStrong,
  color: '#3182F6',
  marginBottom: space[16],
});
export const featureDescription = style({
  ...typography.bodyM,
  color: color.neutral[400],
  marginTop: space[16],
  whiteSpace: 'pre-line',
});
export const controls = style({
  display: 'flex',
  alignItems: 'center',
  gap: space[12],
  marginTop: space[32],
});
export const arrow = style({
  width: space[48],
  height: space[48],
  borderRadius: radius.full,
  border: 0,
  display: 'grid',
  placeItems: 'center',
  background: color.neutral[900],
  color: color.neutral[0],
  cursor: 'pointer',
  ':hover': { background: color.neutral[800] },
});
export const dots = style({
  display: 'flex',
  alignItems: 'center',
  gap: space[8],
  marginLeft: space[8],
});
export const dot = style({
  width: '6px',
  height: '6px',
  borderRadius: radius.full,
  background: color.neutral[300],
  selectors: {
    '&[data-active="true"]': { width: space[20], background: color.neutral[0] },
  },
});
export const preview = style({
  ...typography.bodyLStrong,
  aspectRatio: '600 / 340',
  display: 'flex',
  flexDirection: 'column',
  padding: 'clamp(16px, 2.2vw, 28px)',
  border: `1px solid ${color.neutral[200]}`,
  borderRadius: radius[24],
  color: color.neutral[900],
  background: color.neutral[0],
  gap: space[20],
});
export const previewBody = style({
  ...typography.bodyM,
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  justifyContent: 'center',
  gap: space[8],
  flex: 1,
  padding: space[20],
  color: color.neutral[700],
  borderRadius: radius[16],
  background: color.neutral[50],
});
