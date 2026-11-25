import { style } from '@vanilla-extract/css';
import { space } from '@/styles/token';

export const dialog = style({
  maxWidth: 'calc(100% - 32px)',
  textAlign: 'center',
  '@media': { '(max-width: 520px)': { padding: space[20] } },
});
