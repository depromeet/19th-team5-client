import { globalStyle, style } from '@vanilla-extract/css';
import { color, radius, space, typography } from '@/styles/token';

export const panel = style({
  display: 'flex',
  flexDirection: 'column',
  gap: space[16],
  minWidth: 0,
  minHeight: 0,
  paddingBlock: space[24],
  paddingInline: space[32],
  border: `1px solid ${color.neutral[200]}`,
  borderRadius: radius[16],
  background: color.neutral[0],
});

export const header = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: space[8],
});

export const heading = style({
  ...typography.bodyLStrong,
  margin: 0,
  color: color.neutral[900],
});

export const count = style({
  ...typography.bodySStrong,
  color: color.neutral[500],
  fontVariantNumeric: 'tabular-nums',
});

export const scrollArea = style({
  display: 'flex',
  flexDirection: 'column',
  flex: 1,
  minHeight: 0,
  gap: space[16],
  marginInline: `-${space[4]}`,
  paddingInline: space[4],
  overflowY: 'auto',
  overscrollBehavior: 'contain',
});

export const helper = style({
  ...typography.caption,
  margin: 0,
  color: color.neutral[500],
});

export const list = style({
  display: 'flex',
  flexDirection: 'column',
  gap: space[16],
  margin: 0,
  padding: 0,
  listStyle: 'none',
});

export const collapsed = style({
  display: 'flex',
  flexDirection: 'column',
  gap: space[8],
  padding: space[16],
  borderRadius: radius[12],
  background: color.neutral[50],
});

export const expanded = style({
  display: 'flex',
  flexDirection: 'column',
  gap: space[12],
  paddingTop: space[16],
  paddingBottom: space[24],
  paddingInline: space[16],
  border: `1.5px solid ${color.neutral[900]}`,
  borderRadius: radius[12],
  background: color.neutral[0],
});

export const row = style({
  display: 'flex',
  alignItems: 'center',
  gap: space[12],
});

export const number = style({
  ...typography.bodySStrong,
  flexShrink: 0,
  color: color.neutral[900],
});

export const expandButton = style({
  ...typography.bodyM,
  flex: 1,
  minWidth: 0,
  margin: 0,
  padding: 0,
  border: 0,
  background: 'transparent',
  color: color.neutral[900],
  textAlign: 'start',
  overflowWrap: 'anywhere',
  cursor: 'pointer',
  selectors: {
    '&:focus-visible': {
      outline: `2px solid ${color.primary[500]}`,
      outlineOffset: '2px',
    },
  },
});

export const emptyText = style({ color: color.neutral[400] });

export const deleteButton = style({
  selectors: {
    'button&': {
      width: space[24],
      height: space[24],
      margin: `-${space[4]}`,
      padding: 0,
      color: color.neutral[500],
    },
  },
});

export const tags = style({
  display: 'flex',
  flexWrap: 'wrap',
  gap: space[8],
  paddingInlineStart: space[24],
});

export const editorHeader = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: space[12],
});

export const leading = style({
  ...typography.bodySStrong,
  display: 'flex',
  alignItems: 'center',
  gap: space[12],
});

export const fieldLabel = style({
  display: 'inline-flex',
  gap: space[4],
  color: color.neutral[600],
});

export const requiredMark = style({ color: color.danger[500] });

export const questionInput = style({
  ...typography.bodyM,
  width: '100%',
  margin: 0,
  paddingBlock: space[12],
  paddingInline: space[16],
  border: 0,
  borderRadius: radius[8],
  outline: 'none',
  background: color.neutral[50],
  color: color.neutral[900],
  selectors: {
    '&::placeholder': { color: color.neutral[400] },
    '&:focus-visible': {
      boxShadow: `inset 0 0 0 1px ${color.neutral[400]}`,
    },
  },
});

/** 공통 TextArea를 Figma 질문 카드에 맞춘다: 라벨 색, 모서리 8px, 내용만큼 늘어나는 높이 */
export const field = style({});

globalStyle(`${field} > label`, {
  color: color.neutral[600],
});

globalStyle(`${field} > div`, {
  height: 'auto',
  minHeight: '70px',
  borderRadius: radius[8],
});

globalStyle(`${field} textarea`, {
  fieldSizing: 'content',
});

export const emptyAddButton = style({});

globalStyle(`${emptyAddButton} > button`, {
  justifyContent: 'center',
});

export const footer = style({
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'flex-end',
  flexShrink: 0,
  gap: space[8],
});
