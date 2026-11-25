import { globalStyle, style } from '@vanilla-extract/css';

export const root = style({
  position: 'relative',
  width: '100%',
  height: '100%',
  overflow: 'hidden',
});

export const canvas = style({
  display: 'block',
  width: '100%',
  height: '100%',
});

export const fallback = style({});

globalStyle(`${root}:has(${canvas}) > ${fallback}`, { display: 'none' });

export const defaultCard = style({
  position: 'absolute',
  top: '24%',
  left: '50%',
  height: '52%',
  maxWidth: '75%',
  transform: 'translateX(-50%) rotate(3deg)',
  borderRadius: '6%',
});
