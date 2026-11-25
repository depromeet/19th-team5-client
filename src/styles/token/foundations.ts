import { fontFamily, fontSize, fontWeight, lineHeight } from './primitives';

type TextStyle = {
  fontFamily: string;
  fontSize: string;
  fontWeight: number;
  lineHeight: string;
  letterSpacing: `${number}px`;
};

export const typography = {
  display: {
    fontFamily: fontFamily.pretendard,
    fontSize: fontSize[56],
    fontWeight: fontWeight.bold,
    lineHeight: lineHeight[64],
    letterSpacing: '-1.12px',
  },
  h1: {
    fontFamily: fontFamily.pretendard,
    fontSize: fontSize[40],
    fontWeight: fontWeight.bold,
    lineHeight: lineHeight[52],
    letterSpacing: '-0.6px',
  },
  h2: {
    fontFamily: fontFamily.pretendard,
    fontSize: fontSize[32],
    fontWeight: fontWeight.bold,
    lineHeight: lineHeight[44],
    letterSpacing: '-0.32px',
  },
  h3: {
    fontFamily: fontFamily.pretendard,
    fontSize: fontSize[24],
    fontWeight: fontWeight.bold,
    lineHeight: lineHeight[32],
    letterSpacing: '-0.24px',
  },
  title: {
    fontFamily: fontFamily.pretendard,
    fontSize: fontSize[20],
    fontWeight: fontWeight.semibold,
    lineHeight: lineHeight[28],
    letterSpacing: '-0.1px',
  },
  bodyL: {
    fontFamily: fontFamily.pretendard,
    fontSize: fontSize[18],
    fontWeight: fontWeight.regular,
    lineHeight: lineHeight[28],
    letterSpacing: '-0.05px',
  },
  bodyLStrong: {
    fontFamily: fontFamily.pretendard,
    fontSize: fontSize[18],
    fontWeight: fontWeight.semibold,
    lineHeight: lineHeight[28],
    letterSpacing: '-0.05px',
  },
  bodyM: {
    fontFamily: fontFamily.pretendard,
    fontSize: fontSize[16],
    fontWeight: fontWeight.regular,
    lineHeight: lineHeight[24],
    letterSpacing: '-0.05px',
  },
  bodyMStrong: {
    fontFamily: fontFamily.pretendard,
    fontSize: fontSize[16],
    fontWeight: fontWeight.semibold,
    lineHeight: lineHeight[24],
    letterSpacing: '-0.05px',
  },
  bodyS: {
    fontFamily: fontFamily.pretendard,
    fontSize: fontSize[14],
    fontWeight: fontWeight.regular,
    lineHeight: lineHeight[20],
    letterSpacing: '-0.03px',
  },
  bodySStrong: {
    fontFamily: fontFamily.pretendard,
    fontSize: fontSize[14],
    fontWeight: fontWeight.semibold,
    lineHeight: lineHeight[20],
    letterSpacing: '-0.03px',
  },
  caption: {
    fontFamily: fontFamily.pretendard,
    fontSize: fontSize[14],
    fontWeight: fontWeight.regular,
    lineHeight: lineHeight[20],
    letterSpacing: '0px',
  },
  captionStrong: {
    fontFamily: fontFamily.pretendard,
    fontSize: fontSize[14],
    fontWeight: fontWeight.semibold,
    lineHeight: lineHeight[20],
    letterSpacing: '0px',
  },
  tag: {
    fontFamily: fontFamily.pretendard,
    fontSize: fontSize[12],
    fontWeight: fontWeight.medium,
    lineHeight: lineHeight[16],
    letterSpacing: '0px',
  },
} as const satisfies Record<string, TextStyle>;
