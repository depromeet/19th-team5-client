type Hex = `#${string}`;
type Px = `${number}px`;

export const color = {
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
  primary: {
    50: '#EEF3FD',
    100: '#DCE6FB',
    200: '#B9CCF7',
    300: '#8DAAF0',
    400: '#5C83E9',
    500: '#2D5BE3',
    600: '#2349C2',
    700: '#1C3A9C',
    800: '#172F7A',
    900: '#12245C',
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
} as const satisfies Record<string, Record<number, Hex>>;

export const fontFamily = {
  pretendard:
    "Pretendard, -apple-system, BlinkMacSystemFont, system-ui, 'Apple SD Gothic Neo', sans-serif",
} as const;

export const fontSize = {
  12: '12px',
  14: '14px',
  16: '16px',
  18: '18px',
  20: '20px',
  24: '24px',
  32: '32px',
  40: '40px',
  56: '56px',
} as const satisfies Record<number, Px>;

export const fontWeight = {
  regular: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
} as const;

export const lineHeight = {
  16: '16px',
  20: '20px',
  24: '24px',
  28: '28px',
  32: '32px',
  44: '44px',
  52: '52px',
  64: '64px',
} as const satisfies Record<number, Px>;

export const space = {
  4: '4px',
  8: '8px',
  12: '12px',
  16: '16px',
  20: '20px',
  24: '24px',
  32: '32px',
  40: '40px',
  48: '48px',
  64: '64px',
  80: '80px',
} as const satisfies Record<number, Px>;

export const radius = {
  4: '4px',
  8: '8px',
  12: '12px',
  16: '16px',
  24: '24px',
  full: '999px',
} as const satisfies Record<string, Px>;
