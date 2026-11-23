// TODO(#10): 토큰 체계 개편(createGlobalTheme → as const) 동안 임시로 주석 처리했다.
// 참조하던 colors.css·layout.css·typography.css·primaryTone은 삭제되었다.
// 컴포넌트 구현 시 새 토큰(@/styles/token) 기준으로 다시 작성할지 삭제할지 결정한다.
// 원본: 675da50 [#3] chore(design-system): 전역 디자인 토큰 등록

// import { createGlobalTheme } from '@vanilla-extract/css';
// import { color } from '../../styles/colors.css';
// import { radius, space } from '../../styles/layout.css';
// import { primaryTone } from '../../styles/primaryTone';
// import { typography } from '../../styles/typography.css';
//
// const visitorInk = createGlobalTheme(':root', {
//   accent: primaryTone(color.primary[500], 3.433, 1.3077, 0.2479), // #4C6FFF
//   start: primaryTone(color.primary[500], -2.835, 0.7265, -0.7353), // #101C38
//   end: primaryTone(color.primary[500], -0.892, 0.7311, -0.5331), // #1C2F63
//   glow: primaryTone(color.primary[500], 3.165, 0.7031, -0.3162), // #2B3F8F
// });
//
// const white = color.neutral[0];
// const employeeInk = createGlobalTheme(':root', {
//   accent: '#C9D3E6',
//   glow: '#8EA3C8',
//   start: '#0A1220',
//   end: '#1B2640',
// });
//
// function translucent(base: string, opacity: number) {
//   return `rgb(from ${base} r g b / ${opacity}%)`;
// }
//
// function stripe(accent: string) {
//   return `linear-gradient(90deg, ${accent}, ${translucent(accent, 20)})`;
// }
//
// const appearance = createGlobalTheme(':root', {
//   visitor: {
//     badge: translucent(visitorInk.accent, 22),
//     stripe: stripe(visitorInk.accent),
//     background: [
//       `radial-gradient(ellipse 40% 40% at 0% 100%, ${translucent(visitorInk.glow, 40)}, transparent)`,
//       `radial-gradient(ellipse 45% 45% at 95% 0%, ${translucent(visitorInk.accent, 45)}, transparent)`,
//       `linear-gradient(134deg, ${visitorInk.start} 7%, ${visitorInk.end} 78%)`,
//     ].join(', '),
//   },
//   employee: {
//     badge: translucent(employeeInk.accent, 16),
//     stripe: stripe(employeeInk.accent),
//     background: [
//       `radial-gradient(ellipse 40% 40% at 95% 5%, ${translucent(employeeInk.glow, 25)}, transparent)`,
//       `linear-gradient(134deg, ${employeeInk.start} 7%, ${employeeInk.end} 78%)`,
//     ].join(', '),
//   },
//   foreground: white,
//   role: translucent(white, 60),
//   label: translucent(white, 45),
//   value: translucent(white, 90),
//   border: translucent(white, 12),
//   divider: translucent(white, 12),
//   portraitBackground: translucent(white, 10),
//   slotBackground: white,
//   slotBorder: color.neutral[500],
//   watermarkOpacity: '0.07',
//   watermarkRotation: '12deg',
//   watermarkBlendMode: 'lighten',
//   badgeHeight: '28px',
//   badgeRadius: radius.full,
//   badgePaddingInline: space[12],
// });
//
// const dimensions = createGlobalTheme(':root', {
//   large: {
//     width: '288px',
//     height: '392px',
//     watermarkWidth: '104px',
//     watermarkHeight: '208px',
//     radius: '23.4px',
//     paddingInline: space[20],
//     portraitWidth: '98.8px',
//     portraitHeight: '119.6px',
//     portraitRadius: '15.6px',
//     portraitTop: '56px',
//     slotWidth: '46.8px',
//     slotHeight: '10.4px',
//     slotBorderWidth: '2.6px',
//     slotTop: space[16],
//     borderWidth: '1.3px',
//     stripeHeight: '7.8px',
//     shadow: '0 10.4px 31.2px rgb(13 26 46 / 12%)',
//   },
//   medium: {
//     width: '220px',
//     height: '300px',
//     watermarkWidth: space[80],
//     watermarkHeight: '160px',
//     radius: '18px',
//     paddingInline: space[16],
//     portraitWidth: '76px',
//     portraitHeight: '92px',
//     portraitRadius: radius[12],
//     portraitTop: '44px',
//     slotWidth: '36px',
//     slotHeight: space[8],
//     slotBorderWidth: '2px',
//     slotTop: space[12],
//     borderWidth: '1px',
//     stripeHeight: '6px',
//     shadow: '0 8px 24px rgb(13 26 46 / 12%)',
//   },
//   small: {
//     width: '160px',
//     height: '216px',
//     watermarkWidth: space[80],
//     watermarkHeight: '160px',
//     radius: '18px',
//     portraitWidth: space[64],
//     portraitHeight: '77.4737px',
//     portraitRadius: '10.1053px',
//     portraitTop: space[32],
//     slotWidth: '28px',
//     slotHeight: space[8],
//     slotBorderWidth: '2px',
//     slotTop: space[12],
//     borderWidth: '1px',
//     stripeHeight: '0px',
//     shadow: '0 8px 24px rgb(13 26 46 / 12%)',
//   },
// });
//
// export const pass = {
//   ...appearance,
//   size: dimensions,
//   typography: {
//     name: {
//       large: typography.h3,
//       medium: typography.bodyLStrong,
//       small: typography.bodySStrong,
//     },
//     role: typography.caption,
//     label: typography.caption,
//     value: typography.captionStrong,
//     badge: typography.captionStrong,
//   },
// };
