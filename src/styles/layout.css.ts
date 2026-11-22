import { createGlobalTheme } from '@vanilla-extract/css';

export const { space, radius, stroke } = createGlobalTheme(':root', {
  space: {
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
  },
  radius: {
    4: '4px',
    8: '8px',
    12: '12px',
    16: '16px',
    24: '24px',
    full: '999px',
  },
  stroke: { default: '1px' },
});

const desktop = createGlobalTheme(':root', {
  frameWidth: '1920px',
  frameHeight: '1080px',
  contentWidth: '1224px',
  columns: '12',
  columnWidth: '80px',
  gutter: space[24],
  marginInline: '348px',
});

// DS/04의 화면별 컬럼 조합은 잠정 값이다.
const layout = createGlobalTheme(':root', {
  myPage: { sidebar: '392px', gap: desktop.gutter, content: '808px' },
  resume: { editor: '808px', gap: desktop.gutter, preview: '392px' },
  onboarding: { leading: '600px', gap: '128px', trailing: '496px' },
  dialog: '600px',
  interviewQuestion: '1016px',
});
export const grid = { ...desktop, layout };
