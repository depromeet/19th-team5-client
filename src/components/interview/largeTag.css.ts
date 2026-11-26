import { style } from '@vanilla-extract/css';
import { radius, typography } from '@/styles/token';

/**
 * 참가자 상태·질문 완료 표시처럼 높이 28px로 쓰는 Tag.
 * Figma 디자인 시스템에 Tag 크기 변형이 정해지면 공통 Tag의 variant로 옮긴다.
 */
export const largeTag = style({
  selectors: {
    'span&': {
      ...typography.caption,
      borderRadius: radius[8],
    },
  },
});
