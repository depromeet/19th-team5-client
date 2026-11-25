import { globalFontFace, globalStyle } from '@vanilla-extract/css';
import { fontFamily, fontWeight } from '@/styles/token';

globalFontFace('Pretendard', [
  {
    src: "url('/fonts/Pretendard-Regular.woff2') format('woff2')",
    fontWeight: fontWeight.regular,
    fontStyle: 'normal',
    fontDisplay: 'swap',
  },
  {
    src: "url('/fonts/Pretendard-Medium.woff2') format('woff2')",
    fontWeight: fontWeight.medium,
    fontStyle: 'normal',
    fontDisplay: 'swap',
  },
  {
    src: "url('/fonts/Pretendard-SemiBold.woff2') format('woff2')",
    fontWeight: fontWeight.semibold,
    fontStyle: 'normal',
    fontDisplay: 'swap',
  },
  {
    src: "url('/fonts/Pretendard-Bold.woff2') format('woff2')",
    fontWeight: fontWeight.bold,
    fontStyle: 'normal',
    fontDisplay: 'swap',
  },
]);

globalStyle('*, *::before, *::after', {
  boxSizing: 'border-box',
});

globalStyle('html, body', {
  margin: 0,
  padding: 0,
});

globalStyle('body', {
  fontFamily: fontFamily.pretendard,
});
