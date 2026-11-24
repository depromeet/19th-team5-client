import { style } from '@vanilla-extract/css';
import { color, space } from '@/styles/token';

export const pulse = style({
  display: 'inline-block',
  width: space[24],
  height: space[24],
  maxWidth: '100%',
  overflow: 'hidden',
  pointerEvents: 'none',
  selectors: {
    '&[data-variant="waveform"]': {
      width: '164px',
      height: space[16],
      color: color.neutral[900],
    },
    '&[data-idle="true"]': {
      backgroundImage: `radial-gradient(circle at 1.5px center, ${color.neutral[200]} 1.5px, transparent 1.5px)`,
      backgroundSize: '5px 100%',
    },
    '&[data-variant="waveform"][data-idle="true"]': {
      backgroundSize: '7px 100%',
    },
  },
});
