import { globalStyle, style } from '@vanilla-extract/css';
import { color, radius, space, typography } from '@/styles/token';

export const image = style({
  display: 'block',
  maxWidth: '100%',
  height: 'auto',
  boxShadow: `0 12px 24px ${color.neutral[900]}24`,
});

export const placeholder = style({
  ...typography.bodyS,
  display: 'grid',
  placeContent: 'center',
  justifyItems: 'center',
  gap: space[8],
  padding: space[12],
  background: color.primary[900],
  color: color.neutral[0],
  textAlign: 'center',
  maxWidth: '100%',
});

globalStyle(`${placeholder} img`, {
  width: '64px',
  borderRadius: radius[12],
  background: color.neutral[0],
});
