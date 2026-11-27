import { createVar, style } from '@vanilla-extract/css';
import { color, space } from '@/styles/token';
import { mobile } from '../questionSheetLayout.css';

/** GNB는 그대로 보이도록 그 아래 영역만 덮는다. */
const gnbHeight = createVar();

export const overlay = style({
  vars: { [gnbHeight]: space[80] },
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
  '@media': {
    [mobile]: { paddingBlock: space[24], paddingInline: space[16] },
    '(max-width: 640px)': {
      vars: { [gnbHeight]: `calc(${space[80]} + ${space[20]})` },
    },
  },
  selectors: {
    '&::backdrop': { background: 'transparent' },
  },
});
