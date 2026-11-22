import { createGlobalTheme } from '@vanilla-extract/css';

export const font = createGlobalTheme(':root', {
  family: 'Pretendard, sans-serif',
  weight: { regular: '400', semibold: '600', bold: '700' },
});

function textStyle(
  size: number,
  weight: string,
  lineHeight: number,
  letterSpacing: string,
) {
  return {
    fontFamily: font.family,
    fontSize: `${size}px`,
    fontWeight: weight,
    lineHeight: `${lineHeight}px`,
    letterSpacing,
  };
}

const { regular, semibold, bold } = font.weight;
export const typography = createGlobalTheme(':root', {
  display: textStyle(56, bold, 64, '-0.02em'),
  h1: textStyle(40, bold, 52, '-0.015em'),
  h2: textStyle(32, bold, 44, '-0.01em'),
  h3: textStyle(24, bold, 32, '-0.01em'),
  title: textStyle(20, semibold, 28, '-0.005em'),
  bodyL: textStyle(18, regular, 28, '-0.003em'),
  bodyLStrong: textStyle(18, semibold, 28, '-0.003em'),
  body: textStyle(16, regular, 24, '-0.003em'),
  bodyStrong: textStyle(16, semibold, 24, '-0.003em'),
  bodyS: textStyle(14, regular, 20, '-0.002em'),
  bodySStrong: textStyle(14, semibold, 20, '-0.002em'),
  caption: textStyle(14, regular, 20, '0em'),
  captionStrong: textStyle(14, semibold, 20, '0em'),
});
