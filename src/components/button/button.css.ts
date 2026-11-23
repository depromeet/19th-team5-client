import { createGlobalTheme } from '@vanilla-extract/css';
import { color } from '../../styles/colors.css';
import { radius, space, stroke } from '../../styles/layout.css';
import { typography } from '../../styles/typography.css';

const { neutral } = color;
const values = createGlobalTheme(':root', {
  // DS/05의 Primary 채움은 임시 정장 블랙이다.
  primary: { background: neutral[900], foreground: color.text.inverse },
  secondary: { background: neutral[100], foreground: color.text.title },
  outline: {
    background: neutral[0],
    foreground: color.text.title,
    border: color.border.strong,
    borderWidth: stroke.default,
  },
  text: { background: 'transparent', foreground: color.text.link },
  danger: {
    background: color.error.foreground,
    foreground: color.text.inverse,
  },
  disabled: { background: neutral[300], foreground: color.text.disabled },
  size: {
    large: { height: '56px', radius: '14px', paddingInline: space[24] },
    medium: { height: '44px', radius: radius[12], paddingInline: space[16] },
    small: { height: space[32], radius: radius[8], paddingInline: space[12] },
  },
});

export const button = {
  ...values,
  typography: {
    large: typography.bodyLStrong,
    medium: typography.bodyStrong,
    small: typography.bodySStrong,
  },
};
