import { style } from '@vanilla-extract/css';
import { dialogShadow } from '@/components/common/dialog/dialog.css';
import { color, radius, space, typography } from '@/styles/token';

export const deviceSelect = style({
  position: 'relative',
});

export const deviceRow = style({
  display: 'flex',
  alignItems: 'center',
  gap: space[16],
  width: '100%',
  minHeight: '72px',
  margin: 0,
  paddingBlock: space[16],
  paddingInline: space[24],
  border: 0,
  borderRadius: radius[12],
  background: color.neutral[50],
  color: color.neutral[800],
  textAlign: 'start',
  cursor: 'pointer',
  selectors: {
    '&:focus-visible': {
      outline: `2px solid ${color.primary[500]}`,
      outlineOffset: '2px',
    },
  },
});

export const deviceTexts = style({
  display: 'flex',
  flexDirection: 'column',
  flex: 1,
  minWidth: 0,
  gap: space[4],
});

export const deviceName = style({
  ...typography.bodyMStrong,
  color: color.neutral[900],
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  selectors: {
    '&[data-missing="true"]': { color: color.danger[500] },
  },
});

export const deviceHint = style({
  ...typography.caption,
  color: color.neutral[500],
});

export const deviceList = style({
  position: 'absolute',
  zIndex: 1,
  top: `calc(100% + ${space[8]})`,
  right: 0,
  display: 'flex',
  flexDirection: 'column',
  width: '240px',
  padding: space[8],
  border: `1px solid ${color.neutral[200]}`,
  borderRadius: radius[12],
  background: color.neutral[0],
  boxShadow: dialogShadow,
});

export const deviceOption = style({
  ...typography.bodyS,
  display: 'flex',
  alignItems: 'center',
  gap: space[8],
  width: '100%',
  minHeight: space[40],
  margin: 0,
  paddingInline: space[12],
  border: 0,
  borderRadius: radius[8],
  background: 'transparent',
  color: color.neutral[900],
  textAlign: 'start',
  cursor: 'pointer',
  selectors: {
    '&[aria-selected="true"]': {
      ...typography.bodySStrong,
      background: color.neutral[100],
    },
    '&:hover': { background: color.neutral[50] },
    '&[aria-selected="true"]:hover': { background: color.neutral[100] },
    '&:focus-visible': {
      outline: `2px solid ${color.primary[500]}`,
      outlineOffset: '-2px',
    },
  },
});

export const deviceOptionLabel = style({
  flex: 1,
  minWidth: 0,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
});
