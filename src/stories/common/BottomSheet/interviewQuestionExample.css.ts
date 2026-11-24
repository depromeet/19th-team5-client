import { style } from '@vanilla-extract/css';
import { color, radius, space, typography } from '@/styles/token';
import * as shared from './bottomSheet.stories.css';

export const questionCard = style([
  shared.interviewCard,
  {
    width: '100%',
    alignItems: 'stretch',
    gap: space[12],
  },
]);

export const intent = style({
  ...typography.bodyS,
  margin: 0,
  color: color.neutral[600],
});

export const microphoneControls = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  alignSelf: 'center',
  gap: space[8],
  width: '240px',
  maxWidth: '100%',
  padding: space[12],
  marginTop: 'auto',
  borderRadius: radius[24],
  background: color.neutral[0],
  boxShadow: '0 20px 56px rgb(18 23 28 / 16%)',
});

export const iconButton = style({
  selectors: {
    'button&': {
      padding: 0,
      width: space[48],
      height: space[48],
      flexShrink: 0,
    },
  },
});

export const micStatus = style({
  ...typography.captionStrong,
  display: 'flex',
  alignItems: 'center',
  gap: space[8],
  color: color.neutral[700],
  selectors: {
    '&::before': {
      content: '""',
      width: space[8],
      height: space[8],
      borderRadius: radius.full,
      background: color.neutral[400],
    },
    '&[data-on="true"]::before': { background: color.success[500] },
  },
});

export const historyHeading = style({
  ...typography.bodyS,
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: space[8],
  minHeight: space[32],
  color: color.neutral[500],
});

export const historyTitle = style({
  ...typography.bodySStrong,
  color: color.neutral[900],
  margin: 0,
});

export const historyScroll = style({
  maxHeight: '175px',
  overflowY: 'auto',
  overscrollBehavior: 'contain',
  maskImage: 'linear-gradient(to bottom, black calc(100% - 24px), transparent)',
  paddingBottom: space[24],
});

export const historyList = style({
  listStyle: 'none',
  margin: 0,
  padding: 0,
  display: 'grid',
  gap: space[8],
});

export const historyItem = style({
  ...typography.bodyS,
  display: 'flex',
  alignItems: 'flex-start',
  gap: space[12],
  padding: `${space[12]} ${space[16]}`,
  borderRadius: radius[12],
  background: color.neutral[0],
  color: color.neutral[700],
});

export const noteLabel = style([shared.badge, { flexShrink: 0 }]);

export const memoColumn = style({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  gap: space[12],
  '@media': {
    '(min-width: 768px)': { paddingBottom: space[24] },
  },
});

export const memoField = style({
  position: 'relative',
  flex: 1,
  minHeight: '160px',
});

export const memo = style([
  shared.memo,
  {
    position: 'absolute',
    inset: 0,
    paddingBottom: space[48],
    selectors: { '&::placeholder': { color: color.neutral[400], opacity: 1 } },
  },
]);

export const counter = style({
  ...typography.caption,
  position: 'absolute',
  right: space[16],
  bottom: space[16],
  color: color.neutral[500],
  pointerEvents: 'none',
});

export const saveButton = style({
  alignSelf: 'flex-end',
  minWidth: '120px',
  selectors: { 'button&:disabled': { color: color.neutral[900] } },
});
