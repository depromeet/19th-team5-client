import { globalStyle, style } from '@vanilla-extract/css';
import { space } from '@/styles/token';

export const editor = style({
  display: 'flex',
  flex: 1,
  flexDirection: 'column',
  gap: space[12],
  '@media': {
    // 저장 버튼 아래를 왼쪽 질문 카드의 하단 독과 같은 높이에서 끝낸다.
    '(min-width: 768px)': { paddingBottom: space[24] },
  },
});

export const field = style({
  flex: 1,
  minHeight: '160px',
});

/** 공통 TextArea는 입력 상자 높이가 120px로 정해져 있어서, 메모 칸에서는 남은 높이를 채우게 한다. */
globalStyle(`${field} > div`, {
  flex: 1,
  height: 'auto',
});

export const saveButton = style({
  selectors: {
    'button&': { alignSelf: 'flex-end', minWidth: '120px' },
  },
});
