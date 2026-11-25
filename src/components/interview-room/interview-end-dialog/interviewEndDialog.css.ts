import { style } from '@vanilla-extract/css';
import { space } from '@/styles/token';

/**
 * 아바타는 머리부터 허리까지만 보이게 자른다.
 * Figma: 312×205 영역, 머리 위 여백 40px, 캐릭터 폭 약 120px
 */
export const avatar = style({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'flex-start',
  boxSizing: 'border-box',
  height: '205px',
  paddingTop: space[40],
  overflow: 'hidden',
});

export const avatarImage = style({
  display: 'block',
  width: '120px',
  height: 'auto',
});

/** Figma의 다이얼로그는 제목과 보조 문구를 가운데 정렬한다. */
export const centeredText = style({ textAlign: 'center' });
