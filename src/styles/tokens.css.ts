import { button } from '../components/button/button.css';
import { dialog } from '../components/dialog/dialog.css';
import { gnb } from '../components/gnb/gnb.css';
import { icon } from '../components/icon/icon.css';
import { input } from '../components/input/input.css';
import { logo } from '../components/logo/logo.css';
import { pass } from '../components/pass/pass.css';
import { color } from './colors.css';
import { grid, radius, space, stroke } from './layout.css';
import { font, typography } from './typography.css';

export const tokens = {
  color,
  font,
  typography,
  space,
  radius,
  stroke,
  grid,
  component: { logo, icon, button, input, dialog, gnb, pass },
};
