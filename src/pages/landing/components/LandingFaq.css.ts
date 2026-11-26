import { globalStyle, style } from '@vanilla-extract/css';
import { color, radius, space, typography } from '@/styles/token';

export const faqTitle = style({ ...typography.h2, marginBottom: space[20] });
export const question = style({
  border: `1px solid ${color.neutral[200]}`,
  borderRadius: radius[16],
  selectors: { '& + &': { marginTop: space[12] } },
});
export const summary = style({
  ...typography.bodyMStrong,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: space[16],
  cursor: 'pointer',
  padding: `${space[16]} ${space[24]}`,
  listStyleType: 'none',
  '::after': { content: '"+"', color: color.neutral[600], flexShrink: 0 },
  selectors: { [`${question}[open] &::after`]: { content: '"−"' } },
});
globalStyle(`${summary}::-webkit-details-marker`, { display: 'none' });
export const answer = style({
  ...typography.bodyS,
  padding: `0 ${space[24]} ${space[20]}`,
  color: color.neutral[600],
});
