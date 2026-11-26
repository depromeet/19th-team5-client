import { style } from '@vanilla-extract/css';
import { color, radius, space, typography } from '@/styles/token';
import { iconBadge } from '../lobbyCard.css';

export const header = style({
  display: 'flex',
  alignItems: 'center',
  gap: space[12],
  minHeight: '36px',
});

export const noticeIcon = style([
  iconBadge,
  {
    borderRadius: radius[8],
    background: color.danger[100],
    color: color.danger[500],
  },
]);

export const time = style({
  ...typography.caption,
  color: color.neutral[500],
});

export const titleGroup = style({
  display: 'flex',
  flexDirection: 'column',
  gap: space[8],
});
