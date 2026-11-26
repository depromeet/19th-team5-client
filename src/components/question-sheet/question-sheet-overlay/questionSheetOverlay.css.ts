import { style } from '@vanilla-extract/css';
import { color, space } from '@/styles/token';

/** GNB는 그대로 보이도록 그 아래 영역만 덮는다. */
const gnbHeight = space[80];

export const overlay = style({
  position: 'fixed',
  inset: `${gnbHeight} 0 0`,
  width: '100%',
  maxWidth: 'none',
  height: `calc(100dvh - ${gnbHeight})`,
  maxHeight: 'none',
  margin: 0,
  paddingBlock: space[40],
  paddingInline: space[24],
  border: 0,
  background: color.neutral[50],
  color: color.neutral[900],
  overflowY: 'auto',
  selectors: {
    '&::backdrop': { background: 'transparent' },
  },
});
