import { createGlobalTheme } from '@vanilla-extract/css';
import { primaryTone } from './primaryTone';

const { brandPrimary } = createGlobalTheme(':root', {
  brandPrimary: '#2D5BE3',
});

export const { neutral, danger, success } = createGlobalTheme(':root', {
  neutral: {
    0: '#FFFFFF',
    50: '#F4F7FB',
    100: '#E9EEF5',
    200: '#D9E1EC',
    300: '#BCC8D8',
    400: '#93A2B8',
    500: '#6A7A93',
    600: '#4E5E77',
    700: '#36455C',
    800: '#212E44',
    900: '#0E1A2E',
  },
  danger: {
    50: '#FEF0F0',
    100: '#FDDEDF',
    200: '#FBBDBF',
    300: '#F59497',
    400: '#EE6B70',
    500: '#E5484D',
    600: '#C93439',
    700: '#A6292D',
    800: '#822126',
    900: '#5F191C',
  },
  success: {
    50: '#E9F7F2',
    100: '#CFEEE4',
    200: '#A0DCC9',
    300: '#6CC7AB',
    400: '#3EB18F',
    500: '#1F9E78',
    600: '#198262',
    700: '#14674E',
    800: '#104F3C',
    900: '#0B392B',
  },
});

const { tones } = createGlobalTheme(':root', {
  tones: {
    50: primaryTone(brandPrimary, -4.835, 1.0324, 0.9202), // #EEF3FD
    100: primaryTone(brandPrimary, -4.19, 1.0394, 0.8361), // #DCE6FB
    200: primaryTone(brandPrimary, -3.222, 1.0394, 0.6723), // #B9CCF7
    300: primaryTone(brandPrimary, -2.411, 1.0036, 0.458), // #8DAAF0
    400: primaryTone(brandPrimary, -1.431, 0.9967, 0.2227), // #5C83E9
    600: primaryTone(brandPrimary, 0.825, 0.908, -0.1581), // #2349C2
    700: primaryTone(brandPrimary, 1.102, 0.9097, -0.3235), // #1C3A9C
    800: primaryTone(brandPrimary, 0.619, 0.8928, -0.4669), // #172F7A
    900: primaryTone(brandPrimary, 0.57, 0.8797, -0.5956), // #12245C
  },
});
const primary = { ...tones, 500: brandPrimary };

const semantic = createGlobalTheme(':root', {
  text: {
    title: neutral[900],
    body: neutral[700],
    secondary: neutral[500],
    disabled: neutral[400],
    inverse: neutral[0],
    link: primary[500],
  },
  icon: { default: neutral[600], disabled: neutral[400] },
  surface: {
    page: neutral[0],
    section: neutral[50],
    chip: neutral[100],
    skeleton: neutral[300],
    dark: neutral[800],
    backdrop: neutral[900],
  },
  border: {
    divider: neutral[100],
    default: neutral[200],
    strong: neutral[300],
  },
  selected: primary[500],
  error: { background: danger[50], foreground: danger[500] },
  positive: { background: success[50], foreground: success[500] },
  dim: `rgb(from ${neutral[900]} r g b / 60%)`,
});

export const color = { neutral, primary, danger, success, ...semantic };
