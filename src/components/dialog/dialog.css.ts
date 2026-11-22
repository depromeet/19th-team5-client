import { createGlobalTheme } from '@vanilla-extract/css';
import { color } from '../../styles/colors.css';
import { grid, radius, space } from '../../styles/layout.css';
import { typography } from '../../styles/typography.css';
import { button } from '../button/button.css';

const { neutral } = color;
const values = createGlobalTheme(':root', {
  width: grid.layout.dialog,
  radius: radius[24],
  padding: space[32],
  titleGap: space[8],
  actionGap: space[32],
  buttonGap: space[8],
  buttonHeight: button.size.large.height,
  actionWidth: {
    single: '536px',
    equal: '264px',
    narrow: '136px',
    wide: '392px',
  },
  background: color.surface.page,
  title: color.text.title,
  description: neutral[600],
  overlay: color.dim,
  shadow: `0 20px 56px rgb(from ${neutral[900]} r g b / 16%)`,
});

export const dialog = {
  ...values,
  typography: { title: typography.h3, description: typography.body },
};
