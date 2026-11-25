import { style } from '@vanilla-extract/css';
import { color, radius, space, typography } from '@/styles/token';

const mobile = '(max-width: 640px)';

export const header = style({
  background: color.neutral[0],
});

export const content = style({
  display: 'flex',
  alignItems: 'center',
  flexWrap: 'wrap',
  columnGap: space[32],
  rowGap: space[4],
  width: `calc(100% - 2 * ${space[24]})`,
  maxWidth: '1224px',
  minHeight: space[80],
  marginInline: 'auto',
  '@media': {
    [mobile]: {
      width: `calc(100% - 2 * ${space[16]})`,
      justifyContent: 'space-between',
      columnGap: space[8],
      paddingBlock: space[8],
    },
  },
});

export const logo = style({
  ...typography.h3,
  width: space[80],
  flexShrink: 0,
  color: color.neutral[900],
  textDecoration: 'none',
});

export const menu = style({
  display: 'flex',
  alignItems: 'center',
  flexWrap: 'wrap',
  columnGap: space[32],
  marginInlineStart: 'auto',
  '@media': {
    [mobile]: {
      order: 1,
      width: '100%',
      columnGap: space[24],
      marginInlineStart: 0,
    },
  },
});

export const menuLink = style({
  ...typography.bodySStrong,
  display: 'inline-flex',
  alignItems: 'center',
  minHeight: space[40],
  textDecoration: 'none',
  color: color.neutral[600],
  whiteSpace: 'nowrap',
});

export const memberLink = style([
  menuLink,
  {
    gap: space[4],
    color: color.neutral[400],
    selectors: {
      '&[aria-current]': { color: color.neutral[900] },
      'button&:disabled': {
        border: 0,
        padding: 0,
        background: 'transparent',
        cursor: 'not-allowed',
      },
    },
  },
]);

export const unreadDot = style({
  alignSelf: 'center',
  transform: 'translateY(-7px)',
  width: '6px',
  height: '6px',
  borderRadius: radius.full,
  background: color.danger[500],
});

export const login = style([
  menuLink,
  {
    selectors: { 'button&': { padding: 0, color: color.primary[500] } },
  },
]);

export const disabledLink = style([
  menuLink,
  {
    selectors: {
      'button&:disabled': {
        padding: 0,
        background: 'transparent',
        color: color.neutral[300],
      },
    },
  },
]);

export const actions = style({
  display: 'flex',
  alignItems: 'center',
  flexWrap: 'wrap',
  gap: space[12],
  '@media': { [mobile]: { gap: space[8] } },
});

export const filledButton = style({
  selectors: {
    'button&': {
      minWidth: '118px',
      minHeight: space[40],
      padding: `${space[8]} ${space[16]}`,
      borderRadius: radius[12],
      background: color.primary[500],
    },
    'button&:disabled': {
      background: color.primary[500],
      color: color.neutral[0],
    },
  },
  '@media': {
    [mobile]: {
      selectors: { 'button&': { minWidth: 0, paddingInline: space[12] } },
    },
  },
});

export const ticket = style({
  ...typography.bodySStrong,
  display: 'inline-flex',
  alignItems: 'center',
  gap: space[8],
  minWidth: '118px',
  minHeight: space[40],
  paddingInline: space[12],
  borderRadius: radius[12],
  color: color.neutral[600],
  background: color.neutral[100],
  whiteSpace: 'nowrap',
  '@media': {
    [mobile]: { minWidth: 0, gap: space[4], paddingInline: space[8] },
  },
});

export const ticketIcon = style({ flexShrink: 0 });
export const ticketCount = style({ color: color.neutral[900] });

export const waitingMessage = style({
  ...typography.bodySStrong,
  display: 'inline-flex',
  alignItems: 'center',
  gap: space[8],
  color: color.neutral[500],
});

export const lockIcon = style({ color: color.neutral[700], flexShrink: 0 });
