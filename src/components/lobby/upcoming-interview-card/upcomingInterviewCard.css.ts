import { style } from '@vanilla-extract/css';
import { color, radius, space, typography } from '@/styles/token';
import { content, iconBadge } from '../lobbyCard.css';

/** Figma의 예약 카드는 본문과 버튼 사이 간격이 12px로 알림 카드(16px)보다 좁다. */
export const upcomingCard = style({
  selectors: {
    'aside&': { gap: space[12] },
  },
});

export const upcomingContent = style([content, { gap: space[12] }]);

export const upcomingHeader = style({
  display: 'flex',
  alignItems: 'center',
  gap: space[8],
});

export const emptyTitle = style([
  upcomingHeader,
  { ...typography.bodyLStrong, margin: 0 },
]);

export const upcomingIcon = style([
  iconBadge,
  {
    borderRadius: '10px',
    background: color.primary[50],
    color: color.primary[500],
  },
]);

export const countdown = style({
  display: 'flex',
  flexDirection: 'column',
  gap: space[8],
  paddingTop: space[12],
  paddingBottom: space[16],
  paddingInline: space[16],
  borderRadius: radius[12],
  background: color.neutral[50],
});

export const countdownRow = style({
  ...typography.caption,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  margin: 0,
  color: color.neutral[600],
});

export const countdownValue = style({
  ...typography.bodySStrong,
  color: color.primary[500],
  fontVariantNumeric: 'tabular-nums',
});

export const track = style({
  height: '6px',
  overflow: 'hidden',
  borderRadius: '3px',
  background: color.neutral[200],
});

export const fill = style({
  height: '100%',
  borderRadius: '3px',
  background: color.primary[500],
  transition: 'width 1s linear',
});
