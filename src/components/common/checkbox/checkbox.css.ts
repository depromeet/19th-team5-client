import { style } from '@vanilla-extract/css';
import { color, radius, space, typography } from '@/styles/token';

const focusRing = {
  outline: `2px solid ${color.primary[500]}`,
  outlineOffset: '2px',
};

// 시각적으로 숨기되 포커스·스크린리더 접근은 유지한다.
export const hiddenInput = style({
  position: 'absolute',
  width: '1px',
  height: '1px',
  margin: '-1px',
  padding: 0,
  border: 0,
  overflow: 'hidden',
  clip: 'rect(0 0 0 0)',
  whiteSpace: 'nowrap',
});

// 투명한 input이 박스 전체를 덮어 클릭을 직접 받는다.
export const overlayInput = style({
  position: 'absolute',
  inset: 0,
  width: '100%',
  height: '100%',
  margin: 0,
  opacity: 0,
  cursor: 'inherit',
});

export const root = style({
  position: 'relative',
  display: 'inline-flex',
  flexShrink: 0,
  cursor: 'pointer',
  selectors: {
    '&:has(:disabled)': { cursor: 'not-allowed' },
  },
});

export const box = style({
  boxSizing: 'border-box',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '22px',
  height: '22px',
  border: `2px solid ${color.neutral[300]}`,
  borderRadius: '6px',
  color: color.neutral[0],
  selectors: {
    [`${overlayInput}:checked + &`]: {
      borderColor: color.neutral[900],
      background: color.neutral[900],
    },
    [`${overlayInput}:focus-visible + &`]: focusRing,
  },
});

export const checkIcon = style({
  display: 'none',
  selectors: {
    [`${overlayInput}:checked + ${box} &`]: { display: 'block' },
  },
});

export const chip = style({
  ...typography.bodySStrong,
  boxSizing: 'border-box',
  display: 'inline-flex',
  alignItems: 'center',
  height: '38px',
  paddingInline: space[16],
  borderRadius: radius.full,
  background: color.neutral[0],
  color: color.neutral[700],
  boxShadow: `inset 0 0 0 1px ${color.neutral[200]}`,
  whiteSpace: 'nowrap',
  selectors: {
    [`${hiddenInput}:checked + &`]: {
      background: color.neutral[900],
      color: color.neutral[0],
      boxShadow: 'none',
    },
    [`${hiddenInput}:focus-visible + &`]: focusRing,
  },
});
