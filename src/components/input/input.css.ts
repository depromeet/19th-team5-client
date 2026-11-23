import { createGlobalTheme } from '@vanilla-extract/css';
import { color } from '../../styles/colors.css';
import { radius, space, stroke } from '../../styles/layout.css';
import { typography } from '../../styles/typography.css';

const { neutral } = color;
const values = createGlobalTheme(':root', {
  width: '360px',
  singleLineHeight: '52px',
  multilineHeight: '120px',
  radius: radius[12],
  paddingInline: space[16],
  paddingBlock: space[12],
  labelGap: space[8],
  helperGap: space[8],
  background: color.surface.page,
  foreground: color.text.title,
  border: color.border.default,
  borderWidth: stroke.default,
  placeholder: color.text.disabled,
  label: color.text.title,
  required: color.error.foreground,
  helper: color.text.secondary,
  counter: color.text.disabled,
  focused: { border: neutral[900], borderWidth: '1.5px' },
  error: { border: color.error.foreground, helper: color.error.foreground },
  disabled: {
    background: color.surface.section,
    border: color.border.default,
    placeholder: neutral[300],
    helper: color.text.disabled,
  },
});

export const input = {
  ...values,
  typography: {
    value: typography.body,
    label: typography.captionStrong,
    helper: typography.caption,
    counter: typography.caption,
  },
};
