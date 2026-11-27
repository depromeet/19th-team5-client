import { globalStyle, style } from '@vanilla-extract/css';
import { space } from '@/styles/token';

/** HUD 위치는 Figma(1920×1080, GNB 80px 아래 기준) 값을 따른다. */
const sideInset = '68px';
const mobile = '(max-width: 700px)';
const shortScreen = '(max-height: 740px)';

export const notice = style({
  position: 'absolute',
  top: space[24],
  right: sideInset,
  '@media': {
    [mobile]: {
      right: space[16],
      maxWidth: `calc(100% - 2 * ${space[16]})`,
    },
  },
});

export const upcoming = style({
  position: 'absolute',
  right: sideInset,
  bottom: space[48],
  '@media': {
    [mobile]: {
      right: space[16],
      bottom: space[80],
      maxWidth: `calc(100% - 2 * ${space[16]})`,
    },
  },
});

/** 높이가 좁으면 알림과 예약 카드가 월드 채팅 위에서 함께 스크롤된다. */
export const interviewCards = style({
  display: 'contents',
  '@media': {
    [shortScreen]: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-end',
      position: 'absolute',
      top: space[16],
      right: sideInset,
      maxWidth: `calc(100% - 2 * ${space[16]})`,
      maxHeight: `calc(100% - ${space[16]} - ${space[80]})`,
      gap: space[12],
      overflowY: 'auto',
      overscrollBehaviorY: 'contain',
    },
    [`${shortScreen} and ${mobile}`]: { right: space[16] },
  },
});

globalStyle(`${interviewCards} > :is(${notice}, ${upcoming})`, {
  '@media': {
    [shortScreen]: { position: 'static', flexShrink: 0, maxWidth: '100%' },
  },
});

export const worldChat = style({
  position: 'absolute',
  left: sideInset,
  bottom: space[32],
  '@media': {
    [mobile]: {
      left: space[16],
      bottom: space[12],
      maxWidth: `calc(100% - 2 * ${space[16]})`,
    },
  },
});

/**
 * 키오스크 사용 안내의 기본 위치(Figma). 3D 씬이 키오스크 위 좌표를 알려주면 그 위 24px로 옮겨 가고,
 * 씬을 불러오는 중이거나 3D를 쓸 수 없을 때만 이 자리에 있다.
 */
export const kioskPrompt = style({
  position: 'absolute',
  top: '380px',
  left: '560px',
  '@media': {
    '(max-width: 800px)': {
      top: '52%',
      left: '50%',
      transform: 'translateX(-50%)',
    },
  },
});
