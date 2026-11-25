import { style } from '@vanilla-extract/css';
import { color, radius, space, typography } from '@/styles/token';

export const rejoin = style({
  ...typography.bodyM,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: space[12],
  minHeight: '68px',
  margin: 0,
  paddingBlock: space[16],
  paddingInline: space[24],
  borderRadius: radius[12],
  background: color.neutral[50],
  color: color.neutral[600],
});

/** 보조 버튼은 글자 폭만큼, 주 버튼이 남은 폭을 채운다. (Figma: 136 + 392) */
export const leaveButton = style({
  selectors: {
    'button&': { flexShrink: 0 },
  },
});

/** Figma의 다이얼로그는 제목과 보조 문구를 가운데 정렬한다. */
export const centeredText = style({ textAlign: 'center' });
