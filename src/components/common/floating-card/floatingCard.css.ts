import { globalStyle, style } from '@vanilla-extract/css';
import { color, radius, space, typography } from '@/styles/token';
import { dialogShadow } from '../dialog/dialog.css';

export const card = style({
  ...typography.bodyM,
  display: 'flex',
  flexDirection: 'column',
  gap: space[16],
  width: '360px',
  maxWidth: '100%',
  minWidth: 0,
  padding: space[24],
  borderRadius: radius[24],
  background: color.neutral[0],
  color: color.neutral[900],
  boxShadow: dialogShadow,
});

export const body = style({
  flex: '1 1 auto',
  minHeight: 0,
  overflowY: 'auto',
  overflowWrap: 'anywhere',
});

export const bodyContent = style({ minHeight: '100px' });

export const footer = style({
  display: 'grid',
  gridAutoFlow: 'column',
  gridAutoColumns: 'minmax(0, 1fr)',
  flexShrink: 0,
  gap: space[8],
  marginTop: 'auto',
});

globalStyle(`${footer} > button`, {
  whiteSpace: 'normal',
  overflowWrap: 'anywhere',
});
