import { createGlobalTheme } from '@vanilla-extract/css';
import { color } from '../../styles/colors.css';
import { grid, radius, space } from '../../styles/layout.css';
import { typography } from '../../styles/typography.css';

const { neutral } = color;
const values = createGlobalTheme(':root', {
  width: grid.frameWidth,
  height: space[80],
  paddingInline: grid.marginInline,
  linkGap: space[32],
  actionGap: space[12],
  actionWidth: '118px',
  actionHeight: space[40],
  actionRadius: radius[12],
  background: color.surface.page,
  actionBackground: color.primary[500],
  actionForeground: color.text.inverse,
  notificationColor: color.error.foreground,
  notificationSize: '6px',
  signedIn: {
    link: neutral[400],
    activeLink: '#000000',
    ticketBackground: neutral[100],
    ticketLabel: neutral[600],
    ticketCount: neutral[900],
  },
  signedOut: { link: neutral[600], login: color.text.link },
  locked: {
    link: neutral[300],
    message: color.text.secondary,
    icon: neutral[700],
  },
});

export const gnb = { ...values, typography: typography.bodySStrong };
