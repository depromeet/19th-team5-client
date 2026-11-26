import { globalStyle, style } from '@vanilla-extract/css';
import { box } from '@/components/common/text-field/textField.css';
import { color, radius, space, typography } from '@/styles/token';

const mobile = '(max-width: 640px)';

export const page = style({
  display: 'flex',
  flexDirection: 'column',
  minHeight: '100dvh',
  color: color.neutral[900],
});

export const main = style({
  display: 'grid',
  flex: 1,
  placeItems: 'center',
  padding: space[24],
  backgroundColor: color.neutral[200],
  backgroundImage: 'linear-gradient(#12161C59, #12161C59)',
  '@media': { [mobile]: { padding: space[16] } },
});

export const card = style({
  width: '100%',
  maxWidth: '600px',
  padding: space[40],
  borderRadius: radius[24],
  backgroundColor: color.neutral[0],
  boxShadow: '0 20px 56px rgb(18 23 28 / 16%)',
  '@media': { [mobile]: { padding: space[24] } },
});

export const brand = style({
  ...typography.h3,
  display: 'flex',
  alignItems: 'center',
  gap: space[12],
  marginBottom: space[24],
});

export const title = style({ ...typography.h3, margin: 0 });
export const description = style({
  ...typography.bodyM,
  color: color.neutral[600],
  margin: `${space[8]} 0 ${space[24]}`,
});

export const fields = style({
  display: 'grid',
  gap: space[16],
  marginBottom: space[24],
});

// 각 입력 아래에 한 줄의 검증 문구가 들어갈 자리를 둔다.
export const field = style({ minHeight: '108px' });
globalStyle(`${field} label`, { color: color.neutral[700] });
globalStyle(`${field}:not([data-invalid]) ${box}:not(:focus-within)`, {
  borderColor: color.neutral[300],
});

export const submit = style({
  selectors: { 'button&': { borderRadius: '14px' } },
});

export const links = style({
  ...typography.bodySStrong,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  gap: space[16],
  minHeight: space[32],
  marginTop: space[24],
  color: color.neutral[300],
});

export const link = style({
  ...typography.bodySStrong,
  color: color.primary[500],
  textDecoration: 'none',
  border: 0,
  background: 'transparent',
  padding: 0,
  cursor: 'pointer',
  ':hover': { textDecoration: 'underline' },
});

export const agreement = style({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: space[12],
  marginBottom: space[24],
});

export const consent = style({
  ...typography.bodyM,
  display: 'flex',
  alignItems: 'center',
  gap: space[12],
  color: color.neutral[700],
  cursor: 'pointer',
});

export const details = style([
  link,
  { color: color.neutral[500], flexShrink: 0 },
]);
export const notice = style({
  ...typography.bodyS,
  margin: `${space[12]} 0 0`,
  color: color.neutral[600],
});
export const termsNotice = style([notice, { margin: `0 0 ${space[24]}` }]);
export const error = style([notice, { color: color.danger[600] }]);
export const mockMail = style({
  ...typography.bodyM,
  display: 'grid',
  gap: space[8],
  marginTop: space[24],
  padding: space[16],
  borderRadius: radius[12],
  background: color.neutral[50],
  overflowWrap: 'anywhere',
});
globalStyle(`${mockMail} p`, { margin: 0 });
