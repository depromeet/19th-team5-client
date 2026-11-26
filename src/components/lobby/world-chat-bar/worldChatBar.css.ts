import { style } from '@vanilla-extract/css';
import { color, radius, space, typography } from '@/styles/token';

export const bar = style({
  display: 'flex',
  alignItems: 'center',
  gap: space[12],
  width: '360px',
  maxWidth: '100%',
  height: '56px',
  padding: space[12],
  border: `1px solid ${color.neutral[0]}`,
  borderRadius: '18px',
  background: color.neutral[700],
  backdropFilter: 'blur(12px)',
  boxShadow: '0 12px 16px rgb(5 13 26 / 24%)',
  color: color.neutral[0],
});

export const noticeTag = style({
  selectors: {
    'span&': { background: color.primary[500], color: color.neutral[0] },
  },
});

export const notice = style({
  ...typography.bodySStrong,
  flex: 1,
  minWidth: 0,
  margin: 0,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
});

export const chatChip = style({
  ...typography.bodySStrong,
  display: 'inline-flex',
  alignItems: 'center',
  flexShrink: 0,
  gap: space[4],
  paddingBlock: space[8],
  paddingInline: space[12],
  borderRadius: radius.full,
  background: color.neutral[0],
  color: color.neutral[500],
  whiteSpace: 'nowrap',
});

export const expandIcon = style({
  flexShrink: 0,
  color: color.neutral[300],
});
