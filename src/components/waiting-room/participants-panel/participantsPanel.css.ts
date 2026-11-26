import { style } from '@vanilla-extract/css';
import { color, radius, space, typography } from '@/styles/token';
import { hudShadow } from '../hud.css';

export const participants = style({
  display: 'flex',
  flexDirection: 'column',
  gap: space[4],
  width: '320px',
  padding: space[16],
  borderRadius: radius[24],
  background: color.neutral[0],
  boxShadow: hudShadow,
});

export const participantsHeader = style({
  ...typography.bodySStrong,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: space[8],
  paddingTop: space[4],
  paddingBottom: space[8],
  paddingInline: space[8],
});

export const participantsTitle = style({
  font: 'inherit',
  margin: 0,
  color: color.neutral[600],
});

export const participantsCount = style({ color: color.neutral[900] });

export const participantList = style({
  display: 'flex',
  flexDirection: 'column',
  gap: space[4],
  margin: 0,
  padding: 0,
  listStyle: 'none',
});

export const participant = style({
  display: 'flex',
  alignItems: 'center',
  gap: space[12],
  padding: space[8],
});

export const participantIcon = style({ flexShrink: 0 });

export const participantText = style({
  display: 'flex',
  flexDirection: 'column',
  flex: 1,
  minWidth: 0,
});

export const participantName = style({
  ...typography.bodySStrong,
  color: color.neutral[900],
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
});

export const participantRole = style({
  ...typography.caption,
  color: color.neutral[500],
});
